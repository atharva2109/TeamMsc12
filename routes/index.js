var express = require('express');
var router = express.Router();
var API_KEY = require('../public/javascripts/API')
var Sighting = require('../models/sighting')
const {create} = require('../controllers/sighting');
const sightingController = require('../controllers/sighting');
const sightingModel = require('../models/sighting');
const session = require('express-session');
var multer=require("multer")
/* GET home page. */

router.use(session({
    secret: 'your-secret-key', // Change this to a secret key for your application
    resave: false,
    saveUninitialized: true
}));

var storage=multer.diskStorage({
    destination:function (req,file,cb){
        cb(null,'public/images/uploads')
    },
    fileName: function (req,file,cb){
        var original=file.originalname;
        var file_extension=original.split(".")
        filename=Date.now()+"."+file_extension[file_extension.length-1];
        cb(null,filename);
    }
});

let upload=multer({storage:storage})

function generateUserID() {
    const timestamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    const userID = `${timestamp}${randomNumber}`;
    return userID;
}

router.get('/', async (req, res, next)=> {
    if (!req.session.user_id) {
        req.session.user_id = generateUserID();
    }

    const page = parseInt(req.query.page) || 1;
    const limit = 8; // Number of plants per page

    // Fetch plant data from the database
    const plants = await sightingController.getAll(page, limit);

    // Calculate total number of pages
    const totalPlants = await sightingModel.countDocuments();
    const totalPages = Math.ceil(totalPlants / limit);

    const topPlants = await Sighting.find()
        .sort({ date: -1 })
        .limit(3);

    res.render('index', {title: 'Botanical Lens', api: API_KEY, plants, currentPage: page, totalPages,topPlants});
});

router.get('/addplant', function (req, res, next) {
    res.render('addplant', {title: 'Add Plant'}); // Use 'addplant' as the EJS template file name
});

router.post('/addplant', upload.single('uploadImage'),async (req, res) => {
    // Call the create function from controllers/sightings.js
    let filePath = req.file ? req.file.path : null;
    await create(req,filePath);
    res.redirect('/');
});


module.exports = router;
