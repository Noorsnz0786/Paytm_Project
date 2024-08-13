const mongoose = require("mongoose");

const connection = mongoose.connect(
  "mongodb+srv://noorainsnz0786:Abc%4009809800@paytmnoorain.3giob.mongodb.net/Users"
);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim : true
  }
});

const accountSchema = mongoose.create({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required : true
  },
  balance : {
    type : Number,
    required : true
    }
  })

const User = mongoose.model('User', userSchema);
const Account = mongoose.model('Account', accountSchema);

module.exports  = {
    User,
    Account
}