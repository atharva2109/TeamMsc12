// Import the sighting model
const sightingModel = require('../models/sighting');

// Helper Methods

// Create new sightings
exports.create = function (req,filePath) {

    let sighting = new sightingModel({

        date: req.body.datePicker,
        location: req.body.location,
        address: {
            line: req.body.addressLine,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
            pinCode: req.body.pincode
        },
        altitude: req.body.altitude,
        status: req.body.verificationStatus,

        plant: {
            name: req.body.plantName,
            commonName: req.body.plantCommonName,
            scientificName: req.body.plantScientificName,
            family: req.body.plantFamily,
            genus: req.body.plantGenus,
            species: req.body.plantSpecies,
            description: req.body.plantDescription,
            size: {
                length: req.body.plantLength,
                height: req.body.plantHeight,
                width: req.body.plantWidth
            },
            characteristics: {
                flowering: req.body.floweringValue,
                hasLeaves: req.body.leavesValue,
                fruitBearing: req.body.fruitValue,
                sunExposure: req.body.sunexposure,
                flowerColor: req.body.flowerColor
            },
            identificationLink: req.body.idLink,
            photos: [filePath],
        },

        user: {
            id: req.body.user_id,
            name: req.body.username,
            contactDetails: {
                email: req.body.email,
                phoneNumber: req.body.phone
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
exports.getAll = function (page, limit) {
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