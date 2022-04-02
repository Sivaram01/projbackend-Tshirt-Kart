

const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.merchant_Id,
  publicKey: process.env.public_Key,
  privateKey: process.env.private_Key
});

exports.getToken = (req, res) => {
  gateway.clientToken.generate({}, (err, response) => {
  // pass clientToken to your front-end
  if(err){
    res.status(500).send(err);
  } else {
    res.send(response);
  }
});
}

exports.processPayment = (req , res) => {
   
  let nonceFromTheClient = req.body.paymentMethodNonce
  
  let amountFromTheClient = req.body.amount
  gateway.transaction.sale({
    amount: amountFromTheClient,
    paymentMethodNonce: nonceFromTheClient,
    options: {
      submitForSettlement: true
    }
  }, (err, result) => {
    if(err){
      res.status(500).json(err)
    } else {
      res.json(result)
    }
  });

}