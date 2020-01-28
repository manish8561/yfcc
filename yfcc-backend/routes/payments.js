const payments = require("express").Router();
const paymentsController = require("../controllers/payments");

const authAdmin = require("../middlewares/authAdmin");
const auth = require("../middlewares/auth");

payments.get('/getAll', authAdmin, paymentsController.getAll);

payments.get('/chartdata', paymentsController.testData);

payments.get('/getBuyerPayments/:uid', auth, paymentsController.getBuyerPayments);
payments.post('/updateResponse', paymentsController.updateResponse);

module.exports = payments