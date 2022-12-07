const router = require('express').Router();
const passport = require ('passport');
const User = require('./User');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require("jsonwebtoken");

passport.use(new LocalStrategy(User.authenticate()));

//read docs on these
// passport.serializeUser(function(user, done){
//     done(null, user.id);
// });

// passport.deserializeUser(function(id, done) {
//     User.findById(id, function (err, user) {
//             done(err, user);
//     });
// });

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// passport.serializeUser((user, cb) => {
//     cb(null, user.id);
// });
// passport.deserializeUser((id, cb) => {
//     User.findOne({_id: id}, (err, user) => {
//         cb(err, user);
//     });
// });


//22:56
router.post('/register', async (req, res) =>{

    const { username, firstName, lastName, email, password } = req.body;
    console.log(username, firstName, lastName, email, password);

    if (username === undefined || firstName === undefined  || lastName === undefined || email === undefined || password === undefined){
        res.status(400);
       res.send({msg: 'Please fill in all fields'});
    }

    try {
        const registerUser = await User.register({
            username: username, 
            email: email, 
            firstName: firstName,
            lastName: lastName
        }, password); 
        if (registerUser){
            console.log("registered user");
            passport.authenticate('local')(req, res, async function(){
                if (req.isAuthenticated()){
                    console.log("user id: " + registerUser.id);
                    res.json({ success: true, token: generateToken(registerUser.id)})
                }
            });
        } else {
            res.send({ msg: "registration failure. Try again!" });
        }
    } catch (err){
        console.log("register error " +err);
        res.send({msg : "Error registering user: " + err + "--Try again", success: false});
    }
});

router.post('/login', (req, res) => {

    if (req.body.username === undefined || req.body.password === undefined){
        res.send({success: false, msg: "fill in all fields!"});
    }

    const { username } = req.body;

    const newUser = new User({
        username: username
    });
    console.log("attempting to log in");
    req.login(newUser, (err)=> {
        if (err){
            console.log("error loggin in: " + err);
            res.send({ success: false });
        } else {
           passport.authenticate('local')(req, res, async function(){
                const user = await User.find({username: username});
                if (user){
                    console.log(user[0]);
                    const { id, email, username, firstName, lastName, pickUpGroups } = user[0]; //user is array
                    console.log(id);
                    res.json({ success: true, email, username, 
                        firstName, lastName, pickUpGroups, token: generateToken(id)});
                } else{
                    res.send({success: false, msg: "could not find user"});
                }
           }); 
        }
    });
});

const generateToken = (id) => { 
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
}

router.get("/logout", function(req, res){
    console.log(req.user);
    console.log(JSON.stringify(req.body));
    req.logout(function(err){
        if (err){
        console.log(err);
        res.json({success: false, msg: "could not log out due to error: " + err})
        } else{
            res.json({success: true, msg: "logged out"});
            console.log("logged out succesfully");
        }
    });
});

module.exports = router;