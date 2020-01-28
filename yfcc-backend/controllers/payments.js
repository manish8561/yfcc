const mongoose = require('mongoose');
// const Users = require("../models/Users");
const Payments = require("../models/Payments")

const moment = require('moment-timezone');


const payments = {};

payments.getAll = (req, res, next) => {
    let aggreagateObj = [{ $match: {} },
    {
        $project: {
            uid: { $toObjectId: "$uid" },
            gatewayName: 1,
            orderId: 1,
            amount: 1,
            transactionId: 1,
            status: 1,
            response: 1,
            customer: 1,
            timeZone: 1,
        }
    }, {
        $lookup: {
            from: 'users',
            localField: 'uid',
            foreignField: "_id",
            as: 'userdata'
        }
    },
    {
        $project: {
            uid: 1,
            gatewayName: 1,
            orderId: 1,
            amount: 1,
            transactionId: 1,
            status: 1,
            response: 1,
            customer: 1,
            timeZone: 1,
            username: { $arrayElemAt: ["$userdata.name", 0] }
        }
    }, {
        $sort: { _id: -1 }
    }];
    Payments.aggregate(aggreagateObj).then(data => {
        res.json({ data: data });
    }).catch(next);
}
payments.getBuyerPayments = (req, res, next) => {
    const uid = req.params.uid;

    let aggreagateObj = [{ $match: { uid: uid } },
    {
        $project: {
            uid: { $toObjectId: "$uid" },
            gatewayName: 1,
            orderId: 1,
            amount: 1,
            transactionId: 1,
            status: 1,
            response: 1,
            customer: 1,
            timeZone: 1,
        }
    }, {
        $lookup: {
            from: 'users',
            localField: 'uid',
            foreignField: "_id",
            as: 'userdata'
        }
    },
    {
        $project: {
            uid: 1,
            gatewayName: 1,
            orderId: 1,
            amount: 1,
            transactionId: 1,
            status: 1,
            response: 1,
            customer: 1,
            timeZone: 1,
            username: { $arrayElemAt: ["$userdata.name", 0] }
        }
    }, {
        $sort: { _id: -1 }
    }];
    Payments.aggregate(aggreagateObj).then(data => {
        res.json({ data: data });
    }).catch(next);
}


payments.updateResponse = (req, res, next) => {
    // console.log(req.body);
    if (req.body) {
        const orderId = req.body.order_id;
        const update = {
            status: req.body.status,
            response: req.body.response,
        };
        Payments.findOneAndUpdate({ orderId: orderId }, { $set: update }, { upsert: false }).then(data => {
            res.json({ success: 'OK', uid: data.uid });
        }).catch(next);

    }
}


payments.testData = (req, res, next) => {
    //Random Numbers
    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    var elements = 27;
    var data1 = [];

    for (var i = 0; i <= elements; i++) {
        data1.push(random(50, 200));
    }

    function getCount(uid = '') {
        let query = { createdAt: { $gte: ISODate("2019-11-20T00:00:00.000Z"), $lt: ISODate("2019-11-20T00:00:00.000Z") } };
        if (uid != '') {
            query.uid = uid;
        }
        return new Promise((reslove, reject) => {
            Payments.countDocuments(query).then(data => {
                reslove(data)
            }).catch(reject(error))
        });
    }
    const a = getCount(); 
    return res.json({ data: a })
}


module.exports = payments