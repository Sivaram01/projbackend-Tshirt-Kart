const stripe = require("stripe")("sk_test_51KhqfbSE8QniQFnuwtcmjiQLwH4H4xyua8F64UWKDDak7XS8W1VH8SUSGqf5jrNTMKu7mHAhwvxDeCYqZzcvLWYL00wfPV7eV1");
const uuid = require('uuid/v4');


 exports.makePayment = (req , res) => {

  const {products ,token}  = req.body;
    console.log("products" , products);
    
   
    let amount = 0;
    products.map(p => {
      amount = amount + p.price 
    })
   
    //genarate unique ID helps prevent charging the user double even if any network issue
    const idempotencyKey = uuid()

    // create a customer using stripe method
   return stripe.customers.create({
     email: token.email,
     source: token.id
   }).then(customer => {
         stripe.charges.create({
           amount: amount*100,
           currency: 'usd',
           customer: customer.id,
           receipt_email: token.email,
           description: "a test account",
           shipping: {
             name: token.card.name,
             address: {
               line1: token.card.address_line1,
               line2: token.card.address_line2,
               city: token.card.address_city,
               country: token.card.address_country,
               postal_code: token.card.address_zip,

             }
           }
         } , {idempotencyKey})
         .then(result =>  res.status(200).json(result))
         .catch(err => console.log(err))
   }).catch(error => console.log(error))
}