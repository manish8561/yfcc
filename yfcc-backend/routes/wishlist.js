const wishlist = require("express").Router();
const wishlistController = require("../controllers/wishlist");
const auth = require("../middlewares/auth")
const authAdmin = require("../middlewares/authAdmin");


wishlist.get("/getAll", wishlistController.get);
wishlist.post("/save", wishlistController.save);
wishlist.post("/remove", wishlistController.remove);

module.exports = wishlist