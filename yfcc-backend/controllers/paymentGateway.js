const mongoose = require('mongoose');
const Users = require("../models/Users");
const Gateways = require("../models/Gateways")
const Payments = require("../models/Payments")

var moment = require('moment-timezone');


const pg = {};

pg.getGateway = (req, res, next) => {

    const _id = req.params.id
    const { amount, ...rest } = req.body


    let epoch = Math.floor(new Date());
    //Add Prefix from user
    let orderId = _id.slice(14) + epoch.toString().slice(10)

    Users.aggregate([
        { $match: { '_id': mongoose.Types.ObjectId(_id) } },
        { $unwind: '$paymentGateways' },
        { $sort: { 'paymentGateways.priority': 1 } },
        {
            $lookup: {
                from: 'gateways',
                localField: 'paymentGateways.gatewayName',
                foreignField: 'name',
                as: 'gatewaydata'
            }
        },
        { $unwind: '$gatewaydata' },
        {
            $match: {
                'gatewaydata.status': 'Active',
                //'gatewaydata.rules.totalAmt': { $gte: 10000 },
                'gatewaydata.rules.maxAmt': { $gte: parseInt(amount) },
                'gatewaydata.rules.minAmt': { $lte: parseInt(amount) }
            }
        },
        { $limit: 1 },
        {
            $project: {
                endpoint: "$gatewaydata.endpoint",
                orderId: orderId,
                gatewayName: "$gatewaydata.name",
                prefix: 1,
                postVars: "$gatewaydata.postVars",
            }
        }
    ]).then(data => {
        data[0].orderId = data[0].prefix + orderId;
        res.json({ data: data });

    }).catch(next);
}



pg.paymentStatusUpdate = (req, res, next) => {
    const status = req.body.status
    const orderId = req.body.orderId
    Payments.findOneAndUpdate({ "orderId": orderId },
        {
            $set: {
                "status": status
            }
        },
        { new: true } // return updated post
    ).exec(function (error, post) {
        if (error) {
            return res.status(400).send({ msg: 'Update failed!' });
        }

        return res.status(200).send(post);
    });


}


pg.matchOdp = (req, res, next) => {
    const odp = req.body.odp
    const _id = req.body._id
    Users.findById({ _id: _id }).select('odp').then(data => {
        if (data.odp == odp) {
            res.json({ result: "success" })
        } else {
            res.json({ result: "failed" })
        }
    }).catch(err => {
        res.json({ error: err })
    })
}


pg.addOrder = (req, res, next) => {
    if (req.body) {
        const { uid, gatewayName, amount, orderId, name, ...rest } = req.body;
        let payment = new Payments();
        payment.uid = uid;
        payment.gatewayName = gatewayName;
        payment.amount = amount;
        payment.orderId = orderId;
        payment.customer.name = name;
        payment.request = rest;
        Object.assign(payment.timeZone, {
            EST: moment().tz("America/New_York").format(),
            PST: moment().tz("America/Los_Angeles").format(),
            IST: moment().tz("Asia/Kolkata").format(),
            CST: moment().tz("America/Chicago").format(),
        })
        payment.status = "Pending";
        //  console.log(payment, rest);

        payment.save().then(data => {
            res.json({ success: 'OK' });
        }).catch(next);
    }
}



module.exports = pg