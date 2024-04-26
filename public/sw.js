importScripts('/javascripts/idb-utility.js');


// Use the install event to pre-cache all initial resources.
self.addEventListener('install', event => {
    console.log('Service Worker: Installing....');
    event.waitUntil((async () => {

        console.log('Service Worker: Caching App Shell at the moment......');
        try {
            const cache = await caches.open("static");
            const uploadsFolderUrl = `/api/uploads-list`;
            const uploadsFolderResponse = await fetch(uploadsFolderUrl);
            const uploadedFiles = await uploadsFolderResponse.json();

            const imagesToCache = uploadedFiles
                .map(file => `${self.location.origin}${file}`)
            cache.addAll([
                '/',
                '/addplant',
                '/manifest.json',
                '/javascripts/API.js',
                '/javascripts/index.js',
                '/javascripts/idb-utility.js',
                'https://maps.googleapis.com/maps/api/js?key=AIzaSyARXO1sAXfsUdl_wxOfVJFFT3naSjyyoII&callback=initMap',
                '/stylesheets/style.css',
                '/stylesheets/partials/header_style.css',
                '/stylesheets/homepage/index.css',
                'https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js',
                'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js',
                '/css/bootstrap.min.css',
                '/images/logo/botanical-lens-logo.png',
                '/images/red-tick.jpg',
                '/images/blue_tick.png',
                '/images/add-plant.svg',
                ...imagesToCache,
            ]);
            console.log('Service Worker: App Shell Cached');
        }
        catch{
            console.log("error occured while caching...")
        }

    })());
});

//clear cache on reload
self.addEventListener('activate', event => {
// Remove old caches
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();
            return keys.map(async (cache) => {
                if(cache !== "static") {
                    console.log('Service Worker: Removing old cache: '+cache);
                    return await caches.delete(cache);
                }
            })
        })()
    )
})

// Fetch event to fetch from cache first
self.addEventListener('fetch', event => {
    event.respondWith((async () => {
        const cache = await caches.open("static");
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
            console.log('Service Worker: Fetching from Cache: ', event.request.url);
            return cachedResponse;
        }
        console.log('Service Worker: Fetching from URL: ', event.request.url);
        return fetch(event.request);
    })());
});

self.addEventListener('sync', event => {
    if (event.tag === 'sync-plant') {
        console.log('Service Worker: Syncing new Plants');
        openSyncPlantsIDB().then((syncPostDB) => {
            getAllSyncPlants(syncPostDB).then((syncPlants) => {
                for (const syncPlant of syncPlants) {
                    console.log('Service Worker: Syncing new Plant: ', syncPlant);
                    const formData =  new FormData();
                    for (const key in syncPlant) {
                        formData.append(key, syncPlant[key]);
                    }

                    fetch('http://localhost:3000/addplant', {
                        method: 'POST',
                        body: formData
                    }).then(() => {
                        console.log('Service Worker: Syncing new Plant: ', syncPlant, ' done');
                        deleteSyncPlantFromIDB(syncPostDB, syncPlant.id).then(() => {
                        }).catch((err) => {
                            console.error('Service Worker: Deleting synced plant failed: ', err);
                        });

                    }).catch((err) => {
                        console.error('Service Worker: Syncing new Todo: ', syncPlant, ' failed');
                    });
                }

            });
        });
    }
});
