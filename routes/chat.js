// var express = require('express');
// var router = express.Router();
// var Message = require('../models/Message');
// var socketIo = require('socket.io');
//
// // Get all messages for a specific plant
// router.get('/', async (req, res) => {
//     const plantName = req.query.plantName || 'Default Plant';
//     const plantId = req.query.plantId || 'DefaultID';  // Handle the default case or error
//
//     try {
//         // Fetch messages from the database that are specific to the plant and sort them by timestamp
//         const messages = await Message.find({ plantId: plantId }).sort({ timestamp: 1 });
//         res.render('chat', { title: `Chat about ${plantName}`, messages: messages, plantName: plantName, plantId: plantId });
//     } catch (err) {
//         console.error(err);
//         res.status(500).render('error', { error: err });
//     }
// });
//
// // Post a new message for a specific plant
// router.post('/', async (req, res) => {
//     console.log(req.body);
//     const { plantName, plantId, username, message } = req.body;
//
//     const newMessage = new Message({
//         username: username,
//         message: message,
//         plantId: plantId
//     });
//
//     try {
//         await newMessage.save();
//         res.redirect(`/chat?plantName=${encodeURIComponent(plantName)}&plantId=${plantId}`);
//     } catch (err) {
//         console.error(err);
//         res.status(400).json({ message: err.message });
//     }
// });
//
// module.exports = router;
