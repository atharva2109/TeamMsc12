var express = require('express');
var router = express.Router();
var API_KEY=require('../public/javascripts/API')

/* GET home page. */


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Botanical Lens',api: API_KEY });
});

router.get('/addplant', function(req, res, next) {
  res.render('addplant', { title: 'Add Plant' }); // Use 'addplant' as the EJS template file name
});

module.exports = router;
