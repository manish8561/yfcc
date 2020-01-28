const mongoose = require("mongoose");

const Wishlist = require("../models/Wishlists");

const wishlists = {};

wishlists.get = (req, res, next) => {
    const query = {}
    if (req.query.id) {
        query._id = mongoose.Types.ObjectId(req.query.id);
    }
    if (req.query.uid) {
        query.user = mongoose.Types.ObjectId(req.query.uid);
    }
    Wishlist.aggregate([{
        $match: query
    }, {
        $project: {
            user: 1,
            productId: { $toObjectId: "$products.productId" },
            products:1

        }
    },
    {
        $lookup: {
            from: 'products',
            localField: 'productId',
            foreignField: '_id',
            as: 'productdata'

        }
    }, {
        $project: {
            productdata: { $arrayElemAt: ["$productdata", 0] },
            wishlist_quantity:"$products.quantity"

        }
    }]).then(data => {
        if (data) {
            res.json({ data: data });
        } else {
            res.json({ error: "Empty Set" });
        }
    })
}
// update check and insert if not found.
wishlists.save = (req, res, next) => {
    if (req.body) {
        const { user, products, ...rest } = req.body;

        const options = {
            upsert: false,
            new: false
        };
        Wishlist.findOne({ user: mongoose.Types.ObjectId(user), 'products.productId': products.productId }).then(data => {

            if (data) {
                // data.products.quantity += products.quantity;

                const quantity = data.products.quantity + products.quantity;
                Wishlist.updateOne({ _id: data._id }, { $set: { 'products.quantity': quantity } }, options).then(d => {
                    console.log(d, 'test');
                    return res.json({ success: 'OK' });
                }).catch(err => console.log(err));
            } else {
                let record = new Wishlist();
                record.user = user;
                record.products = products;
                record.save().then(d => {
                    return res.json({ success: 'OK' });
                }).catch(next);
            }
        }).catch(next);
    } else {
        res.status(503).json({ err: 'Not data found.' });
    }
}

wishlists.remove = (req, res, next) => {
    const id = req.body.id;
    console.log(id,'test');
    Wishlist.deleteOne({ _id: id }).then(
        data => res.json({ success: 'OK' })
    ).catch(err => {
        console.log(err)
        res.json({ success: 'NOK' });
    });
}

module.exports = wishlists