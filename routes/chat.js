var express = require('express');
var router = express.Router();
var Message = require('../models/Message');

// Get all messages
router.get('/', async (req, res) => {
    try {
        // Fetch messages from the database and sort them by timestamp
        const messages = await Message.find().sort({ timestamp: 1 }); // Sort by ascending to show oldest first
        res.render('chat', { title: 'Chat', messages: messages });
    } catch (err) {
        // If an error occurs, log it and send a 500 status code
        console.error(err);
        res.status(500).render('error', { error: err });
    }
});

// Post a new message
router.post('/', async (req, res) => {
    const message = new Message({
        username: req.body.username,
        message: req.body.message,
        imageUrl: req.body.imageUrl
    });

    try {
        await message.save();
        res.redirect('/chat');  // Optionally, you can change this to a JSON response if working with an API
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;

