importScripts('/javascripts/idb-utility.js');

const staticCacheName = 'site-static-v1';
const dynamicCacheName = 'site-dynamic-v1';

// List of static assets to cache
const staticAssets = [
    '/',
    '/addplant',
    '/contact-us',
    '/faq',
    '/manifest.json',
    '/javascripts/API.js',
    '/javascripts/local-storage.js',
    '/javascripts/index.js',
    '/javascripts/idb-utility.js',
    '/javascripts/sightings.js',
    'https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js',
    'https://cdn.jsdelivr.net/npm/uuid@8.3.2/dist/umd/uuidv4.min.js',
    '/css/bootstrap.min.css',
    '/stylesheets/style.css',
    '/stylesheets/partials/header_style.css',
    '/stylesheets/contact-styles.css',
    '/stylesheets/faq-styles.css',
    '/stylesheets/homepage/index.css',
    '/images/logo/botanical-lens-logo.png',
    '/images/contact-us.svg',
    '/images/pink-rose.jpg',
    '/images/lily.jpeg',
    '/images/red-tick.jpg',
    '/images/blue_tick.png',
    '/images/add-plant.svg'
];

// Use the install event to pre-cache static assets
self.addEventListener('install', event => {
    console.log('Service Worker: Installing....');
    event.waitUntil((async () => {
        console.log('Service Worker: Caching App Shell...');
        try {
            const cache = await caches.open(staticCacheName);
            const uploadsFolderUrl = `/api/uploads-list`;
            const uploadsFolderResponse = await fetch(uploadsFolderUrl);
            const uploadedFiles = await uploadsFolderResponse.json();
            const imagesToCache = uploadedFiles.map(file => `${self.location.origin}${file}`);

            await cache.addAll([...staticAssets, ...imagesToCache, '/sightingdetails']);
            console.log('Service Worker: App Shell Cached');
        } catch (error) {
            console.log("Error occurred while caching...", error);
        }
    })());
});

// Activate event to clear old caches
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating....');
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();
            return Promise.all(
                keys.map(cache => {
                    if (cache !== staticCacheName && cache !== dynamicCacheName) {
                        console.log('Service Worker: Removing old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })()
    );
    return self.clients.claim();
});

// Fetch event to fetch from cache first and handle dynamic caching
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Handle API requests separately
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            fetch(request)
                .then(fetchRes => {
                    const cloneRes = fetchRes.clone();
                    caches.open(dynamicCacheName).then(cache => cache.put(request, cloneRes));
                    return fetchRes;
                })
                .catch(() => caches.match(request))
        );
        return;
    }

    // Handle requests for static assets and dynamic caching
    event.respondWith(
        caches.match(request).then(cacheRes => {
            return (
                cacheRes ||
                fetch(request)
                    .then(fetchRes => {
                        return caches.open(dynamicCacheName).then(cache => {
                            if (request.url.indexOf('http') === 0) {
                                cache.put(request.url, fetchRes.clone());
                            }
                            return fetchRes;
                        });
                    })
                    .catch(() => {
                        // Offline fallback for specific pages
                        if (request.url.includes('/sightingdetails')) {
                            return caches.match('/sightingdetails');
                        }
                    })
            );
        })
    );
});

// Sync event for background sync
self.addEventListener('sync', event => {
    if (event.tag === 'sync-plant') {
        console.log('Service Worker: Syncing new Plants');
        openSyncPlantsIDB().then(syncPostDB => {
            getAllSyncPlants(syncPostDB).then(syncPlants => {
                for (const syncPlant of syncPlants) {
                    console.log('Service Worker: Syncing new Plant:', syncPlant);
                    const formData = new FormData();
                    for (const key in syncPlant) {
                        formData.append(key, syncPlant[key]);
                    }

                    fetch('http://localhost:3000/addplant', {
                        method: 'POST',
                        body: formData,
                    })
                        .then(() => {
                            console.log('Service Worker: Syncing new Plant:', syncPlant, 'done');
                            deleteSyncPlantFromIDB(syncPostDB, syncPlant.sightingId)
                                .then(() => {
                                    // After registration is completed, navigate clients
                                    clients.matchAll().then(clients => {
                                        clients.forEach(client => {
                                            client.postMessage({ type: 'SYNC_COMPLETED' });
                                        });
                                    }).catch(err => {
                                        console.log("Error matching clients:", JSON.stringify(err));
                                    });
                                })
                                .catch(err => {
                                    console.error('Service Worker: Syncing new Plant:', syncPlant, 'failed', err);
                                });
                            self.registration.showNotification('Plant Added', {
                                body: 'Plant Added successfully!',
                                icon: '/images/logo/Squared_Logo.png',
                            });
                        })
                        .catch(err => {
                            console.error('Service Worker: Error while syncing plant:', syncPlant, err);
                        });
                }
            });
        });
    }
});
