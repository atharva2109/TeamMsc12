let isFirstPlantAdded = false;
let isTopFirstPlantAdded = false;
let currentMapIndex = 0;


 async function insertPlantInCarousel(plants) {
     let isVerified;
     if (navigator.onLine) {
          isVerified = await getPlantVerificationStatus(plants);
     }
    if (plants.sightingId != null) {
        if (!isFirstPlantAdded) {
            clearPlantList();
                addPlantCard(plants,isVerified);

            isFirstPlantAdded = true;
        } else {
            addPlantCard(plants,isVerified);
        }
        addPlantsToCarousel(plants);
    }
};

// Function to handle adding top plants to carousel
function addPlantsToCarousel(plants) {
    const carouselContainer = document.querySelector(".carousel-inner");
    const carouselItem = document.createElement('div');
    carouselItem.classList.add('carousel-item');
    const mapIndex = currentMapIndex;
    currentMapIndex++;

    if (!isTopFirstPlantAdded) {
        carouselItem.classList.add('active');
    }
    carouselItem.innerHTML = `
        <div class="row">
            <div class="col-md-12 plantCarouselItem" style="background-image:url('${plants.uploadImage}'); background-size: cover; background-position: center;height: 400px">
                <div class="map-info p-5">
                    <h4 class="display-7">${plants.name}</h4>
                    <p style="font-size: 18px">Family: ${plants.family || 'User not aware of it'}</p>
                    <p style="font-size: 18px">Common Name: ${plants.commonName || 'User not aware of it'}</p>
                    <p style="font-size: 18px">Genus: ${plants.genus || 'User not aware of it'}</p>
                    <p style="font-size: 18px">Country: ${plants.country || 'User not aware of it'}</p>
                    <p style="font-size: 18px">Creator: ${plants.username || 'User not aware of it'}</p>
                </div>
            </div>
       
        </div>
    `;

    carouselContainer.appendChild(carouselItem);
}

// Function to handle displaying no plants message
function displayNoPlantsMessage() {
    const carouselContainer = document.querySelector(".carousel-inner");
    const carouselItem = document.createElement('div');
    carouselItem.classList.add('carousel-item');
    carouselItem.classList.add('active');
    carouselItem.innerHTML = `
        <div class="row">
            <div class="col-md-12 plantCarouselItem" style="background-image:url('/images/pink-rose.jpg'); background-size: cover; background-position: center;height: 400px;">
                <div class="map-info p-5">
                    <h4 class="display-7">Rose</h4>
                    <p style="font-size: 18px">Family: Rosaceae </p>
                    <p style="font-size: 18px">Common Name: Rose</p>
                    <p style="font-size: 18px">Genus: Rosa</p>
                    <p style="font-size: 18px">Country:Sheffield</p>
                    <p style="font-size: 18px">Creator: xyz</p>
                </div>
            </div>
          
        </div>
    `;

    const carouselSecondItem = document.createElement('div');
    carouselSecondItem.classList.add('carousel-item');
    carouselSecondItem.innerHTML = `
        <div class="row">
            <div class="col-md-12 plantCarouselItem" style="background-image:url('/images/lily.jpeg'); background-size: cover; background-position: center;height: 400px;">
                <div class="map-info p-5">
                    <h4 class="display-7">Lily</h4>
                    <p style="font-size: 18px">Family: Liliaceae </p>
                    <p style="font-size: 18px">Common Name: Lily</p>
                    <p style="font-size: 18px">Genus: Lilium; L.</p>
                    <p style="font-size: 18px">Country:London</p>
                    <p style="font-size: 18px">Creator: abc</p>
                </div>
            </div>
   
        </div>
    `;
    carouselContainer.appendChild(carouselItem);
    carouselContainer.appendChild(carouselSecondItem);
    const plantList = document.getElementById('plant_list');
    const displayPlants = document.createElement('div');
    displayPlants.classList.add('display-plants', 'd-flex', 'flex-column', 'justify-content-center', 'align-items-center', 'vh-100');
    displayPlants.innerHTML = `
        <h4 class="text-muted mt-1">Sorry there are currently no plants to display...</h4>
        <button class="btn btn-success"  onclick=
"window.location.href = '/addplant';">Add Plant</button>
    `;
    plantList.appendChild(displayPlants);
}

// Function to clear the plant list container
function clearPlantList() {
    const plantList = document.getElementById('plant_list');
    plantList.innerHTML = '';
}

// Function to handle adding a plant card to the plant list
function addPlantCard(plants,isVerified) {
    const plantList = document.getElementById('plant_list');
    const card = document.createElement('div');
    card.classList.add('col-md-3', 'mb-3', 'plant_list');
    card.setAttribute('data-has-flowers', plants.flowering);
    card.setAttribute('data-has-fruits', plants.fruitBearing);
    card.setAttribute('data-has-leaves', plants.hasLeaves);
    card.setAttribute('data-date-time', plants.date);
    card.setAttribute('data-location', plants.location);
    card.setAttribute('plant-name', plants.name);
    // Create HTML content for the plant card
    card.innerHTML = `
        <div class="card text-center plant-card">
            <img src="${plants.uploadImage}"; class="card-img-top" alt="Plant Image" style="height: 200px; object-fit: cover;" loading="lazy">
            <div class="card-body">
                <h5 class="card-title">Name: ${plants.name}</h5>
                <p class="card-text">Family: ${plants.family || 'User not aware of it'}</p>
                <p class="card-text">Genus: ${plants.genus || 'User not aware of it'}</p>
                <p class="card-text">Species: ${plants.species || 'User not aware of it'}</p>
                <p class="card-text">Country: ${plants.country || 'User not aware of it'}</p>
                
                 ${isVerified !== undefined ? `
                ${isVerified ? '<img src="/images/blue_tick.png" alt="Verified" class="verification-icon" style="height: 40px; width: 40px;">' : ''}
                ${!isVerified ? '<img src="/images/red-tick.jpg" alt="Pending" class="verification-icon" style="height: 40px; width: 40px;">' : ''}
            ` : ''}
                <button class="btn btn-success" onclick='sendPlantData(${JSON.stringify(plants.sightingId)});'>View Details</button>
            </div>
        </div>
    `;
    plantList.appendChild(card);
}

function sendPlantData(sightingId) {
    window.location.href = `/sightingdetails?sightingId=${sightingId}`;
}

window.onload = function () {

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js', {scope: '/'})
            .then(function (reg) {
                console.log('Service Worker Registered!', reg);
            })
            .catch(function (err) {
                console.log('Service Worker registration failed: ', err);
            });
    }

    if ("Notification" in window) {
        // Check if the user has granted permission to receive notifications
        if (Notification.permission === "granted") {
            navigator.serviceWorker.ready.then((registration) => {
                registration.showNotification("Plant Web Application", {
                    body: "Plant application",
                    tag: "Plant application",
                    icon: '/images/logo/Squared_Logo.png'
                }).then(r =>
                    console.log(r)
                );
            });
        } else if (Notification.permission !== "denied") {
            // If the user hasn't been asked yet or has previously denied permission,
            // you can request permission from the user
            Notification.requestPermission().then(function (permission) {
                // If the user grants permission, you can proceed to create notifications
                if (permission === "granted") {
                    navigator.serviceWorker.ready
                        .then(function (serviceWorkerRegistration) {
                            serviceWorkerRegistration.showNotification("Plant Web Application",
                                {body: "Notifications are enabled!", icon: '/images/logo/Squared_Logo.png'})
                                .then(r =>
                                    console.log(r)
                                );
                        });
                }
            });
        }
    }

    if (navigator.onLine) {
        console.log("Online mode")
        fetch('http://localhost:3000/plants')
            .then(function (res) {
                return res.json();
            }).then(function (newPlants) {
            openPlantsIDB().then((db) => {
                if (newPlants.length == 0) {
                    displayNoPlantsMessage();
                } else {
                    insertPlantInCarousel(db, newPlants);
                }
                deleteAllPlantsFromIDB(db).then(() => {
                    addNewPlantsToPlantsIDB(db, newPlants).then(() => {
                    })
                });
            });
        });

    } else {
        console.log("Offline mode")
        openPlantsIDB().then((db) => {
            getAllPlants(db).then((plants) => {
                console.log("Plants in plant: ", plants)
                if (plants.length == 0) {
                    displayNoPlantsMessage();
                } else {
                    for (const plant of plants) {
                        insertPlantInCarousel(plant)
                    }
                }

            });
        });

    }

}