// Import the sighting model
const sightingModel = require('../models/sighting');

// Helper Methods

// Create new sightings
exports.create = function (data) {

    let sighting = new sightingModel({

        date: data.date,
        location: data.location,
        address: {
            line: data.line,
            city: data.city,
            state: data.status,
            country: data.country,
            pinCode: data.pinCode
        },
        altitude: data.altitude,
        status: data.status,

        plant: {
            name: data.plant_name,
            commonName: data.plant_commonName,
            scientificName: data.plant_scientificName,
            family: data.plant_family,
            genus: data.plant_genus,
            species: data.plant_species,
            description: data.plant_description,
            size: {
                length: data.plant_length,
                height: data.plant_height,
                width: data.plant_width
            },
            characteristics: {
                flowering: data.isFlowering,
                hasLeaves: data.hasLeaves,
                fruitBearing: data.isFruitBearing,
                sunExposure: data.sunExposure,
                flowerColor: data.flowerColor
            },
            identificationLink: data.plant_identification_link,
            photos: data.plant_photos
        },

        user: {
            id: data.user_id,
            name: data.user_name,
            contactDetails: {
                email: data.user_email,
                phoneNumber: data.user_phoneNumber
            }
        }
    });

    // Save the sighting to the database
    // Return success or failure
    return sighting.save().then(sighting => {
        console.log(sighting);

        // Return the sighting data as string
        JSON.stringify(sighting);
    }).catch(error => {
        console.log(error);

        return null;
    });
};

// Fetch all sightings
exports.getAll = function () {
    return sightingModel.find({}).then(sightings => {

        return JSON.stringify(sightings);
    }).catch(error => {
        console.log(error);

        return null;
    });
};