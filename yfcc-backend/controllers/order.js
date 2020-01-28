const mongoose = require("mongoose");

const Order = require("../models/Orders");

const moment = require('moment');

const orders = {};

orders.get = (req, res, next) => {
    const query = {};
    if (req.query.order_id) {
        query._id = mongoose.Types.ObjectId(req.query.order_id);
    }
    if (req.query.uid) {
        query.uid = req.query.uid;
    }
    Order.aggregate([
        {
            $match: query
        }, {
            $project: {
                "total_quantity": 1,
                "total_amount": 1,
                "status": 1,
                "products": 1,
                "addresses": 1,
                "payment_status": 1,
                "uid": { $toObjectId: '$uid' },
                "createdAt": 1,
                "updatedAt": 1
            }

        }, {
            $lookup: {
                from: 'users',
                localField: 'uid',
                foreignField: '_id',
                as: 'userdata'
            }
        },
        {
            $project: {
                "total_quantity": 1,
                "total_amount": 1,
                "status": 1,
                "products": 1,
                "addresses": 1,
                "payment_status": 1,
                "userdata": { $arrayElemAt: ['$userdata', 0] },
                "createdAt": 1,
                "updatedAt": 1
            }

        }
    ]).then(data => {
        if (data) {
            res.json({ data: data });
        } else {
            res.json({ error: "Empty Set" });
        }
    }).catch(err => console.log(err));

}

orders.getOne = (req, res, next) => {
    const query = {};

    if (req.query.order_id) {
        query._id = mongoose.Types.ObjectId(req.query.order_id);
    }

    Order.findOne(query).then(data => {
        if (data) {
            res.json({ data: data });
        } else {
            res.json({ error: "Empty Set" });
        }
    })
}

orders.add = (req, res, next) => {
    if (req.body) {
        const { uid, total_quantity, total_amount, products, addresses, ...rest } = req.body;

        let record = new Order();
        record.uid = uid;
        record.total_amount = total_amount || 0;
        record.total_quantity = total_quantity || 0;
        record.products = products;
        record.addresses = addresses;

        record.save().then(data => {
            res.json({ data: data });
        }).catch(err => {
            res.status(503).json({ err: err });
        });
    } else {
        res.status(503).json({ err: 'Not data found.' });
    }

}


orders.remove = (req, res, next) => {
    console.log(req.body._id)
    const id = req.body._id;

    Order.deleteOne({ _id: id }).then(
        data => res.send(data)
    ).catch(err => {
        console.log(err)
        res.send(err);
    })
}

orders.chartData = (req, res, next) => {

    let elements = 30;
    let cal_type = 'month'
    if (req.body.type == 'week') {
        elements = 7;
        cal_type = 'week';
    } else if (req.body.type == 'month') {
        elements = 30;
        cal_type = 'month';
    } else if (req.body.type == 'year') {
        elements = 365;
        cal_type = 'year';
    } else {
        elements = 30;
        cal_type = 'month';
    }

    const weekStart = moment().startOf(cal_type);
    const days = [];
    let labeldays = [];
    for (let i = 0; i <= elements; i++) {
        days.push(moment(weekStart).add(i, 'days'));
    }


    allpromisedata = days.map(async ele => {
        labeldays = [...labeldays, ele.format("YYYY-MM-DD")];
        return await getCount(ele);
    });

    function getCount(querydate) {
        let query = {};
        // createdAt: { $gte: new Date(querydate.format("YYYY-MM-DDT00:00:00")), $lte: new Date(querydate.format("YYYY-MM-DDT23:59:59")) } 
        if (req.body.uid) {
            query.uid = req.body.uid;
        }

        query = { createdAt: { $gte: new Date(querydate.format("YYYY-MM-DDT00:00:00")), $lte: new Date(querydate.format("YYYY-MM-DDT23:59:59")) } };
        return new Promise((reslove, reject) => {
            const aggreagateObj = [
                { $match: query },
                {
                    $project: {
                        uid: { $toObjectId: "$uid" },
                        status: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        total_quantity: 1,
                        total_amount: 1,
                        products: 1,
                        addresses: 1,
                        payment_status: 1
                    }
                },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 },
                        total: { $sum: "$total_amount" },
                        success: { $sum: { $cond: [{ $eq: ["$status", 'Complete'] }, '$total_amount', 0] } }
                    }
                }
            ];

            Order.aggregate(aggreagateObj).then(data => {
                if (data[0] === undefined) {
                    return reslove([
                        {
                            "_id": null,
                            "count": 0,
                            "total": 0,
                            "success": 0
                        }
                    ]);
                }
                reslove(data)
            }).catch(error => reject(error))
        });
    }

    Promise.all(allpromisedata).then(data => {
        res.json({ data: data, days: labeldays });
    }).catch(e => console.log(e, 'all promise'))

}


module.exports = orders