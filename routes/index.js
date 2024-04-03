var express = require('express');
var router = express.Router();
var API_KEY=require('../public/javascripts/API')
var Sighting = require('../models/sighting')
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
router.get('/', function(req, res, next) {
  if (!req.session.user_id) {
    req.session.user_id = generateUserID();
  }
  res.render('index', { title: 'Botanical Lens',api: API_KEY });
});

router.get('/addplant', function(req, res, next) {
  res.render('addplant', { title: 'Add Plant' }); // Use 'addplant' as the EJS template file name
});

router.post('/addplant', async (req, res) => {
  try {
    const newSighting = new Sighting({
      date: req.body.datePicker,
      location: req.body.location,
      address: {
        line: req.body.addressLine,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        pinCode: req.body.pincode
      },
      altitude: req.body.altitude,
      status: req.body.verificationStatus,
      plant: {
        name: req.body['plantName'],
        commonName: req.body.plantCommonName,
        scientificName: req.body.plantScientificName,
        family:  req.body.plantFamily,
        genus: req.body.plantGenus,
        species: req.body.plantSpecies,
        description: req.body.plantDescription,
        size: {
          length: req.body.plantLength,
          width: req.body.plantWidth,
          height: req.body.plantHeight
        },
        characteristics: {
          flowering: req.body.floweringValue,
          hasLeaves: req.body.leavesValue,
          fruitBearing: req.body.fruitValue,
          sunExposure: req.body.sunexposure,
          flowerColor: req.body.flowerColor
        },
        identificationLink: req.body.idLink,
        photos: [req.body.uploadImage]
      },
      user: {
        id:  req.session.user_id,
        name: req.body.username,
        contactDetails: {
          email: req.body.email,
          phoneNumber: req.body.phone
        }
      },
    });

    await newSighting.save();
    res.redirect('/'); // Redirect after saving
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving the plant sighting');
  }
});

module.exports = router;
