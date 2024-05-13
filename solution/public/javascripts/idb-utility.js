const addNewPlantsToSyncIDBInBothModes = (plantData) => {

    // In offline mode add plant in plantsIDB
    if (!navigator.onLine) {
        openPlantsIDB().then((db) => {
            const transaction = db.transaction(["plants"], "readwrite");
            const plantStore = transaction.objectStore("plants");
            const addRequest = plantStore.put(plantData)
            addRequest.addEventListener("success", () => {
                console.log("Offline Mode - Added new plant to plantsIDB.");
            });
        });
    }

    // Add new plant sync IDB in both modes
    openSyncPlantsIDB().then((syncIDB) => {
        addNewPlantsToSyncIDB(syncIDB, plantData);
    });

}


// Add new plant entry into sync IDB
const addNewPlantsToSyncIDB = (syncTodoIDB, plantData) => {

    // Get instance of IDB
    const transaction = syncTodoIDB.transaction(["sync-plants"], "readwrite")
    const plantStore = transaction.objectStore("sync-plants")

    // Add plant in sync IDB Request
    const addRequest = plantStore.put(plantData)

    addRequest.addEventListener("success", () => {
        const getRequest = plantStore.get(addRequest.result)
        getRequest.addEventListener("success", () => {

            // Send a sync message to the service worker
            navigator.serviceWorker.ready.then((sw) => {
                sw.sync.register("sync-plant")
            }).then(() => {
                console.log("Sync Registered - Adding new plant details");
            }).catch((err) => {
                console.log("Sync Registration Failed: " + JSON.stringify(err))
            })


        })
    })

}

const addNewPlantsToPlantsIDB = (plantIDB, plants) => {
    return new Promise((resolve, reject) => {
        const transaction = plantIDB.transaction(["plants"], "readwrite");
        const plantStore = transaction.objectStore("plants");

        const addPromises = plants.map(plant => {
            return new Promise((resolveAdd, rejectAdd) => {
                const addRequest = plantStore.add(plant);
                addRequest.addEventListener("success", () => {
                    const getRequest = plantStore.get(addRequest.result);
                    getRequest.addEventListener("success", () => {
                        insertPlantInCarousel(getRequest.result);
                        resolveAdd(); // Resolve the add promise
                    });
                    getRequest.addEventListener("error", (event) => {
                        rejectAdd(event.target.error); // Reject the add promise if there's an error
                    });
                });
                addRequest.addEventListener("error", (event) => {
                    rejectAdd(event.target.error); // Reject the add promise if there's an error
                });
            });
        });

        // Resolve the main promise when all add operations are completed
        Promise.all(addPromises).then(() => {
            resolve();
        }).catch((error) => {
            reject(error);
        });
    });
};

const getAllPlants = (plantIDB) => {
    return new Promise((resolve, reject) => {
        const transaction = plantIDB.transaction(["plants"]);
        const plantStore = transaction.objectStore("plants");
        const getAllPlants = plantStore.getAll();

        // Handle success event
        getAllPlants.addEventListener("success", (event) => {
            resolve(event.target.result); // Use event.target.result to get the result
        });

        // Handle error event
        getAllPlants.addEventListener("error", (event) => {
            reject(event.target.error);
        });
    });
}

const getAllSyncPlants = (syncPlantIDB) => {
    return new Promise((resolve, reject) => {
        const transaction = syncPlantIDB.transaction(["sync-plants"]);
        const plantStore = transaction.objectStore("sync-plants");
        const getAllRequest = plantStore.getAll();

        getAllRequest.addEventListener("success", () => {
            resolve(getAllRequest.result);
        });

        getAllRequest.addEventListener("error", (event) => {
            reject(event.target.error);
        });
    });
}

// Function to remove all todos from idb - Will be never used
const deleteAllPlantsFromIDB = (plantIDB) => {
    const transaction = plantIDB.transaction(["plants"], "readwrite");
    const plantStore = transaction.objectStore("plants");
    const clearRequest = plantStore.clear();

    return new Promise((resolve, reject) => {
        clearRequest.addEventListener("success", () => {
            resolve();
        });

        clearRequest.addEventListener("error", (event) => {
            reject(event.target.error);
        });
    });
};

const getPlantFromIDB = (plantIDB, id) => {
    return new Promise((resolve, reject) => {
        const transaction = plantIDB.transaction(["plants"], "readonly");
        const plantStore = transaction.objectStore("plants");
        const getRequest = plantStore.get(id);
        getRequest.addEventListener("success", () => {
            const plant = getRequest.result;
            resolve(plant);
        });
        getRequest.addEventListener("error", (event) => {
            reject(event.target.error);
        });
    });
};


const deleteSyncPlantFromIDB = (syncPlantIDB, id) => {
    return new Promise((resolve, reject) => {
        const transaction = syncPlantIDB.transaction(["sync-plants"], "readwrite")
        const plantStore = transaction.objectStore("sync-plants")
        const deleteRequest = plantStore.delete(id)
        deleteRequest.addEventListener("success", () => {
            console.log("Deleted " + id)
            resolve();
        })
        deleteRequest.addEventListener("error", (event) => {
            reject(event.target.error);
        });
    });
}

// Index DB to store all the plants in MongoDB in offline mode
function openPlantsIDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("plants", 1);

        request.onerror = function (event) {
            reject(new Error(`Database error: ${event.target}`));
        };

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            const objectStore = db.createObjectStore('plants', { keyPath: 'sightingId' });
            objectStore.createIndex('sightingId', 'sightingId', { unique: true });

        };

        request.onsuccess = function (event) {
            const db = event.target.result;
            resolve(db);
        };
    });
}

// Index DB just to keep track of new added/updated plants
function openSyncPlantsIDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("sync-plants", 1);
        request.onerror = function (event) {
            reject(new Error(`Database error: ${event.target}`));
        };

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            const objectStore = db.createObjectStore('sync-plants', { keyPath: 'sightingId' });
            objectStore.createIndex('sightingId', 'sightingId', { unique: true });
        };

        request.onsuccess = function (event) {
            const db = event.target.result;
            resolve(db);
        };
    });
}