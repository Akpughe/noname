const User = require('../model/User');
const Verify = require('../model/Verify');
const config = require('../config/config');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const configg = require('config');
const jwt = require('jsonwebtoken');

const client = require('twilio')(config.accountSID, config.authToken);

exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstname, lastname, email, password } = req.body;
  const { phonenumber } = req.query;

  try {
    let user = await User.findOne({ phonenumber });

    if (user) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Phone number has already been used' }] });
    }

    user = new User({
      firstname,
      lastname,
      email,
      phonenumber,
      password,
    });

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await client.verify.services(config.serviceID).verifications.create({
      to: `+${req.query.phonenumber}`,
      channel: 'sms',
    });

    await user.save();

    // res.send('Awaiting approval');

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, configg.get('jwtSecret'), (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }

  // app.get('/login', (req, res) => {
  //   client.verify
  //     .services(config.serviceID)
  //     .verifications.create({
  //       to: `+${req.query.phonenumber}`,
  //       channel: req.query.channel,
  //     })
  //     .then((data) => {
  //       res.status(200).send(data);
  //     });
  // });
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { phonenumber, password } = req.body;

  try {
    //See if user exits
    let user = await User.findOne({ phonenumber });

    if (!user) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Phone number does not exist' }] });
    }

    //matching user details
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    //Return JWT
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, configg.get('jwtSecret'), (err, token) => {
      if (err) throw err;
      res.json({
        token,
        user: {
          id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          phonenumber: user.phonenumber,
          staus: user.status,
        },
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
