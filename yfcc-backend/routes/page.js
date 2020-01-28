const page = require("express").Router();
const pageController = require("../controllers/page");

const config = require("config");
const path = require("path");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.get("page_directory"));
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

const authAdmin = require("../middlewares/authAdmin");
//const auth = require("../middlewares/auth");

page.get("/getAll", pageController.get);

page.get("/getAllAdmin", pageController.getAll);

page.get("/get/:id", pageController.getOne);

page.post("/add", pageController.add);

page.put("/edit/:id", pageController.edit);

page.post("/upload", upload.array("file", 12), pageController.uploadfile);

page.post("/remove", pageController.remove);

page.post("/removeImage", pageController.removeImage);

page.post("/removeSingle", pageController.removeSingleImage);

module.exports = page;
