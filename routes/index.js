var express = require('express');
var router = express.Router();
var API_KEY=require('../public/javascripts/API')

/* GET home page. */


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Botanical Lens',api: API_KEY });
});

module.exports = router;
