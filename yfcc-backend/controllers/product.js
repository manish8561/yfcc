const mongoose = require('mongoose');
const Product = require("../models/Products");
const Wishlist = require("../models/Wishlists");


const config = require('config');
const fs = require('fs');

const products = {};

products.get = (req, res, next) => {
    Product.find({ status: 'Active' }).then(data => {
        if (data) {
            res.json({ data: data });
        } else {
            res.json({ error: "Empty Set" });
        }
    })
}
products.total = (req, res, next) => {
    Product.countDocuments().then(data => res.json({ data: data }));
}
products.getAll = (req, res, next) => {
    Product.find().then(data => {
        if (data) {
            res.json({ data: data });
        } else {
            res.json({ error: "Empty Set" });
        }
    })
}

products.getOne = (req, res, next) => {
    if (req.params.id) {
        Product.findOne({ _id: mongoose.Types.ObjectId(req.params.id) }).then(data => {
            if (data) {
                res.json({ data: data });
            } else {
                res.json({ error: "Empty Set" });
            }
        });
    } else {
        res.json({ error: "Empty Set" });
    }
}

products.add = (req, res, next) => {
    if (req.body) {
        const { name, description, price, quantity, image, ...rest } = req.body;

        let record = new Product();
        record.name = name;
        record.description = description || '';
        record.price = price || 0;
        record.quantity = quantity || 0;
        record.image = image || [];

        record.save().then(data => {
            res.json({ data: data });
        }).catch(err => {
            res.status(503).json({ err: err });
        });
    } else {
        res.status(503).json({ err: 'Not data found.' });
    }
}
products.edit = (req, res, next) => {
    if (req.body) {
        const { name, description, price, quantity, image, status, ...rest } = req.body;

        const query = { _id: req.params.id },
            options = { upsert: false, new: false },
            update = {
                name: name,
                description: description || '',
                price: price || 0,
                quantity: quantity || 0,
                image: image || [],
                status: status || 'Active'
            };

        Product.updateOne(query, update, options).then(data => {
            if (!data) {
                return res.json({ data: {} })
            }
            res.json({ success: 'OK' })
        }).catch(next);
    } else {
        res.status(503).json({ err: 'Not data found.' });
    }
}


products.remove = (req, res, next) => {
    //  console.log(req.body.id)
    const id = req.body.id;

    function removeFiles(images) {
        return new Promise((resolve, reject) => {
            const path = config.get('image_directory');

            try {
                images.forEach(ele => {
                    const f = path + ele.replace(config.get('image_web_path'), '');
                    console.log(f);
                    fs.unlinkSync(f);
                });
                resolve(true)
            } catch (err) {
                console.error(err)
                //  reject(err)
                resolve(true)
            }
        });
    }
    /* remove from wishlist of all users */
    function removeFromWishlist(id) {
        Wishlist.deleteMany({ 'products.productId': id })
            .then(data => console.log('delete wishlist', data))
            .catch(err => console.log(err));
    }

    Product.findOne({ _id: id }).then(async data => {
        await removeFiles(data.image);
        removeFromWishlist(id);
        data.delete().then(data => res.json({ success: 'OK' }))
            .catch(err => {
                console.log(err)

            });
    }).catch(err => {
        console.log(err)
        res.json({ error: err });
    });
}

products.uploadfile = (req, res, next) => {

    const files = req.files
    let op = [];
    // const web_path = config.get('image_web_path');
    // console.log('file upload', files);
    if (!files) {
        const error = new Error('Please choose files')
        error.httpStatusCode = 400
        return res.send(error);
    }
    files.forEach(e => {
        op = [...op, e.filename]
    })
    res.json({ data: op, files: files })
}

products.removeImage = (req, res, next) => {
    //  console.log(req.body.id)
    const { id, image, ...rest } = req.body;

    function removeFiles(image) {
        return new Promise((resolve, reject) => {
            const path = config.get('image_directory');

            try {
                const f = path + image;
                console.log(f);
                fs.unlinkSync(f);
                resolve(true)
            } catch (err) {
                console.error(err)
                reject(err)
                // resolve(true)
            }
        });
    }

    Product.findOne({ _id: id }).then(async data => {
        await removeFiles(image);
        data.image.map((ele, index) => {
            if (ele == image) {
                data.image.splice(index, 1);
            }
        });
        data.save().then(data => res.json({ success: 'OK' })).catch(next)

    }).catch(err => {
        console.log(err);
        res.json({ error: err });
    });
}


products.removeSingleImage = async (req, res, next) => {
    const { image, ...rest } = req.body;

    function removeFiles(image) {
        return new Promise((resolve, reject) => {
            const path = config.get("image_directory");

            try {
                const f = path + image;
                console.log(f);
                fs.unlinkSync(f);
                resolve(true);
            } catch (err) {
                console.error(err);
                resolve(false)
            }
        });
    }
    const a = await removeFiles(image);
    if (a) {
        return res.json({ success: 'OK' });
    } else {
        return res.json({ success: 'NOK' });
    }
}

module.exports = products