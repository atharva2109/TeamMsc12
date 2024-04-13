var express = require('express');
var router = express.Router();
var API_KEY = require('../public/javascripts/API')
var path = require('path');
var Sighting = require('../models/sighting')
const {create,getAll,getPlantsPagewise} = require('../controllers/sighting');
const sightingModel = require('../models/sighting');
const session = require('express-session');
var multer=require("multer")
var fs=require("fs")
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
        console.log("File nane: ",filename)
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
    const userId = req.query.user_id || generateUserID();
    res.locals.user_id = userId;
    console.log("Routes user id: ",res.locals.user_id)
    const page = parseInt(req.query.page) || 1;
    const limit = 8; // Number of plants per page

    // Fetch plant data from the database
    const plants = await getPlantsPagewise(page, limit);

    // Calculate total number of pages
    const totalPlants = await sightingModel.countDocuments();
    const totalPages = Math.ceil(totalPlants / limit);

    const topPlants = await Sighting.find()
        .sort({ date: -1 })
        .limit(3);

    res.render('index', {title: 'Botanical Lens', api: API_KEY, plants, currentPage: page, totalPages,topPlants});
});

router.get('/addplant', function (req, res, next) {
    const userId = req.query.user_id || generateUserID();
    res.render('addplant', {title: 'Add Plant',user_id:userId}); // Use 'addplant' as the EJS template file name
});

router.post('/addplant',upload.single('uploadImage'),async (req, res) => {
console.log("Add plant req body: ",req.body)

    await create(req.body,req.file.path);
});

// route to get all todos
router.get('/plants', function (req, res, next) {
    getAll().then(todos => {
        console.log(todos);
        return res.status(200).send(todos);
    }).catch(err => {
        console.log(err);
        res.status(500).send(err);
    });
})

router.get('/api/uploads-list', (req, res) => {
    const uploadsDir = path.join(__dirname, '..','public', 'images', 'uploads');
console.log(uploadsDir)
    // Read the directory and get the list of files
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            console.error('Error reading uploads directory:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        // Construct URLs for each file in the uploads folder
        const uploadUrls = files.map(file => `/public/images/uploads/${file}`);

        // Send the list of URLs as a JSON response
        return res.json(uploadUrls);
    });
});

module.exports = router;
