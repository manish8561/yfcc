const config = require("config");
const Users = require("../models/Users");
const Gateway = require("../models/Gateways");



const gateway = {}


gateway.getAll = (req, res, next) => {
    Gateway.find().then(data => {
        if (data) {
            res.json({ data: data });
        }
        else {
            res.json({ error: "Empty Set" });
        }
    })
}

gateway.insert = (req, res, next) => {
    if (req.body) {
     //   console.log(req.body)
        let entry = new Gateway();
        entry.name = req.body.name;
        entry.endpoint = req.body.endpoint;
        entry.postVars = req.body.postVars;
        entry.rules = req.body.rules;

        entry.save().then(data => {
            res.json({ data: data });
        }).catch(err => {
            res.status(503).json({ err: err });
        });
    } else {
        res.status(503).json({ err: 'Not data found.' });
    }

}

gateway.update = (req, res, next) => {
    if (req.body) {
        const update = {
            name: req.body.name,
            status: req.body.status
        }, options = {
            upsert: false,
        };
        Gateway.updateOne(req.params.id, { $set: update }, options).then(data => {
            res.json({ data: data });
        }).catch(err => {
            res.status(503).json({ err: err });
        });
    } else {
        res.status(503).json({ err: 'Not data found.' });
    }

}

gateway.remove = (req, res, next) => {
    const id = req.body._id;

    Gateway.deleteOne({ _id: id }).then(
        data => res.send(data)
    ).catch(err => {
        console.log(err)
        res.send(err);
    })

}




gateway.addUserGateway = (req, res, next) => {
    const { _id, gatewayName, ...rest } = req.body

    let data = {
        gatewayName: gatewayName,
        priority: 1
    }
    Users.findByIdAndUpdate(
        _id,
        { $push: { "paymentGateways": data } },
        { safe: true, upsert: true },
        function (err, model) {
            console.log(err);
            // if (err) throw err;
            res.json({ data: model })
        }
    );
}

gateway.removeUserGateway = (req, res, next) => {
    const { _id, gatewayName, ...rest } = req.body
    Users.findByIdAndUpdate(
        _id,
        { $pull: { "paymentGateways" : { gatewayName : gatewayName }  } },
        { upsert: true, new: true },
        function (err, model) {
            // if (err) throw err;
            res.json({ data: model })
        }
    );
}

gateway.statusUpdate = (req, res, next) => {
    if (req.body) {
        const update = {
            status: req.body.status
        }, options = {
            upsert: false,
        };
        const _id = {
            _id: req.body._id
        }
        Gateway.updateOne(_id, { $set: update }, options).then(data => {
            res.json({ data: data });
        }).catch(err => {
            res.status(503).json({ err: err });
        });
    } else {
        res.status(503).json({ err: 'Not data found.' });
    }

}

module.exports = gateway