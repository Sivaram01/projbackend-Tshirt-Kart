const User = require("../models/user");
const { check, validationResult } = require("express-validator");
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

//create and validate signup method 
exports.signup = (req, res) => {
  const errors = validationResult(req);
  //only if error is empty then create user and save it on DB

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg
    });
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      console.log(err)
      return res.status(400).json({
        err: "NOT able to save user in DB"
      });
    }
    res.json({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      id: user._id
    });
  });
};

//create and validate signIn method 

exports.signin = (req, res)=> {
  const errors = validationResult(req);
  const {email , password} = req.body;
 
  //only if error is empty then find user from DB
  
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg
    });
  }

  User.findOne({email}, (err, user)=>{
      if(err || !user){
       return res.status(400).json({
          error: "User Email does not exists"
        });
      }
      if(!user.authenticate(password)){
       return res.status(401).json({
          error: "Email and Password does not match"
        });
      }
      //create token
    const token = jwt.sign({_id: user._id}, process.env.SECRET)
    //put token in cookie
    res.cookie("token", token, {expire: new Date() + 9999});
    // send response to frontend
    const {_id, firstname, email, role} = user;
    return res.json({token, user:{_id , firstname, email, role}});
  });
}

//clear all token from cookies and signout user
exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signout successfully"
  });
};


//protected routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  algorithms: ['RSA', 'sha1', 'RS256','HS256'],
  userProperty: "auth"
});

//Custom middlewares
exports.isAuthenticated = (req, res, next)=> {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if(!checker){
    return res.status(403).json({
      error: "ACCESS DENIED"
    });
  }
  next()
}

// check if user is Admin
exports.isAdmin = (req, res, next)=> {
  if(req.profile.role === 0){
    return res.status(403).json({
      error: "YOU ARE NOT AN ADMIN, ACCESS DENIED"
    });
  }
  next()
}


