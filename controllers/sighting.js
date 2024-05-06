// Import the sighting model
const sightingModel = require('../models/sighting');

// Helper Methods

// Create new sightings
exports.createOrUpdate = function (req) {
    // Find a sighting with the provided sightingId
    return sightingModel.findOne({ sightingId: req.sightingId })
        .then(existingSighting => {
            if (existingSighting) {
                // If sighting with the provided sightingId already exists, update it
                Object.assign(existingSighting, {
                    date: req.date,
                    location: req.location,
                    line: req.line,
                    city: req.city,
                    state: req.state,
                    country: req.country,
                    pinCode: req.pinCode,
                    altitude: req.altitude,
                    status: req.status,
                    name: req.name,
                    commonName: req.commonName,
                    scientificName: req.scientificName,
                    family: req.family,
                    genus: req.genus,
                    species: req.species,
                    description: req.description,
                    length: req.length,
                    height: req.height,
                    width: req.width,
                    flowering: req.flowering,
                    hasLeaves: req.hasLeaves,
                    fruitBearing: req.fruitBearing,
                    sunExposure: req.sunExposure,
                    flowerColor: req.flowerColor,
                    identificationLink: req.identificationLink,
                    uploadImage: req.uploadImage,
                    userid: req.userid,
                    username: req.username,
                    email: req.email,
                    phoneNumber: req.phoneNumber
                });

                // Save the updated sighting
                return existingSighting.save()
                    .then(updatedSighting => {
                        console.log("Updated sighting:", JSON.stringify(updatedSighting));
                        return JSON.stringify(updatedSighting);
                    })
                    .catch(error => {
                        console.log("Error updating sighting:", error);
                        return null;
                    });
            } else {
                // If sighting with the provided sightingId does not exist, create a new sighting
                let newSighting = new sightingModel({
                    sightingId: req.sightingId,
                    date: req.date,
                    location: req.location,
                    line: req.line,
                    city: req.city,
                    state: req.state,
                    country: req.country,
                    pinCode: req.pinCode,
                    altitude: req.altitude,
                    status: req.status,
                    name: req.name,
                    commonName: req.commonName,
                    scientificName: req.scientificName,
                    family: req.family,
                    genus: req.genus,
                    species: req.species,
                    description: req.description,
                    length: req.length,
                    height: req.height,
                    width: req.width,
                    flowering: req.flowering,
                    hasLeaves: req.hasLeaves,
                    fruitBearing: req.fruitBearing,
                    sunExposure: req.sunExposure,
                    flowerColor: req.flowerColor,
                    identificationLink: req.identificationLink,
                    uploadImage: req.uploadImage,
                    userid: req.userid,
                    username: req.username,
                    email: req.email,
                    phoneNumber: req.phoneNumber
                });

                // Save the new sighting
                return newSighting.save()
                    .then(newlyCreatedSighting => {
                        console.log("Created sighting:", JSON.stringify(newlyCreatedSighting));
                        return JSON.stringify(newlyCreatedSighting);
                    })
                    .catch(error => {
                        console.log("Error creating sighting:", error);
                        return null;
                    });
            }
        })
        .catch(error => {
            console.log("Error finding sighting:", error);
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