const mongoose = require("mongoose");
const Category = require("../models/Categories");
// const Wishlist = require("../models/Wishlists");

const config = require("config");
const fs = require("fs");

const category = {};

category.get = (req, res, next) => {
    Category.find({ status: "Active" }).then(data => {
        if (data) {
            res.json({ data: data });
        } else {
            res.json({ error: "Empty Set" });
        }
    });
};

category.getDetails = (req, res, next) => {
    if (req.params.id) {
        Category.findOne({ _id: req.params.id }).then(data => {
            if (data) {
                res.json({ data: data });
            } else {
                res.json({ error: "Empty Set" });
            }
        });
    } else {
        res.json({ error: "Empty Set" });
    }
};

category.insertCategory = (req, res, next) => {
    if (req.body) {
        const { name, description, status, ...rest } = req.body;

        let record = new Category();
        record.name = name;
        record.description = description || "";

        record
            .save()
            .then(data => {
                res.json({ data: data });
            })
            .catch(err => {
                res.status(503).json({ err: err });
            });
    } else {
        res.status(503).json({ err: "Not data found." });
    }
};
category.updateCategory = (req, res, next) => {
    if (req.body) {
        const { name, description, status, ...rest } = req.body;

        const query = { _id: req.params.id },
            options = { upsert: false, new: false },
            update = {
                name: name,
                description: description || "",
                status: status || 'Inactive'
            };

        Category.updateOne(query, update, options)
            .then(data => {
                if (!data) {
                    return res.json({ data: {} });
                }
                res.json({ success: "OK" });
            })
            .catch(next);
    } else {
        res.status(503).json({ err: "Not data found." });
    }
};

category.deleteCategory = (req, res, next) => {
    const id = req.body.id;

    Category.findOne({ _id: id })
        .then(async data => {
            data
                .delete()
                .then(data => res.json({ success: "OK" }))
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err => {
            console.log(err);
            res.json({ error: err });
        });
};


module.exports = category;
