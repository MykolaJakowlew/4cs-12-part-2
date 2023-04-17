const { Router } = require('express');

const { wrapperApi } = require('../shared/wrapperApi');
const { orderHandlers } = require('./handlers');

const router = Router();

router.post('/orders', wrapperApi(orderHandlers.createOrder));
router.patch('/orders/:_id', wrapperApi(orderHandlers.updateOrder));
router.patch('/orders/:_id/dishes', wrapperApi(orderHandlers.addDishInOrder));
router.delete('/orders/:_id/dishes', wrapperApi(orderHandlers.removeDishFromOrder));

router.get('/orders', wrapperApi(orderHandlers.getOrders));
router.get('/orders/:_id', wrapperApi(orderHandlers.getOrder));

module.exports = { router };