let isFirstPlantAdded = false;
let count = 0;
let isTopFirstPlantAdded = false;
let currentMapIndex = 0;
const insertPlantInCarousel = (plants) => {
    const plantList = document.getElementById('plant_list');
    const topPlants = JSON.parse(document.getElementById("hiddenPlants").value);
    console.log("Top plants from javascriptindex.js",topPlants)
    const isTopPlant = topPlants.some((topPlant) => topPlant.plant.name === (plants.plant && plants.plant.name));

    // Handling top plants first
    if (isTopPlant) {
        console.log("Top plant",plants.plant.name)
        if (!isTopFirstPlantAdded) {
            // Handle the first top plant
            addTopPlantToCarousel(plants);
            isTopFirstPlantAdded = true;
        } else {
console.log("else block",plants.plant.name)
            addTopPlantToCarousel(plants);
        }
    }
        if (!plants.plant) {
            // No plants to display
            displayNoPlantsMessage();
        } else if (!isFirstPlantAdded) {
            console.log("First plant added!!")
            clearPlantList();
            addPlantCard(plants);
            isFirstPlantAdded = true;
        } else {
            console.log("plant added!!")
            addPlantCard(plants);
        }

};

// Function to handle adding top plants to carousel
function addTopPlantToCarousel(plants) {
    const carouselContainer = document.querySelector(".carousel-inner");
    const carouselItem = document.createElement('div');
    console.log("Is plant added",isTopFirstPlantAdded)
    carouselItem.classList.add('carousel-item');
    const mapIndex = currentMapIndex;
    currentMapIndex++;

    if (!isTopFirstPlantAdded) {
        carouselItem.classList.add('active');
    }
console.log("carousel item: ",carouselItem)
    carouselItem.innerHTML = `
        <div class="row">
            <div class="col-md-6 plantCarouselItem" style="background-image:url('http://localhost:3000/${plants.plant.photos[0].replace(/\\/g, '/')}'); background-size: cover; background-position: center;">
                <div class="map-info p-5">
                    <h4 class="display-7">${plants.plant.name}</h4>
                    <p style="font-size: 18px">Family: ${plants.plant.family || 'User not aware of it'}</p>
                    <p style="font-size: 18px">Common Name: ${plants.plant.commonName || 'User not aware of it'}</p>
                    <p style="font-size: 18px">Genus: ${plants.plant.genus || 'User not aware of it'}</p>
                    <p style="font-size: 18px">Country: ${plants.address.country || 'User not aware of it'}</p>
                    <p style="font-size: 18px">Creator: ${plants.user.name || 'User not aware of it'}</p>
                </div>
            </div>
            <div class="col-md-6" id="map-${mapIndex}">
                <div class="map-container h-100">
                    <div class="map-header">
                        <h2>Map</h2>
                    </div>
                    <div class="map-body h-100">
                        <div id="map-canvas" class="h-100"></div>
                    </div>
                </div>
            </div>
        </div>
    `;

    carouselContainer.appendChild(carouselItem);
}

// Function to handle displaying no plants message
function displayNoPlantsMessage() {
    const plantList = document.getElementById('plant_list');
    const displayPlants = document.createElement('div');
    displayPlants.classList.add('display-plants', 'd-flex', 'flex-column', 'justify-content-center', 'align-items-center', 'vh-100');
    displayPlants.innerHTML = `
        <h4 class="text-muted mt-1">Sorry there are currently no plants to display...</h4>
        <button class="btn btn-success"><a href="/addplant" style="text-decoration: none;color: white">Add Plant</a></button>
    `;
    plantList.appendChild(displayPlants);
}

// Function to clear the plant list container
function clearPlantList() {
    const plantList = document.getElementById('plant_list');
    plantList.innerHTML = '';
}

// Function to handle adding a plant card to the plant list
function addPlantCard(plants) {
    const plantList = document.getElementById('plant_list');
    const card = document.createElement('div');
    card.classList.add('col-md-3', 'mb-3', 'plant_list');
    card.setAttribute('data-has-flowers', plants.plant.characteristics.flowering);
    card.setAttribute('data-has-fruits', plants.plant.characteristics.fruitBearing);
    card.setAttribute('data-has-leaves', plants.plant.characteristics.hasLeaves);

    // Create HTML content for the plant card
    card.innerHTML = `
        <div class="card text-center plant-card">
            <img src="http://localhost:3000/${plants.plant.photos[0].replace(/\\/g, '/')}"; class="card-img-top" alt="Plant Image" style="height: 200px; object-fit: cover;" loading="lazy">
            <div class="card-body">
                <h5 class="card-title">Name: ${plants.plant.name}</h5>
                <p class="card-text">Family: ${plants.plant.family || 'User not aware of it'}</p>
                <p class="card-text">Genus: ${plants.plant.genus || 'User not aware of it'}</p>
                <p class="card-text">Species: ${plants.plant.species || 'User not aware of it'}</p>
                <p class="card-text">Country: ${plants.address.country || 'User not aware of it'}</p>
                ${plants.status === 'Verified' ? '<img src="/images/blue_tick.png" alt="Verified" class="verification-icon" style="height: 40px; width: 40px;">' : ''}
                ${plants.status === 'Verification in Progress' ? '<img src="/images/red-tick.jpg" alt="Pending" class="verification-icon" style="height: 40px; width: 40px;">' : ''}
                <a href="/sightingdetails?plant=${encodeURIComponent(JSON.stringify(plants))}" class="btn btn-success">View Details</a>
            </div>
        </div>
    `;

    plantList.appendChild(card);
}

function initMap() {
    console.log("Plant carousels:" ,document.querySelector(".plantCarouselItem" ))
    const topPlants = JSON.parse(document.getElementById("hiddenPlants").value);
   topPlants.forEach((plant, index) => {
       createMapWithMarker(plant.location.split(",")[0] , plant.location.split(",")[1] , `map-${index}` );
   })
}

function createMapWithMarker(latitude, longitude, mapElementId) {
    console.log("Map with id",document.getElementById("map-0"))
    console.log("Latitude: ",latitude,"Longitude: ",longitude)
    let mapOptions = {
        zoom: 5,
        center: {lat: parseFloat(latitude), lng: parseFloat(longitude)}
    };
    let map = new google.maps.Map(document.getElementById(mapElementId), mapOptions);

    let markerOptions = {
        position: new google.maps.LatLng(latitude, longitude),
        map: map
    };
    let marker = new google.maps.Marker(markerOptions);
}

function API() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyARXO1sAXfsUdl_wxOfVJFFT3naSjyyoII&callback=initMap`;
    script.defer = true;
    document.head.appendChild(script);
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

    if (navigator.onLine) {

        fetch('http://localhost:3000/plants')
            .then(function (res) {
                return res.json();
            }).then(function (newPlants) {
            openPlantsIDB().then((db) => {
                console.log("Insert before: ", newPlants)
                insertPlantInCarousel(db, newPlants);

                deleteAllExistingTodosFromIDB(db).then(() => {
                    addNewTodosToIDB(db, newPlants).then(() => {
                        console.log("All new plants added to IDB")
                        API()
                        initMap();
                    })
                });
            });
        });

    } else {
        console.log("Offline mode")
        openPlantsIDB().then((db) => {
            getAllPlants(db).then((plants) => {
                for (const plant of plants) {
                    insertPlantInCarousel(plant)
                }
            });
        });

    }

}

