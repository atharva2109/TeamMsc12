const mongoose = require('mongoose');
const { Schema } = mongoose;

// Create a schema for chat messages
const messageSchema = new Schema({
    username: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    sightingId: { type: String, required: true }
});

// Create a model based on the schema
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
