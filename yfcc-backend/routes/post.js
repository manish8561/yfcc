const post = require("express").Router();
const postController = require("../controllers/post");

const config = require("config");
const path = require("path");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.get("post_directory"));
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

post.get("/getAll", postController.get);

post.get("/getAllAdmin", postController.getAll);

post.get("/get/:id", postController.getOne);

post.post("/add", postController.add);

post.put("/edit/:id", postController.edit);

post.post("/upload", upload.array("file", 12), postController.uploadfile);

post.post("/remove", postController.remove);

post.post("/removeImage", postController.removeImage);

post.post("/removeSingle", postController.removeSingleImage);

module.exports = post;
