var express = require('express');
var router = express.Router();
var Message = require('../models/Message');

// Get all messages for a specific plant
router.get('/', async (req, res) => {
    const plantName = req.query.plantName || 'Default Plant';
    const plantId = req.query.plantId || 'DefaultID';  // Handle the default case or error

    try {
        // Fetch messages from the database that are specific to the plant and sort them by timestamp
        const messages = await Message.find({ plantId: plantId }).sort({ timestamp: 1 });
        res.render('chat', { title: `Chat about ${plantName}`, messages: messages, plantName: plantName, plantId: plantId });
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { error: err });
    }
});

// Post a new message for a specific plant
router.post('/', async (req, res) => {
    const plantId = req.body.plantId;  // Ensure plantId is included in the form data

    const message = new Message({
        username: req.body.username,
        message: req.body.message,
        plantId: plantId  // Save the plantId with the message
    });

    try {
        await message.save();
        res.redirect(`/chat?plantName=${encodeURIComponent(req.body.plantName)}&plantId=${plantId}`);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
