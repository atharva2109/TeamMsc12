var express = require('express');
var router = express.Router();
var API_KEY = require('../public/javascripts/API')
var Sighting = require('../models/sighting')
const {create} = require('../controllers/sighting');
const session = require('express-session');
/* GET home page. */

router.use(session({
    secret: 'your-secret-key', // Change this to a secret key for your application
    resave: false,
    saveUninitialized: true
}));

function generateUserID() {
    const timestamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    const userID = `${timestamp}${randomNumber}`;
    return userID;
}

router.get('/', function (req, res, next) {
    if (!req.session.user_id) {
        req.session.user_id = generateUserID();
    }
    res.render('index', {title: 'Botanical Lens', api: API_KEY});
});

router.get('/addplant', function (req, res, next) {
    res.render('addplant', {title: 'Add Plant'}); // Use 'addplant' as the EJS template file name
});

router.post('/addplant', async (req, res) => {
    // Call the create function from controllers/sightings.js
    await create(req);
    res.redirect('/');
});


module.exports = router;
