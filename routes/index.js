var express = require('express');
var router = express.Router();
var API_KEY=require('../public/javascripts/API')
var Sighting = require('../models/sighting')

/* GET home page. */


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Botanical Lens',api: API_KEY });
});

router.get('/addplant', function(req, res, next) {
  res.render('addplant', { title: 'Add Plant' }); // Use 'addplant' as the EJS template file name
});

router.post('/addplant', async (req, res) => {
  try {
    const newSighting = new Sighting({
      date: req.body.date,
      location: req.body.location, // Make sure form input names match these keys
      plant: {
        name: req.body['plantName'], // Assuming your form has an input with name="plantName"
        // Populate other plant fields as necessary
      },
      user: {
        id: req.body['userId'], // Assuming your form has an input with name="userId"
        // Populate other user fields as necessary
      },
      // Populate other fields as necessary
    });

    await newSighting.save();
    res.redirect('/success'); // Redirect after saving
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving the plant sighting');
  }
});

module.exports = router;
