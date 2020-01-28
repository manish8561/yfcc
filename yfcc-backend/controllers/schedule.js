const mongoose = require("mongoose");
const Schedule = require("../models/Schedules");

const schedule = {};

schedule.get = (req, res, next) => {
    Schedule.find({}).populate('category')
        .then(data => {
            if (data) {
                res.json({ data: data });
            } else {
                res.json({ error: "Empty Set" });
            }
        });
};


schedule.getDetails = (req, res, next) => {
    if (req.params.id) {
        Schedule.findOne({ _id: mongoose.Types.ObjectId(req.params.id) }).then(data => {
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

schedule.insertSchedule = (req, res, next) => {
    if (req.body) {
        console.log(req.body);
        const { category, venue, location, days, startTime, endTime, status, ...rest } = req.body;

        let record = new Schedule();
        record.category = category;
        record.venue = venue || "N/A";
        record.location = location || "N/A";
        record.days = days || [];
        record.startTime = startTime || '';
        record.endTime = endTime || '';

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
};
schedule.updateSchedule = (req, res, next) => {
    if (req.body) {
        const { venue, location, days, startTime, endTime, status, ...rest } = req.body;

        const query = { _id: req.params.id },
            options = { upsert: false, new: false },
            update = {
                venue: venue || "N/A",
                location: location || "N/A",
                days: days || 0,
                startTime: startTime || 0,
                endTime: endTime || 0,
                status: status || "N/A"
            };

        Schedule.updateOne(query, update, options)
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

schedule.deleteSchedule = (req, res, next) => {
    const id = req.body.id;

    Schedule.findOne({ _id: id })
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


module.exports = schedule;
