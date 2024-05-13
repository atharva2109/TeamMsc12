const mongoose = require('mongoose');

// Create an instance of schema class for mongoose
const { Schema } = mongoose;

// Define the schema for plant sightings
const SightingSchema = new Schema(
    {
            // Sighting Fields
            sightingId: { type: String, required: true, unique: true },
            date: { type: String }, // Date of sighting
            location: { type: String }, // Location of the sighting
            line: { type: String }, // Address line
            city: { type: String }, // City
            state: { type: String }, // State
            country: { type: String }, // Country
            pinCode: { type: String }, // Postal code
            altitude: { type: String }, // Altitude of the sighting
            name: { type: String }, // Plant name
            commonName: { type: String }, // Plant common name
            scientificName: { type: String }, // Plant scientific name
            family: { type: String }, // Plant family
            genus: { type: String }, // Plant Genus
            species: { type: String }, // Plant species
            description: { type: String }, // Plant/Environment Description
            length: { type: String }, // Plant length
            height: { type: String }, // Plant height
            width: { type: String }, // Plant width
            flowering: { type: Boolean }, // Flowering status
            hasLeaves: { type: Boolean }, // Has leaves status
            fruitBearing: { type: Boolean }, // Fruit-bearing status
            sunExposure: {
                    type: String,
                    enum: ['Shade', 'Partial Sun', 'Full Sun'], // Sun exposure enum
            },
            flowerColor: { type: String }, // Flower color

            // Plant characteristics
            uploadImage: { type: String }, // Uploaded image URL
            userid: { type: String }, // User ID
            username: { type: String }, // User name
            email: { type: String }, // User email
            phoneNumber: { type: String }, // User phone number
            suggestions: {
                    type: [String],
                    default: [], // Default empty array for suggestions
            },
    },
    {
            timestamps: true, // Automatically add createdAt and updatedAt fields
            toObject: { getters: true, virtuals: true }, // Include getters and virtuals in toObject output
            toJSON: { getters: true, virtuals: true }, // Include getters and virtuals in toJSON output
    }
);

// Create the mongoose model 'Sighting' based on the defined schema
const Sighting = mongoose.model('Sighting', SightingSchema);

// Export the Sighting model for use in other modules
module.exports = Sighting;
