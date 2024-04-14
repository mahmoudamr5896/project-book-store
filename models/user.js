const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  confirm: { type: Boolean, default: false } ,
  Isadmin: { type: Boolean, default: false } 
});

const User = mongoose.model('User', userSchema);

module.exports = User;
