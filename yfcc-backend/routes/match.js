const match = require("express").Router();
const matchController = require("../controllers/match");
const authAdmin = require("../middlewares/authAdmin");


match.get("/total", matchController.total);
match.get("/get", matchController.get);

match.get("/getAllAdmin", authAdmin({ admin: true, director: true, coach: true, player: true, customer: false }), matchController.getAllAdmin);

match.get("/get/:id", matchController.getOne);

match.post("/add", authAdmin({ admin: true, director: false, coach: false, player: false, customer: false }), matchController.add);

match.put("/edit/:id", authAdmin({ admin: true, director: false, coach: false, player: false, customer: false }), matchController.edit);

match.post("/remove", authAdmin({ admin: true, director: false, coach: false, player: false, customer: false }), matchController.remove);


module.exports = match