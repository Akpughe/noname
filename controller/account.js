const Account = require('../model/Account');
const User = require('../model/User');
const { validationResult } = require('express-validator');

exports.me = async (req, res, next) => {
  try {
    const account = await Account.findOne({
      user: req.user.id,
    }).populate('user', ['firstname', 'lastname', 'phonenumber', 'email']);

    if (!account) {
      return res.status(400).json({ msg: 'There is no account for this user' });
    }
    res.json(account);
  } catch (error) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.createAccount = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    middlename,
    gender,
    dob,
    homeaddress,
    accounttype,
    occupation,
  } = req.body;

  const accountFields = {};

  accountFields.user = req.user.id;

  if (middlename) accountFields.middlename = middlename;
  if (gender) accountFields.gender = gender;
  if (dob) accountFields.dob = dob;
  if (homeaddress) accountFields.homeaddress = homeaddress;
  if (accounttype) accountFields.accounttype = accounttype;
  if (occupation) accountFields.occupation = occupation;

  try {
    let account = await Account.findOne({ user: req.user.id });

    if (account) {
      //update account
      account = await Account.findOneAndUpdate(
        { user: req.user.id },
        { $set: accountFields },
        { new: true }
      );
      return res.json(account);
    }

    account = new Account(accountFields);

    await account.save();
    res.json(account);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getallAccounts = async (req, res) => {
  try {
    const accounts = await Account.find().populate('user', [
      'firstname',
      'lastname',
      'phonenumber',
      'email',
    ]);
    res.json(accounts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
