const {Order, ProductCart} = require("../models/order");


//get order  details from the user model and attach it to request object 
exports.getOrderById = (req, res, next, id) => {
   Order.findById(id)
   .populate("products.product", "name price")
   .exec((err, order) => {
        if(err){
          return res.status(400).json({
            error: "No Order Found in DB"
          })
        }
        req.order = order
        next()
   })
  
}

//create order
exports.createOrder = (req , res) => {
  req.body.order.user = req.profile;
  const order = new Order(req.body.order)
  order.save((err , order)=> {
    if(err){
      return res.status(400).json({
        error: "Failed to save your order in DB"
      })
    }
    res.json(order)
  })
}

//get all the order data
exports.getAllOrders = (req , res) => {
  Order.find()
  .populate("user" , "_id name")
  .exec((err , order) => {
    if(err){
      return res.status(400).json({
        error: "No order in DB"
      })
    }
    res.json(order)
  })
}

exports.getOrderStatus = (req , res) => {
  res.json(Order.schema.path("status").enumValues)
}

//update order
exports.updateStatus = (req , res) => {
  Order.findOneAndUpdate(
    {_id: req.body.orderId},
    {$set: {status: req.body.status}},
    (err , order) => {
      if(err){
        return res.status(400).json({
          error: "Updation of order failed"
        });
      }
      res.json(order)
    });
};


