const mongoose = require('mongoose');

var tendigitrandom = `DA${Math.floor(1000000000 + Math.random() * 9000000000)}`;

const AccountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  accountId: {
    type: String,
    default: tendigitrandom,
  },
  middlename: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  homeaddress: {
    type: String,
    required: true,
  },
  accounttype: {
    type: String,
    enum: ['Savings', 'Current'],
  },
  occupation: {
    type: String,
  },
});

module.exports = Account = mongoose.model('account', AccountSchema);
