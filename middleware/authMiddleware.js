const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
  console.log('Made it to inner 1');
    // check json web token exists & is verified
    if (token) {
        jwt.verify(token, 'group 4 secret', (err, decodedToken) => {
            if (err) {
                console.log(err.message);
              console.log('Made it to inner 2');
                res.redirect('/login');
            } else {
              // displays token to console
                console.log(decodedToken);
                next();
            }
        });
    }
    else {
        res.redirect('/login');
    }
}

// check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
   console.log('Made it to step 1');
    if (token) {
        jwt.verify(token, 'group 4 secret', async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                console.log('Made it to step 2');
                res.locals.user = null;
                next();
            } else {
                try{
                    // console.log(decodedToken);   TEST LINE
                    let user = await User.findById(decodedToken.id);
                    req.user = user;
                   console.log('Made it to step 3');
                    console.log(req.user);
                    res.locals.user = user;
                    next();
                } catch (error) {
                    console.log(error.message);
                    res.locals.user = null;
                    next();
                }
            }
        });
    }
    else {
        res.locals.user = null;
        console.log('Made it to step 4');
        next();
    }
}
console.log('exiting middleware.js');
module.exports = { requireAuth, checkUser};