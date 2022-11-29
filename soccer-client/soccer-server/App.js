require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoute = require('./Auth');
const cookieParser = require("cookie-parser");
const User = require("./User");
const PickUpGroup = require("./PickUpGroup");
const fs = require('fs');



const { protect } = require('./authMiddleware');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
}));

app.use(cors({
    origin: "http://localhost:8080", //react app is hosted here
    credentials: true
}));

app.use(cookieParser(process.env.COOKIE_SECRET))

app.use(express.json());

app.use((req, res, next) => {
    res.header({"Access-Control-Allow-Origin": "*"});
    next();
  }) 

// const whitelist = process.env.WHITELISTED_DOMAINS
//   ? process.env.WHITELISTED_DOMAINS.split(",")
//   : [];

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin || whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },

//   credentials: true,
// };

// app.use(cors(corsOptions));

app.use(passport.initialize());

app.use(passport.session());

mongoose.connect(process.env.dbConnect, {useNewUrlParser: true})
.then(() => console.log("database connected"))
.catch(err => console.log(err));

app.use('/', authRoute);

app.listen(process.env.PORT || 3000, () => console.log("server running"));

app.get("/", protect, async function(req, res){
    console.log("get request recieved. Checking auth");

    const { firstName, lastName, username, email } = await User.findById(req.user.id);

    res.json({
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: username,
        success: true
    });

    // if (req.isAuthenticated()){
    //     console.log("already logged in");
    //     res.send({ success: true });
    // } else {
    // console.log("not logged in");
    // res.send({ success: false });
    // }
});

app.get('/getCity/:city', function (req, res) {
    console.log("attempting fetch");
    const fileString = "./locationInfo/data/United_States-US/" + req.params.city + "/allCities.lite.json";
    console.log("file: " + fileString);
    try {
        var data = JSON.parse(fs.readFileSync(fileString, 'utf-8'));
        var dataSift = [];
        data.forEach((city) => dataSift.push(city.name));
        res.json({ success: true, cities: dataSift });
    } catch (error) {
        console.log(error);
        res.json({ success: false, error: error });
    }
});

app.get('/findGroups/:state/:city', protect, async function(req, res) {
const state = req.params.state;
const city = req.params.city;
try {
    const groups = await PickUpGroup.find({state: state, city: city});
    res.json({success: true, groups: groups});
} catch (error) {
    console.log(error);
    res.json({success: false, error: error});
}
});

app.post('/createGroup', protect, async function (req, res) {
    console.log("attempting to create group");
    const { state, city, ageGroup, competitiveness, publicOrPrivate,
        groupName, playTimes, playArea, players, groupID, } = req.body;

    const takenNameInCity = await PickUpGroup.find({ state: state, city: city, groupName: groupName });
    console.log("sup: " + takenNameInCity);
    if (takenNameInCity != "") { //name is taken within city. 
        console.log("Error: Group name is taken within city");
        res.json({ success: false, msg: "Name is taken" });
    }
    else {
        console.log("BODY: " + JSON.stringify(req.body));
        const registerGroup = ({
            state: state,
            city: city,
            ageGroup: ageGroup,
            competitiveness: competitiveness,
            groupName: groupName,
            playTimes: playTimes,
            playArea: playArea,
            players: players,
            id: groupID,
            creatorID: req.user.id,
            privacy: publicOrPrivate
        });

        try {
            PickUpGroup.create(registerGroup);
            console.log("adding group");
            res.json({ success: true, id: groupID });
        } catch (error) {
            console.log("ERRORRRRR: " + error);
            res.json({ success: false, msg: error});
        }
    }
});



app.patch("/updateProfile", protect, async function(req, res){
    console.log("Update Profile email request recieved: " + JSON.stringify(req.body));
    const {email, firstName, lastName} = req.body;
    try {
        await User.updateOne({_id: req.user.id},{email, firstName, lastName});
        res.json({success: true});
    } catch (e){
        console.log(e);
        res.json({success: false, msg: e});
    }
});


//User either joined or created a group and we need to save their updated pickupGroups
app.patch("/UpdateProfileGroups", protect, async function(req, res){
    console.log("Updating profile groups, request received: " + JSON.stringify(req.body));
    const pickUpGroups = req.body.pickUpGroups;      
    try {
        await User.updateOne({_id: req.user.id}, {pickUpGroups: pickUpGroups});
        res.json({success: true});
    } catch (e){
        res.json({success: false, msg: e});
    }

});

//Retrieve all information on a specific group
app.get("/getGroup/:groupID", protect, async function(req, res) {
    console.log("Fetching group information" + JSON.stringify(req.body));
    const groupID = req.params.groupID;
    try {
        const pickUpGroup = await PickUpGroup.findOne({id: groupID});
        console.log(pickUpGroup);
        res.json({success: true, pickUpGroup});
    } catch (e){
        res.json({success: false, msg: e});
    }
});

//update players in a specfic group.
app.patch("/joinGroup", protect, async function (req, res) {
    console.log("attempting to join group !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    const { groupID, username } = req.body;
    console.log("Updating group members: " + username);
    const group = await PickUpGroup.findOne({ id: groupID });
    var players = group.players;
    players.push(username);
    console.log(players);
    PickUpGroup.updateOne({ id: groupID }, { players: players }, function (err, docs) {
        if (err) {
            res.json({ success: false , msg: err});
        } else {
            console.log("updated docs" + JSON.stringify(docs));
            res.json({ success: true });
        }
    });
});



// app.get("/user", function(req, res){
//     console.log(req.user);
//     res.send( {user: req.user} );
// });

// app.get('/register', function(req, res){
//     if (req.isAuthenticated()){
//         console.log("already logged in");
//         res.send({ status: "already logged in" });
//     } else {
//         res.send({ status: "register" });
//     }
// });

// app.get('/login', function(req, res){
//     if (req.isAuthenticated()){
//         console.log("already logged in");
//         res.send({ status: "already logged in" });
//     } else {
//         res.send({ status: "login" });
//     }
// });

app.get('/favicon.ico', function(req, res){
    res.send(null);
});
