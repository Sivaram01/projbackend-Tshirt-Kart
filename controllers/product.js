
const Product = require("../models/product");
const formidable = require('formidable');
const _ = require("lodash");
const fs = require("fs");



exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
  .populate("category")
  .exec((err, product)=> {
    if(err || !product){
      res.status(400).json({
        error: "Product not found"
      });
    }
    req.product = product
    next()
  });
};

exports.createProduct = (req, res) => {
 
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file)=> {
    if(err){
      return res.status(400).json({
        error: "problem with image"
      })
    }
    //destructure the fields
    const {name, description, price, category, stock} = fields
     //restrictions on the fields
    if(!name || !description || !price || !category || !stock){
      return res.status(400).json({
        error: "Please include all fields"
      })
    }
    
     product = new Product(fields);

    //handle the files
     if(file.photo){
       if(file.photo.size > 3000000){
         return res.status(400).json({
           error : "File size is too big..."
         })
       }
       product.photo.data = fs.readFileSync(file.photo.path)
       product.photo.contentType = product.photo.type
     }
    //  console.log(product);
     // save to the DB
     product.save((err, product)=> {
       if(err){
         res.status(400).json({
           error: "saving product in DB failed"
         })
       }
       res.json(product)
     })
  });
};

exports.getProduct = (req, res) =>{
   
try{
const product= req.product
if(!product){
  return res.status(400).json({
    error: "no product found"
  })
} else {
  product.photo = undefined
   res.json(product)
}
} catch(err){
console.log(err)
  return res.send("No product found!")

}
}

//middleware
exports.photo = (req, res , next) => {
  if(req.product.photo.data){
    res.set("Content-Type", req.product.photo.contentType)
    return res.send(req.product.photo.data)
  }
  next()
}

exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file)=> {
    if(err){
      return res.status(400).json({
        error: "problem with image"
      })
    }
    
    //updation code
    let product  = req.product;
     product = _.extend(product, fields)

    //handle the files
     if(file.photo){
       if(file.photo.size > 3000000){
         return res.status(400).json({
           error : "File size is too big..."
         })
       }
       product.photo.data = fs.readFileSync(file.photo.path)
       product.photo.contentType = product.photo.type
     }
    //  console.log(product);
     // save to the DB
     product.save((err, product)=> {
       if(err){
         res.status(400).json({
           error: "upadtion of product failed"
         })
       }
       res.json(product)
     })
  });
}

exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
      if(err){
        return res.status(400).json({
          error: "Failed to delete the product"
        })
      }
      res.json({
        message: "product deletion was successfull", deletedProduct
      });
  });
};

//product listing
exports.getAllProducts = (req, res) =>{
  let limit = req.query.limit ? parseInt(req.query.limit) : 8
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id"
  Product.find()
  .select("-photo")
  .populate("category")
  .sort([[sortBy, "asc"]])
  .limit(limit)
  .exec((err, products)=> {
    if(err){
      return res.status(400).json({
        error: "No product was found"
      })
    }
    res.json(products)
  })
}

exports.getAllUniqueCategories = (req,res) => {
  Product.distinct("category", {}, (err, category)=> {
    if(err){
      return res.status(400).json({
        error: "No category Found"
      })
    }
    res.json(category)
  });
};


exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map(prod => {
    return {
      updateOne: {
        filter: {_id: prod._id},
        update: {$inc: {stock: -prod.count, sold: +prod.count}}
      }
    }
  })
   Product.bulkWrite(myOperations, {}, (err, products) => {
    if(err){
      res.status(400).json({
        error: "Bulk Operation Failed"
      })
    }
    next()
   })
}

