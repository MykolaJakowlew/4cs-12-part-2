const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');

const { setupDbConnection } = require('./setup/mongoose');
const API = require('./api');

const app = express();

const bootstrap = async () => {

 await setupDbConnection();

 app.use(bodyParser.json());
 app.use(cors());

 app.use(API.router);

 app.listen(process.env.PORT, () => console.log(`Server was started on ${process.env.PORT}`));
};

bootstrap();