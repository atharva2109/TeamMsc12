// Import the sighting model
const sightingModel = require('../models/sighting');

// Helper Methods

// Create new sightings or update existing ones
// Create new sightings or update existing ones
exports.create = function (req) {
    let sightingData = {
        sightingId: req.sightingId,
        date: req.date,
        location: req.location,
        line: req.line,
        city: req.city,
        state: req.state,
        country: req.country,
        pinCode: req.pinCode,
        altitude: req.altitude,
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
        uploadImage: req.uploadImage,
        userid: req.userid,
        username: req.username,
        email: req.email,
        phoneNumber: req.phoneNumber,
        suggestions: req.suggestions
    };

    // Find the existing sighting based on sightingId
    return sightingModel.findOneAndUpdate(
        { sightingId: req.sightingId }, // Query: Find document with matching sightingId
        sightingData, // Update data
        { upsert: true, new: true } // Options: Create new document if not found, return updated document
    ).then(updatedSighting => {
        if (updatedSighting) {
            return JSON.stringify(updatedSighting);
        } else {
            return JSON.stringify(sightingData);
        }
    }).catch(error => {
        console.error("Error while creating/updating sighting:", error);
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