const { Router } = require('express');

const OrderApi = require('./orders.api');

const router = Router();

router.use(OrderApi.router);

module.exports = { router };