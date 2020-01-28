const mongoose = require("mongoose");
const Page = require("../models/Pages");

const config = require("config");
const fs = require("fs");

const pages = {};

pages.get = (req, res, next) => {
    Page.find({ status: "Active" }).then(data => {
        if (data) {
            res.json({ data: data });
        } else {
            res.json({ error: "Empty Set" });
        }
    });
}
pages.getAll = (req, res, next) => {
    Page.find({}).then(data => {
        if (data) {
            res.json({ data: data });
        } else {
            res.json({ error: "Empty Set" });
        }
    });
}

pages.getOne = (req, res, next) => {
    if (req.params.id) {
        Page.findOne({ _id: mongoose.Types.ObjectId(req.params.id) }).then(data => {
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

pages.add = (req, res, next) => {
    if (req.body) {
        const { title, description, price, quantity, image, ...rest } = req.body;

        let record = new Page();
        record.title = title;
        record.description = description || "";
        record.image = image || [];

        record.save()
            .then(data => {
                res.json({ data: data });
            })
            .catch(err => {
                res.status(503).json({ err: err });
            });
    } else {
        res.status(503).json({ err: "Not data found." });
    }
}
pages.edit = (req, res, next) => {
    if (req.body) {
        const { title, description, status, image, ...rest } = req.body;

        const query = { _id: req.params.id },
            options = { upsert: false, new: false },
            update = {
                title: title,
                description: description || "",
                status: status,
                image: image || []
            };

        Page.updateOne(query, update, options)
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
}

pages.remove = (req, res, next) => {
    //  console.log(req.body.id)
    const id = req.body.id;

    function removeFiles(images) {
        return new Promise((resolve, reject) => {
            const path = config.get("page_directory");

            try {
                images.forEach(ele => {
                    const f = path + ele;
                    console.log(f);
                    fs.unlinkSync(f);
                });
                resolve(true);
            } catch (err) {
                console.error(err);
                //  reject(err)
                resolve(true);
            }
        });
    }

    Page.findOne({ _id: id })
        .then(async data => {
            await removeFiles(data.image);
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
}

pages.uploadfile = (req, res, next) => {
    const files = req.files;
    let op = [];
    // console.log('file upload', files);
    if (!files) {
        const error = new Error("Please choose files");
        error.httpStatusCode = 400;
        return res.send(error);
    }
    files.forEach(e => {
        op = [...op, e.filename];
    });
    res.json({ data: op, files: files });
}

pages.removeImage = (req, res, next) => {
    //  console.log(req.body.id)
    const { id, image, ...rest } = req.body;

    function removeFiles(image) {
        return new Promise((resolve, reject) => {
            const path = config.get("page_directory");

            try {
                const f = path + image;
                console.log(f);
                fs.unlinkSync(f);
                resolve(true);
            } catch (err) {
                console.error(err);
                reject(err);
                // resolve(true)
            }
        });
    }

    Page.findOne({ _id: id })
        .then(async data => {
            await removeFiles(image);
            data.image.map((ele, index) => {
                if (ele == image) {
                    data.image.splice(index, 1);
                }
            });
            data
                .save()
                .then(data => res.json({ success: "OK" }))
                .catch(next);
        })
        .catch(err => {
            console.log(err);
            res.json({ error: err });
        });
}

pages.removeSingleImage = async (req, res, next) => {
    const { image, ...rest } = req.body;

    function removeFiles(image) {
        return new Promise((resolve, reject) => {
            const path = config.get("page_directory");

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

module.exports = pages;
