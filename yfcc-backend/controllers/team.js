const mongoose = require('mongoose');
const Teams = require("../models/Teams");

const config = require("config");
const fs = require("fs");

const teams = {};

teams.get = (req, res, next) => {
    Teams.find({ status: 'Active' }).populate('category').then(data => {
        if (data) {
            res.json({ data: data });
        }
        else {
            res.json({ error: "Empty Set" });
        }
    })
}
/* total Teams */
teams.total = (req, res, next) => {
    Teams.countDocuments({}).then(data => res.json({ data: data }));
}

teams.getAllAdmin = (req, res, next) => {
    Teams.find({}).populate('category').then(data => {
        if (data) {
            res.json({ data: data });
        }
        else {
            res.json({ error: "Empty Set" });
        }
    })
}

teams.getOne = (req, res, next) => {
    if (req.params.id) {
        Teams.findOne({ _id: req.params.id }).then(data => res.json({ data: data }))
            .catch(next);
    } else {
        res.json({ error: "Empty Set" });
    }
}

teams.add = (req, res, next) => {
    if (req.body) {

        let record = new Teams();
        record.name = req.body.name || '';
        record.description = req.body.description;
        record.category = req.body.category;
        record.logo = req.body.logo;
        record.save().then(data => {
            res.json({ data: data });
        }).catch(err => {
            console.log(err)
            res.status(503).json({ err: err.errmsg });
        });
    } else {
        res.status(503).json({ err: 'Not data found.' });
    }
}


teams.edit = (req, res, next) => {
    if (req.body) {

        const update = {
            name: req.body.name,
            description: req.body.description,
            status: req.body.status,
            category: req.body.category,
            logo: req.body.logo,
        }, options = {
            upsert: false,
        };

        Teams.updateOne({ _id: req.params.id }, { $set: update }, options).then(data => {
            res.json({ success: 'OK' });
        }).catch(err => {
            res.status(503).json({ err: err });
        });
    } else {
        res.status(503).json({ err: 'Not data found.' });
    }
}

teams.remove = (req, res, next) => {
    // console.log(req.body);
    const id = req.body.id;
    function removeFiles(image) {
        return new Promise((resolve, reject) => {
            const path = config.get("team_directory");

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
    Teams.findOne({ _id: id }).then(async data => {
        const a = await removeFiles(data.logo);
        data.delete().then(d => res.json({ success: 'OK' })).catch(next);
    }).catch(err => {
        console.log(err)
        res.send(err);
    })
}


teams.uploadfile = (req, res, next) => {
    const files = req.files;
    let op = [];

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

teams.removeImage = (req, res, next) => {
    //  console.log(req.body.id)
    const { id, image, ...rest } = req.body;

    function removeFiles(image) {
        return new Promise((resolve, reject) => {
            const path = config.get("team_directory");

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

    Teams.findOne({ _id: id })
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

teams.removeSingleImage = async (req, res, next) => {
    const { image, ...rest } = req.body;

    function removeFiles(image) {
        return new Promise((resolve, reject) => {
            const path = config.get("team_directory");

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


module.exports = teams;