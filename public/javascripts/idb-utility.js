const addOrUpdatePlantInSyncIDB = (db, plantData) => {
    // Start a transaction on the 'plants' object store
    const transaction = db.transaction(["sync-plants"], "readwrite");
    const plantStore = transaction.objectStore("sync-plants");

    // Check if the plant with the sightingId already exists
    const getRequest = plantStore.get(plantData.sightingId);

    getRequest.addEventListener("success", () => {

        const existingPlant = getRequest.result;

        if (existingPlant) {
            // If the plant exists, update it with the new plantData
            const updatedPlantData = { ...existingPlant, ...plantData };
            const updateRequest = plantStore.put(updatedPlantData);

            updateRequest.addEventListener("success", () => {
                console.log("Added " + "#" + updateRequest.result)
                const getRequest = plantStore.get(updateRequest.result)

                getRequest.addEventListener("success", () => {
                    console.log("Found " + JSON.stringify(getRequest.result))

                    // Send a sync message to the service worker
                    navigator.serviceWorker.ready.then((sw) => {
                        sw.sync.register("sync-plant")
                    }).then(() => {
                        console.log("Sync registered");
                    }).catch((err) => {
                        console.log("Sync registration failed: " + JSON.stringify(err))
                    })
                })
            })

            updateRequest.addEventListener("error", (error) => {
                console.error("Error updating plant in IDB:", error);
            });
        } else {
            // If the plant does not exist, add it as a new entry
            const addRequest = plantStore.add(plantData);

            addRequest.addEventListener("success", () => {
                console.log("Added " + "#" + addRequest.result)
                const getRequest = plantStore.get(addRequest.result)
                getRequest.addEventListener("success", () => {
                    console.log("Found " + JSON.stringify(getRequest.result))

                    // Send a sync message to the service worker
                    navigator.serviceWorker.ready.then((sw) => {
                        sw.sync.register("sync-plant")
                    }).then(() => {
                        console.log("Sync registered");
                    }).catch((err) => {
                        console.log("Sync registration failed: " + JSON.stringify(err))
                    })
                })
            })

            addRequest.addEventListener("error", (error) => {
                console.error("Error adding new plant to IDB:", error);
            });
        }
    });

    getRequest.addEventListener("error", (error) => {
        console.error("Error retrieving plant from IDB:", error);
    });

    // Handle transaction complete and error events
    transaction.addEventListener("complete", () => {
        console.log("Transaction complete.");
    });

    transaction.addEventListener("error", (error) => {
        console.error("Transaction error:", error);
    });
};

const addOrUpdatePlantInIDB = (db, plantData) => {
    // Start a transaction on the 'plants' object store
    const transaction = db.transaction(["plants"], "readwrite");
    const plantStore = transaction.objectStore("plants");

    // Check if the plant with the sightingId already exists
    const getRequest = plantStore.get(plantData.sightingId);

    getRequest.addEventListener("success", () => {
        const existingPlant = getRequest.result;

        if (existingPlant) {
            // If the plant exists, update it with the new plantData
            const updatedPlantData = { ...existingPlant, ...plantData };
            const updateRequest = plantStore.put(updatedPlantData);

            updateRequest.addEventListener("success", () => {
                console.log("Updated " + "#" + updateRequest.result)
            })

            updateRequest.addEventListener("error", (error) => {
                console.error("Error updating plant in IDB:", error);
            });
        } else {
            // If the plant does not exist, add it as a new entry
            const addRequest = plantStore.add(plantData);

            addRequest.addEventListener("success", () => {
                console.log("Added " + "#" + addRequest.result)
            })

            addRequest.addEventListener("error", (error) => {
                console.error("Error adding new plant to IDB:", error);
            });
        }
    });

    getRequest.addEventListener("error", (error) => {
        console.error("Error retrieving plant from IDB:", error);
    });

    // Handle transaction complete and error events
    transaction.addEventListener("complete", () => {
        console.log("Transaction complete.");
    });

    transaction.addEventListener("error", (error) => {
        console.error("Transaction error:", error);
    });
};

// Function to add or update plant in IDB based on sightingId
const addOrUpdatePlant = (plantData) => {
    // Get an instance of the IDB
    openSyncPlantsIDB().then(db => {
        addOrUpdatePlantInSyncIDB(db, plantData);
    }).catch(error => {
        console.error("Error opening IDB:", error);
    });

    // In offline mode add plant in plantsIDB
    if (!navigator.onLine) {
        openPlantsIDB().then(db => {
            addOrUpdatePlantInIDB(db, plantData);
        }).catch(error => {
            console.error("Error opening IDB:", error);
        });
    }
};

const addNewPlantsToPlantsIDB = (plantIDB, plants) => {
    return new Promise((resolve, reject) => {
        const transaction = plantIDB.transaction(["plants"], "readwrite");
        const plantStore = transaction.objectStore("plants");

        const addPromises = plants.map(plant => {
            return new Promise((resolveAdd, rejectAdd) => {
                const addRequest = plantStore.add(plant);
                addRequest.addEventListener("success", () => {
                    console.log("Added " + "#" + addRequest.result + ": " + plant);
                    const getRequest = plantStore.get(addRequest.result);
                    getRequest.addEventListener("success", () => {
                        console.log("Found " + JSON.stringify(getRequest.result));
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
            db.createObjectStore('plants', {keyPath: 'id', autoIncrement: true});
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
            db.createObjectStore('sync-plants', {keyPath: 'id', autoIncrement: true});
        };

        request.onsuccess = function (event) {
            const db = event.target.result;
            resolve(db);
        };
    });
}

