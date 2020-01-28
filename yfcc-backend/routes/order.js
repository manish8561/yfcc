const orders = require("express").Router();
const ordersController = require("../controllers/order");

//const authAdmin = require("../middlewares/authAdmin");
//const auth = require("../middlewares/auth");

orders.get('/getAll', ordersController.get);

orders.post('/chartdata', ordersController.chartData);

orders.get('/getOne', ordersController.getOne);

orders.post('/add', ordersController.add);

module.exports = orders;