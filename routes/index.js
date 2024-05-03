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

router.use(session({
    secret: 'your-secret-key',
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
    const userId = req.query.user_id || generateUserID();
    res.locals.user_id = userId;
    const sightingId = req.query.sightingId || generateUserID();
    res.locals.sighting_id = sightingId;
    console.log("Routes user id: ",res.locals.user_id)
    const page = parseInt(req.query.page) || 1;
    const limit = 8; // Number of plants per page

    const plants = await getPlantsPagewise(page, limit);
    const totalPlants = await sightingModel.countDocuments();
    const totalPages = Math.ceil(totalPlants / limit);

    const topPlants = await Sighting.aggregate([
        {
            $addFields: {
                dateObject: {
                    $dateFromString: {
                        dateString: "$date",
                        format: "%d/%m/%Y, %H:%M:%S",
                        timezone: "UTC"
                    }
                }
            }
        },
        {
            $sort: { dateObject: -1 }
        },
        {
            $limit: 3
        }
    ]);
console.log("Top plants from route page",topPlants)
    res.render('index', {title: 'Botanical Lens', api: API_KEY, plants, currentPage: page, totalPages,topPlants});
});

router.get('/addplant', function (req, res, next) {
    const userId = req.query.user_id || generateUserID();
    const sightingId=req.query.sighting_id || generateUserID();
    res.render('addplant', {title: 'Add Plant',user_id:userId,sighting_id:sightingId}); // Use 'addplant' as the EJS template file name
});

router.post('/addplant',upload.none(), (req, res) => {
        create(req.body).then(plant => {
            res.status(200).send(plant);
        }).catch(err => {
            console.log(err);
            res.status(500).send(err);
        });

});

// route to get all todos
router.get('/plants', function (req, res, next) {
    getAll().then(todos => {
        return res.status(200).send(todos);
    }).catch(err => {
        console.log(err);
        res.status(500).send(err);
    });
})

router.get('/api/uploads-list', (req, res) => {
    const uploadsDir = path.join(__dirname, '..','public', 'images', 'uploads');
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            console.error('Error reading uploads directory:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        const uploadUrls = files.filter(file => !file.startsWith('.')).map(file => `/public/images/uploads/${file}`);
        return res.json(uploadUrls);
    });
});

router.get('/sightingdetails', function (req, res, next) {
    const plantData = JSON.parse(decodeURIComponent(req.query.plant));
    res.render('sightingdetails', {title: 'Plant Details', sighting: plantData });
});

module.exports = router;
