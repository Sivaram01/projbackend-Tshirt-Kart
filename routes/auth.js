var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");

// create post route for signup and sigin and inject validation

router.post(
  "/signup",
  [
    check("firstname", "name should be at least 3 char").isLength({ min: 3 }),
    check("email", "email is required").isEmail(),
    check("password", "password should be at least 8 char").isLength({ min: 8 })
  ],
  signup
);

router.post(
  "/signin",
  [
    check("email", "email is required").isEmail(),
    check("password", "password should be at least 8 char").isLength({ min: 8 })
  ],
  signin
);


router.get("/signout", signout);



module.exports = router;
