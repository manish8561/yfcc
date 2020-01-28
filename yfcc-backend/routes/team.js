const team = require("express").Router();
const teamController = require("../controllers/team");
// const auth = require("../middlewares/auth")
const authAdmin = require("../middlewares/authAdmin");

const config = require("config");
const path = require("path");

const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, config.get("team_directory"));
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

team.get("/get", teamController.get);

team.get("/total", authAdmin({ admin: true, director: false, coach: false, player: false, customer: false }), teamController.total);
team.get("/getAllAdmin", authAdmin({ admin: true, director: true, coach: true, player: false, customer: false }), teamController.getAllAdmin);

team.get("/get/:id", teamController.getOne);

team.post("/add", authAdmin({ admin: true, director: false, coach: false, player: false, customer: false }), teamController.add);

team.put("/edit/:id", authAdmin({ admin: true, director: false, coach: false, player: false, customer: false }), teamController.edit);

team.post("/remove", authAdmin({ admin: true, director: false, coach: false, player: false, customer: false }), teamController.remove);

team.post("/upload", upload.array("file", 12), teamController.uploadfile);

team.post("/remove", teamController.remove);

team.post("/removeImage", teamController.removeImage);

team.post("/removeSingle", teamController.removeSingleImage);


module.exports = team