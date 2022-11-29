const jwt = require('jsonwebtoken');
const User = require('./User');

const protect = async(req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            console.log("in protect: ");
            token = req.headers.authorization.split(' ')[1];

           // console.log(token);

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id);
            console.log(req.user.firstName);
            next();
        } catch (e){
            console.log('what the heck?');
            console.log(e);
            res.status(401);
            res.send({msg: "not authorized"});
        }
    } 

    if (!token){
        res.send({msg: "Not authorized. No token"})
        console.log("no token, not authorized");
    }

    console.log("")
}

module.exports = { protect };