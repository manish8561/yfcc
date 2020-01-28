const router = require("express").Router();

router.use("/user", require("./user"));
router.use("/schedule", require("./schedule"));
router.use("/category", require("./category"));
router.use("/login", require("./login"));
router.use("/gateway", require("./gateway"));
router.use("/pg", require("./paymentgateway"));
router.use("/ip", require("./ip"));
router.use("/payments", require("./payments"));
router.use("/product", require("./product"));
router.use("/order", require("./order"));
router.use("/address", require("./address"));
router.use("/wishlist", require("./wishlist"));
router.use("/post", require("./post"));
router.use("/page", require("./page"));
router.use("/team", require("./team"));
router.use("/match", require("./match"));

module.exports = router;
