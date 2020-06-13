const config = require('../config/config');
const client = require('twilio')(config.accountSID, config.authToken);

exports.verify = (req, res) => {
  // res.send('Hello');

  const { code } = req.body;

  client.verify
    .services(config.serviceID)
    .verificationChecks.create({
      to: `+${req.query.phonenumber}`,
      code: code,
    })
    .then((data) => {
      res.status(200).send(data);
      if (data.valid === true) {
        res.json({ msg: 'You have been validated' });
      } else {
        res.json({ msg: 'Incorrect code' });
      }
    });
};
