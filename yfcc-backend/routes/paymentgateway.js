const pg = require("express").Router();
const pgController = require("../controllers/paymentGateway");

pg.post('/getPaymentGateway/:id', pgController.getGateway);
pg.post('/addOrder', pgController.addOrder);

pg.post('/paymentSuccess', pgController.paymentStatusUpdate);
pg.post('/matchOdp', pgController.matchOdp)
module.exports = pg