const mongoose = require('mongoose');

const VerifySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  code: {
    type: Number,
    required: true,
  },
  telephone: {
    type: Number,
    required: true,
  },
});

module.exports = VerifyCode = mongoose.model('verify', VerifySchema);
