const { remove } = require("../models/category.js");
const Category = require("../models/category.js");

// custom middleware for selecting the category by its ID 

// get the category details from the user model and attach it to request object 
exports.getCategoryById = (req, res, next, id) =>{
 Category.findById(id).exec((err, cate)=> {
   if(err){
     return res.status(400).json({
       error: "Category not found in DB"
     });
   }
   req.category = cate;
   next();
 })  
}

//create category
exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, category) => {
    if(err){
      return res.status(400).json({
        error: "Not able to save user in DB"
      });
    }
    res.json(category)
  }) ;
};


//get category by id
exports.getCategory = (req, res) => {
return res.json(req.category)
}

// get all the category
exports.getAllCategory = (req, res) => {
  Category.find().exec((err , categories) => {
    if(err){
      return res.status(400).json({
        error: "No categories was found"
      })
    }
    res.json(categories)
  });
};

//update category
exports.updateCategory = (req, res) => {
  const category = req.category;
  category.name = req.body.name;
  category.save((err, updateCategory) => {
    if(err){
      return res.status(400).json({
        error: "Failed to update category"
      });
    }
    res.json(updateCategory);
  });
};

//delete category
exports.removeCategory = (req , res) => {
  const category = req.category;
  category.remove((err, category) => {
    if(err){
      return res.status(400).json({
        error: "Failed to delete this category"
      });
    }
    res.json({
      message: `Successfully deleted ${category}`
    })
  });
 };