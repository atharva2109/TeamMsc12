// Import the sighting model
const sightingModel = require('../models/sighting');

// Helper Methods

// Create new sightings
exports.create = function (req, filePath) {

    let sighting = new sightingModel({
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
        uploadImage: filePath,

        userid: req.userid,
        username: req.username,
        email: req.email,
        phoneNumber: req.phoneNumber
    });

    // Save the sighting to the database
    // Return success or failure
    return sighting.save().then(sighting => {
        console.log("JSON String", JSON.stringify(sighting))
        return JSON.stringify(sighting);
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