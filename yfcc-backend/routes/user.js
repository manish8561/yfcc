const user = require("express").Router();
const userController = require("../controllers/user");
const auth = require("../middlewares/auth")
const authAdmin = require("../middlewares/authAdmin");


const config = require("config");
const path = require("path");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.get("profile_directory"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, '_'));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    // console.log(ext,'llllllllllll')
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
      return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
  }
});


user.get("/total", authAdmin({ admin: true, director: false, coach: false, player: false, customer: false }), userController.total);

user.get("/get", authAdmin({ admin: true, director: false, coach: false, player: false, customer: false }), userController.get);

user.get("/details/:uid", userController.getDetails);
//user.post("/insertUser", authAdmin, userController.insertUser);
/* signup request */
user.post("/insertUser", userController.insertUser);

user.post("/add", authAdmin({ admin: true, director: false, coach: false, player: false, customer: false }), userController.add);

user.put("/edit/:id", authAdmin({ admin: true, director: false, coach: false, player: false, customer: false }), userController.updateUser);

user.put("/updateProfile/:id", authAdmin({ admin: true, director: true, coach: true, player: true, customer: true }), userController.updateProfile);

user.put("/stat/:id", authAdmin({ admin: true, director: false, coach: false, player: false, customer: false }), userController.updateStat);

user.post("/remove", authAdmin({ admin: true, director: false, coach: false, player: false, customer: false }), userController.deleteUser);


user.post("/odpUser", userController.getOdp);


user.get("/notification", userController.sendNotification);

user.post("/device_token", userController.deviceToken);
//PAYMENT GATEWAY GAME

user.get("/allowedGateways/:id", auth, userController.getAllowedGateways)

user.get("/getRole", auth, userController.getRole);

user.post("/upload", upload.array("file", 12), userController.uploadfile);

user.post("/removeSingle", userController.removeSingleImage);

user.post("/removeImage", userController.removeImage);

module.exports = user