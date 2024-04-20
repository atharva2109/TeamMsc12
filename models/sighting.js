let mongoose = require('mongoose');

// Create an instance of schema class for mongoose
let Schema = mongoose.Schema;

// Define the schema for plant sightings
let SightingSchema = new Schema(
    {

        // Sighting Fields
        sightingId: { type:Number},
        date: { type: String },                               // Date of sighting
        location: { type: String},                       // Location of the sighting
        address: {
            line: String,
            city: String,
            state: String,
            country: String,
            pinCode: String
        },                                                                  // Address in words
        altitude: Number,                                                   // Altitude of the sighting
        status: {
            type: String,
            enum: ['Verified', 'Verification in Progress']
        },                                                                  // Status of the sighting

        // Plant Fields
        plant: {
            name: String,                                                   // Plant name
            commonName: String,                                             // Plant common name
            scientificName: String,                                         // Plant scientific name
            family: String,                                                 // Plant family
            genus: String,                                                  // Plant Genus
            species: String,                                                // Plant species
            description: { type: String },                  // Plant/Environment Description
            size: {
                length: String,
                height: String,
                width: String
            },                                                              // Plant size
            characteristics: {
                flowering: Boolean,
                hasLeaves: Boolean,
                fruitBearing: Boolean,
                sunExposure: {
                    type: String,
                    enum: ['Shade', 'Partial Sun', 'Full Sun']
                },
                flowerColor: String
            },                                                              // Plant characteristics
            identificationLink: String,                                     // Plant identification link
            photos: [String]                                             // Plant photos
        },

        // User Fields
        user: {
            id: { type: Number },             // user id
            name: String,                                                   // user name
            contactDetails: {
                email: String,
                phoneNumber: Number
            }                                                               // user contact details
        }
    }
);


// Configure the 'toObject' option for the schema to include getters and virtuals convert to an object.
SightingSchema.set('toObject', { getters: true, virtuals: true });

// Create the mongoose model 'Sighting' based on the defined schema
let Sighting = mongoose.model('sighting', SightingSchema);

// Export the Sighting model for use in other modules
module.exports = Sighting;