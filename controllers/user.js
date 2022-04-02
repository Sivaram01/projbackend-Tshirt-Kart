const User = require("../models/user.js");
const Order = require("../models/order.js");

// get the user details from the user model and attach it to request object 
exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err , user) => {
   if(err || !user){
     return res.status(400).json({
       error: "No user was found in DB"
     });
   }
   req.profile = user;
   next()
  });
}

//get user data and hide passssword and salt information
exports.getUser = (req, res)=> {

  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  return res.json(req.profile);
};

// find by id and update the user
exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    {_id: req.profile._id},
    {$set: req.body},
    {new: true, useFindAndModify: false},
    (err, user) => {
       if(err || !user){
        return res.status(400).json({
          error: "You are not Authorized to update this user"
        });
      }
      let userData = JSON.parse(JSON.stringify(user))
      delete userData.salt
      delete userData.encry_password
      res.json(userData);
    }
  )
}

exports.userPurchaseList = (req, res) => {
  Order.find({user: req.profile._id})
  .populate("user", "_id name")
  .exec((err, order) =>{
   if(err){
     return res.status(400).json({
       error : "No Order in this account"
     })
   }
   return res.json(order);
  });
};

//custom middleware to update purchase items
exports.pushOrderInPurchaseList = (req, res, next) => {
   let purchases = [];
   req.body.order.products.ForEach(product => {
     purchases.push({
       _id: product._id,
        name : product.name,
        description : product.description,
        category : product.category,
        quantity : product.quantity,
        amount : req.body.order.amount,
        transaction_id : req.body.order.transaction_id 
     });
   });

   // store this in DB
   User.findOneAndUpdate(
     {_id: req.profile._id},
     {$push: {purchases: purchases}},
     {new: true},
     (err , purchases) => {
       if(err){
         return res.status(400).json({
           error: "Unable to save purchase list"
         })
       }
       next()
     }
   )
}