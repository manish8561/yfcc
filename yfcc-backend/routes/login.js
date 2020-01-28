const login = require("express").Router();
const loginController = require("../controllers/login");

login.post("/loginCheck", loginController.loginCheck);

login.get('/validToken', loginController.validToken);
module.exports = login