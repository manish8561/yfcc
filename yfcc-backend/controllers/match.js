const mongoose = require('mongoose');
const Matches = require("../models/Matches");


const routers = {};

routers.total = (req, res, next) => {
    Matches.countDocuments({}).then(data => res.json({ data: data }));
}

routers.get = (req, res, next) => {
    Matches.find({}).populate('teamA').populate('teamB').then(data => {
        if (data) {
            res.json({ data: data });
        }
        else {
            res.json({ error: "Empty Set" });
        }
    })
}
routers.getAllAdmin = (req, res, next) => {
    Matches.find({}).populate('teamA').populate('teamB').then(data => {
        if (data) {
            res.json({ data: data });
        }
        else {
            res.json({ error: "Empty Set" });
        }
    })
}

routers.getOne = (req, res, next) => {
    if (req.params.id) {
        Matches.findOne({ _id: req.params.id }).then(data => res.json({ data: data }))
            .catch(next);
    } else {
        res.json({ error: "Empty Set" });
    }
}

routers.add = (req, res, next) => {
    if (req.body) {

        let record = new Matches();
        record.teamA = req.body.teamA;
        record.teamB = req.body.teamB;
        record.venue = req.body.venue || '';
        record.schedule_date = req.body.schedule_date;
        record.schedule_time = req.body.schedule_time;
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


routers.edit = (req, res, next) => {
    if (req.body) {

        const update = {
            teamA: req.body.teamA,
            teamB: req.body.teamB,
            teamA_goals: req.body.teamA_goals,
            teamB_goals: req.body.teamB_goals,
            schedule_date: req.body.schedule_date,
            schedule_time: req.body.schedule_time,
            status: req.body.status,
            venue: req.body.venue,
            remark: req.body.remark,
        }, options = {
            upsert: false,
        };

        Matches.updateOne({ _id: req.params.id }, { $set: update }, options).then(data => {
            res.json({ success: 'OK' });
        }).catch(err => {
            res.status(503).json({ err: err });
        });
    } else {
        res.status(503).json({ err: 'Not data found.' });
    }
}

routers.remove = (req, res, next) => {
    // console.log(req.body);
    const id = req.body.id;

    Matches.deleteOne({ _id: id }).then(data => res.json({ success: 'OK' }))
        .catch(err => {
            console.log(err)
            res.send(err);
        })
}

module.exports = routers;