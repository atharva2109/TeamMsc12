let isFirstPlantAdded = false;
let count=0;
const insertPlantInCarousel = (plants) => {
    const plantList = document.getElementById('plant_list');

    // Check if plants.plant is undefined
    if (!plants.plant) {
        // If plants.plant is undefined, display the else block
        console.log("empty plants!!");
        const displayPlants = document.createElement('div');
        displayPlants.classList.add('display-plants', 'd-flex', 'flex-column', 'justify-content-center', 'align-items-center', 'vh-100');
        displayPlants.innerHTML = `
            <h4 class="text-muted mt-1">Sorry there are currently no plants to display...</h4>
            <button class="btn btn-success"><a href="/addplant" style="text-decoration: none;color: white"> Add Plant</a></button>
        `;
        plantList.appendChild(displayPlants);
    } else if (!isFirstPlantAdded) {
        // If it's the first plant being added, clear the children of plant_list
        plantList.innerHTML = '';
        isFirstPlantAdded = true;

        const carouselContainer=document.querySelector(".carousel-inner")
        // Iterate over each plant to create carousel items

            const carouselItem = document.createElement('div');
            carouselItem.classList.add('carousel-item','active');


            carouselItem.innerHTML = `
                <div class="row">
                    <div class="col-md-6 plantCarouselItem" style="background-image:url('http://localhost:3000/${plants.plant.photos[0].replace(/\\/g, '/')}'); background-size: cover; background-position: center;">
                        <div class="map-info p-5">
                            <h4 class="display-7">${plants.plant && plants.plant.name}</h4>
                            <p style="font-size: 18px">Family: ${plants.plant && plants.plant.family || 'User not aware of it'}</p>
                            <p style="font-size: 18px">Common Name: ${plants.plant && plants.plant.commonName || 'User not aware of it'}</p>
                            <p style="font-size: 18px">Genus: ${plants.plant && plants.plant.genus || 'User not aware of it'}</p>
                            <p style="font-size: 18px">Country: ${plants.address && plants.address.country || 'User not aware of it'}</p>
                            <p style="font-size: 18px">Creator: ${plants.user && plants.user.name || 'User not aware of it'}</p>
                        </div>
                    </div>
           <div class="col-md-6" id="map0">
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


        const card = document.createElement('div');
        card.classList.add('col-md-3', 'mb-3', 'plant_list');
        card.setAttribute('data-has-flowers', plants.plant && plants.plant.characteristics.flowering);
        card.setAttribute('data-has-fruits', plants.plant && plants.plant.characteristics.fruitBearing);
        card.setAttribute('data-has-leaves', plants.plant && plants.plant.characteristics.hasLeaves);

        // Create HTML content for the plant card (modify as needed)
        card.innerHTML = `
            <div class="card text-center plant-card">
                <img src="http://localhost:3000/${plants.plant.photos[0].replace(/\\/g, '/') }" class="card-img-top" alt="Plant Image" style="height: 200px; object-fit: cover;" loading="lazy">
                <div class="card-body">
                    <h5 class="card-title">Name: ${plants.plant && plants.plant.name}</h5>
                    <p class="card-text">Family: ${plants.plant && plants.plant.family || 'User not aware of it'}</p>
                    <p class="card-text">Genus: ${plants.plant && plants.plant.genus || 'User not aware of it'}</p>
                    <p class="card-text">Species: ${plants.plant && plants.plant.species || 'User not aware of it'}</p>
                    <p class="card-text">Country: ${plants.address && plants.address.country || 'User not aware of it'}</p>
                    ${plants.status === 'Verified' ? '<img src="/images/blue_tick.png" alt="Verified" class="verification-icon" style="height: 40px;width:40px;">' : ''}
                    ${plants.status === 'Verification in Progress' ? '<img src="/images/red-tick.jpg" alt="Pending" class="verification-icon" style="height: 40px; width:40px;">' : ''}
                    <a href="/sightingdetails?plant=${encodeURIComponent(JSON.stringify(plants))}" class="btn btn-success">View Details</a>
                </div>
            </div>
        `;

        // Append the card to the plant list container
        plantList.appendChild(card);
    } else {
        // For subsequent plants, add them without clearing the children
        console.log("Plants in insertcarousel:", plants.user && plants.user.name);
        console.log("Plants in insertcarousel characteristics:", plants.plant && plants.plant.characteristics.flowering);


        const carouselContainer=document.querySelector(".carousel-inner")


        // Iterate over each plant to create carousel items

        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');


        carouselItem.innerHTML = `
                <div class="row">
                    <div class="col-md-6 plantCarouselItem" style="background-image:url('http://localhost:3000/${plants.plant.photos[0].replace(/\\/g, '/') }'); background-size: cover; background-position: center;">
                        <div class="map-info p-5">
                            <h4 class="display-7">${plants.plant && plants.plant.name}</h4>
                            <p style="font-size: 18px">Family: ${plants.plant && plants.plant.family || 'User not aware of it'}</p>
                            <p style="font-size: 18px">Common Name: ${plants.plant && plants.plant.commonName || 'User not aware of it'}</p>
                            <p style="font-size: 18px">Genus: ${plants.plant && plants.plant.genus || 'User not aware of it'}</p>
                            <p style="font-size: 18px">Country: ${plants.address && plants.address.country || 'User not aware of it'}</p>
                            <p style="font-size: 18px">Creator: ${plants.user && plants.user.name || 'User not aware of it'}</p>
                        </div>
                    </div>
          
                </div>
            `;




        carouselContainer.appendChild(carouselItem);


        const card = document.createElement('div');
        card.classList.add('col-md-3', 'mb-3', 'plant_list');
        card.setAttribute('data-has-flowers', plants.plant && plants.plant.characteristics.flowering);
        card.setAttribute('data-has-fruits', plants.plant && plants.plant.characteristics.fruitBearing);
        card.setAttribute('data-has-leaves', plants.plant && plants.plant.characteristics.hasLeaves);

        // Create HTML content for the plant card (modify as needed)
        card.innerHTML = `
            <div class="card text-center plant-card">
                <img src="http://localhost:3000/${plants.plant.photos[0].replace(/\\/g, '/') }" class="card-img-top" alt="Plant Image" style="height: 200px; object-fit: cover;" loading="lazy">
                <div class="card-body">
                    <h5 class="card-title">Name: ${plants.plant && plants.plant.name}</h5>
                    <p class="card-text">Family: ${plants.plant && plants.plant.family || 'User not aware of it'}</p>
                    <p class="card-text">Genus: ${plants.plant && plants.plant.genus || 'User not aware of it'}</p>
                    <p class="card-text">Species: ${plants.plant && plants.plant.species || 'User not aware of it'}</p>
                    <p class="card-text">Country: ${plants.address && plants.address.country || 'User not aware of it'}</p>
                    ${plants.status === 'Verified' ? '<img src="/images/blue_tick.png" alt="Verified" class="verification-icon" style="height: 40px;width:40px;">' : ''}
                    ${plants.status === 'Verification in Progress' ? '<img src="/images/red-tick.jpg" alt="Pending" class="verification-icon" style="height: 40px; width:40px;">' : ''}
                    <a href="/sightingdetails?plant=${encodeURIComponent(JSON.stringify(plants))}" class="btn btn-success">View Details</a>
                </div>
            </div>
        `;

        // Append the card to the plant list container
        plantList.appendChild(card);
    }
};
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
                console.log("Insert before: ",newPlants)
                    insertPlantInCarousel(db,newPlants);

                deleteAllExistingTodosFromIDB(db).then(() => {
                    addNewTodosToIDB(db, newPlants).then(() => {
                        console.log("All new plants added to IDB")
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