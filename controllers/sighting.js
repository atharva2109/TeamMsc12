// Import the sighting model
const sightingModel = require('../models/sighting');

// Helper Methods

// Create new sightings
exports.create = function (req,filePath) {

    let sighting = new sightingModel({

        date: req.datePicker,
        location: req.location,
        address: {
            line: req.addressLine,
            city: req.city,
            state: req.state,
            country: req.country,
            pinCode: req.pincode
        },
        altitude: req.altitude,
        status: req.verificationStatus,

        plant: {
            name: req.plantName,
            commonName: req.plantCommonName,
            scientificName: req.plantScientificName,
            family: req.plantFamily,
            genus: req.plantGenus,
            species: req.plantSpecies,
            description: req.plantDescription,
            size: {
                length: req.plantLength,
                height: req.plantHeight,
                width: req.plantWidth
            },
            characteristics: {
                flowering: req.floweringValue,
                hasLeaves: req.leavesValue,
                fruitBearing: req.fruitValue,
                sunExposure: req.sunExposure,
                flowerColor: req.flowerColor
            },
            identificationLink: req.idLink,
            photos: [filePath],
        },

        user: {
            id: req.userid,
            name: req.username,
            contactDetails: {
                email: req.email,
                phoneNumber: req.phone
            }
        }
    });

    // Save the sighting to the database
    // Return success or failure
    return sighting.save().then(sighting => {
        // Return the sighting data as string
        JSON.stringify(sighting);
    }).catch(error => {
        console.log(error);

        return null;
    });
};

// Fetch all sightings
exports.getPlantsPagewise = function (page, limit) {
    // Calculate skip value based on page number and limit
    const skip = (page - 1) * limit;

    // Query the database to fetch sightings with pagination
    return sightingModel.find({}).skip(skip).limit(limit).then(sightings => {
        return sightings;
    }).catch(error => {
        console.log(error);
        return null;
    });

};

exports.getAll = function (page, limit) {
    return sightingModel.find({}).then(sightings => {
        return JSON.stringify(sightings);
    }).catch(error => {
        console.log(error);
        return null;
    });

};