const User = require('../model/User');
const Verify = require('../model/Verify');
const config = require('../config/config');
const { validationResult } = require('express-validator');

const client = require('twilio')(config.accountSID, config.authToken);

exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstname, lastname, email, password } = req.body;
  const { phonenumber } = req.query;

  try {
    let user = await User.findOne({ email });

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

    await client.verify.services(config.serviceID).verifications.create({
      to: `+${req.query.phonenumber}`,
      channel: 'sms',
    });

    user.save();
    res.send('Awaiting approval');
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
