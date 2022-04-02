const express = require("express");
const router = express.Router();

const { isSignedIn , isAuthenticated } = require("../controllers/auth");
const { getToken , processPayment } = require("../controllers/paymentBrainTree");
const { getUserById } = require("../controllers/user");

router.param('userId', getUserById);


//read route
router.get("/payment/gettoken/:userId" , isSignedIn , isAuthenticated, getToken);

//create route
router.post("/payment/braintree/:userId" , isSignedIn , isAuthenticated, processPayment);

module.exports = router;
