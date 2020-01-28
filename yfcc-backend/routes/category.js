const category = require("express").Router();
const categoryController = require("../controllers/category");
// const auth = require("../middlewares/auth")
// const authAdmin = require("../middlewares/authAdmin");


category.get("/getAll", categoryController.get);
category.get("/get/:id", categoryController.getDetails);
category.post("/add", categoryController.insertCategory);
category.put("/edit/:id", categoryController.updateCategory);
category.post("/remove", categoryController.deleteCategory);


module.exports = category