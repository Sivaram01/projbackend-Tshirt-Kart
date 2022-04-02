const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

// create users model
const userSchema = new mongoose.Schema({
  firstname:{
    type: String,
    required : true,
    maxlength: 32,
    trim: true
  },
  lastname:{
    type: String,
    required : true,
    maxlength: 32,
    trim: true
  },
  email:{
    type: String,
    required : true,
    trim: true,
    unique: true
  },
  userinfo:{
  type: String,
  trim: true
  },
  encry_password:{
    type: String,
    required : true
  },

  salt: String,
  role:{
    type: Number,
    default:0
  },
  purchases:{
    type: Array,
    default:[]
  } ,
}, 

{timestamps: true}

);


//authenticate user and store the password data in salt method
userSchema.virtual("password")
     .set(function(password){
       this._password = password
       this.salt = uuidv4()
       this.encry_password = this.securePassword(password)
     })
     .get(function(){
       return this._password
     })

userSchema.methods ={
 
  authenticate: function(plainpassword){
     return this.securePassword(plainpassword) === this.encry_password
  },

  securePassword: function(plainpassword){
    if(!plainpassword) return "";
    try {
      return crypto.createHmac('sha256', this.salt)
      .update(plainpassword)
      .digest('hex');

    } catch (error) {
      return "";
    }
  }
};


module.exports = mongoose.model('User',userSchema);