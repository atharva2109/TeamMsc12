let mongoose = require('mongoose');

// Create an instance of schema class for mongoose
let Schema = mongoose.Schema;

// Define the schema for plant sightings
let SightingSchema = new Schema(
    {

        // Sighting Fields
        sightingId: {type: Number},
        date: {type: String},                               // Date of sighting
        location: {type: String},                       // Location of the sighting
        line: String,
        city: String,
        state: String,
        country: String,
        pinCode: String,                                                                  // Address in words
        altitude: Number,                                                   // Altitude of the sighting
        status: {
            type: String,
            enum: ['Verified', 'Verification in Progress']
        },                                                                  // Status of the sighting
        name: String,                                                   // Plant name
        commonName: String,                                             // Plant common name
        scientificName: String,                                         // Plant scientific name
        family: String,                                                 // Plant family
        genus: String,                                                  // Plant Genus
        species: String,                                                // Plant species
        description: String,                  // Plant/Environment Description
        length: String,
        height: String,
        width: String,
        flowering: Boolean,
        hasLeaves: Boolean,
        fruitBearing: Boolean,
        sunExposure: {
            type: String,
            enum: ['Shade', 'Partial Sun', 'Full Sun']
        },
        flowerColor: String,

        // Plant characteristics
        identificationLink: String,                                     // Plant identification link
        uploadImage: String,
        userid: Number,
        username: String,                                                   // user name
        email: String,
        phoneNumber: Number
    });



// Configure the 'toObject' option for the schema to include getters and virtuals convert to an object.
SightingSchema.set('toObject', {getters: true, virtuals: true});

// Create the mongoose model 'Sighting' based on the defined schema
let Sighting = mongoose.model('sighting', SightingSchema);

// Export the Sighting model for use in other modules
module.exports = Sighting;