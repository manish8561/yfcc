const gateway = require("express").Router();
const gatewayController = require("../controllers/gateway");

const auth = require("../middlewares/auth")
const authAdmin = require("../middlewares/authAdmin");

gateway.get("/getAll", authAdmin, gatewayController.getAll);
gateway.post("/insert", authAdmin, gatewayController.insert);
gateway.post("/update", authAdmin, gatewayController.update);
gateway.post("/remove", authAdmin, gatewayController.remove)

gateway.post("/statusUpdate", authAdmin, gatewayController.statusUpdate);
gateway.post("/addUserGateway", authAdmin, gatewayController.addUserGateway);
gateway.post("/removeUserGateway", authAdmin, gatewayController.removeUserGateway);
module.exports = gateway