const express = require('express');
const connectDB = require('./config/db');
var cors = require('cors');
const app = express();
const config = require('./config/config');
const authRoutes = require('./routes/auth');
const verifyRoutes = require('./routes/verify');
const userRoutes = require('./routes/user');
const bodyParser = require('body-parser');

const client = require('twilio')(config.accountSID, config.authToken);
// const Nexmo = require('nexmo');
// const nexmo = new Nexmo({
//   apiKey: config.apiKey,
//   apiSecret: config.apiSecret
// });

connectDB();

//init middleware
app.use(cors());

app.use(bodyParser.json());

app.use(express.json({ extended: false }));

app.get('/', (req, res, next) => res.send('API Running...'));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/verify', verifyRoutes);


const port = 3000;

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
