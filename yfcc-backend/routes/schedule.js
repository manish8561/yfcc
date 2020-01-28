const schedule = require("express").Router();
const scheduleController = require("../controllers/schedule");
// const auth = require("../middlewares/auth")
const authAdmin = require("../middlewares/authAdmin");


schedule.get("/get", scheduleController.get);
schedule.get("/get/:id", scheduleController.getDetails);
schedule.post("/add", authAdmin({ admin: true, director: false, coach: false, player: false, customer: false }), scheduleController.insertSchedule);
schedule.put("/edit/:id", authAdmin({ admin: true, director: false, coach: false, player: false, customer: false }), scheduleController.updateSchedule);
schedule.post("/remove", authAdmin({ admin: true, director: false, coach: false, player: false, customer: false }), scheduleController.deleteSchedule);


module.exports = schedule