const products = require("express").Router();
const productsController = require("../controllers/product");

const config = require('config');
const path = require('path');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, config.get('image_directory'))
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '_'))
    },
})

const upload = multer({
    storage: storage, fileFilter: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        // console.log(ext,'llllllllllll')
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return cb(new Error('Only images are allowed'))
        }
        cb(null, true)
    },
});

const authAdmin = require("../middlewares/authAdmin");
//const auth = require("../middlewares/auth");

products.get('/total', productsController.total);

products.get('/getAll', productsController.get);

products.get('/getAllAdmin', productsController.getAll);

products.get('/get/:id', productsController.getOne);

products.post('/add', productsController.add);

products.put('/edit/:id', productsController.edit);

products.post('/upload', upload.array('file', 12), productsController.uploadfile);

products.post('/remove', productsController.remove);

products.post('/removeImage', productsController.removeImage);

products.post("/removeSingle", productsController.removeSingleImage);

module.exports = products;