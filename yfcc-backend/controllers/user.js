const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const { Expo } = require('expo-server-sdk');

const Users = require("../models/Users");
const Notifictaion = require("../models/Notifications");

const salt = bcrypt.genSaltSync(10);

const jwt = require("jsonwebtoken");
const config = require("config");
const fs = require("fs");

const users = {};

users.total = (req, res, next) => {
    Users.countDocuments({ role: { $ne: 'admin' } })
        .then(data => res.json({ data: data }));
}

users.get = (req, res, next) => {
    Users.find({ role: { $ne: 'admin' } })
        .populate('category')
        .populate('team').then(data => {
            if (data) {
                res.json({ data: data });
            }
            else {
                res.json({ error: "Empty Set" });
            }
        })
}

users.getDetails = (req, res, next) => {
    if (req.params.uid) {
        Users.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(req.params.uid) }
            }, {
                $lookup: {
                    from: 'addresses',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'userAddress'
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'userCategory'
                }
            },
            {
                $lookup: {
                    from: 'teams',
                    localField: 'team',
                    foreignField: '_id',
                    as: 'userTeam'
                }
            },
            {
                $lookup: {
                    from: 'schedules',
                    localField: 'category',
                    foreignField: 'category',
                    as: 'userSchedules'
                }
            }
        ]).then(data => res.json({ data: data }))
            .catch(next);
    } else {
        res.json({ error: "Empty Set" });
    }
}

users.insertUser = (req, res, next) => {
    if (req.body) {
        // console.log(req.body);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const ip = req.connection.remoteAddress.replace('::ffff:', '');

        let record = new Users();
        record.name = req.body.name || '';
        record.email = req.body.email;
        record.phone = req.body.email || '';
        record.password = hash;
        record.ip = ip;

        record.save().then(udata => {
            const payload = {
                user: {
                    uid: udata._id,
                    role: udata.role,
                    name: udata.name,
                    profile: udata.profile
                }
            }
            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: (12 * 60 * 60) },
                (err, token) => {
                    if (err) throw err;
                    return res.json({ token })
                }
            )

            //res.json({ data: data });
        }).catch(err => {
            console.log(err)
            res.status(503).json({ err: err.errmsg });
        });
    } else {
        res.status(503).json({ err: 'Not data found.' });
    }
}


users.add = (req, res, next) => {
    if (req.body) {
        // console.log(req.body);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const ip = req.connection.remoteAddress.replace('::ffff:', '');

        let record = new Users();
        record.name = req.body.name || '';
        record.email = req.body.email;
        record.password = hash;
        record.ip = ip;
        record.role = req.body.role;
        record.category = req.body.category;
        record.team = req.body.team;
        record.phone = req.body.phone || '';
        record.profile = req.body.profile || '';

        record.save().then(udata => {
            res.json({ data: udata });
        }).catch(err => {
            console.log(err)
            res.status(503).json({ err: err.errmsg });
        });
    } else {
        res.status(503).json({ err: 'Not data found.' });
    }
}


users.updateUser = (req, res, next) => {
    if (req.body) {
        // console.log(req.body);
        // const hash = bcrypt.hashSync(req.body.password, salt);

        const update = {
            name: req.body.name,
            phone: req.body.phone,
            status: req.body.status,
            role: req.body.role,
            category: req.body.category,
            team: req.body.team,
            profile: req.body.profile,
        }, options = {
            upsert: false,
        };
        if (req.body.password) {
            const hash = bcrypt.hashSync(req.body.password, salt);
            update.password = hash;
        }
        Users.updateOne({ _id: req.params.id }, { $set: update }, options).then(data => {
            res.json({ success: 'OK' });
        }).catch(err => {
            res.status(503).json({ err: err });
        });
    } else {
        res.status(503).json({ err: 'Not data found.' });
    }
}
users.updateProfile = (req, res, next) => {
    if (req.body) {

        const update = {
            name: req.body.name,
            phone: req.body.phone,
            //  profile: req.body.profile,
        }, options = {
            upsert: false,
        };
        if (req.body.password) {
            const hash = bcrypt.hashSync(req.body.password, salt);
            update.password = hash;
        }
        Users.updateOne({ _id: req.params.id }, { $set: update }, options).then(data => {
            res.json({ success: 'OK' });
        }).catch(err => {
            res.status(503).json({ err: err });
        });
    } else {
        res.status(503).json({ err: 'Not data found.' });
    }
}
users.updateStat = (req, res, next) => {
    if (req.body) {
        // console.log(req.body);
        // const hash = bcrypt.hashSync(req.body.password, salt);

        const update = {
            stats: req.body.stats,
        }, options = {
            upsert: false,
        };
        if (req.body.password) {
            const hash = bcrypt.hashSync(req.body.password, salt);
            update.password = hash;
        }
        Users.updateOne({ _id: req.params.id }, { $set: update }, options).then(data => {
            res.json({ success: 'OK' });
        }).catch(err => {
            res.status(503).json({ err: err });
        });
    } else {
        res.status(503).json({ err: 'Not data found.' });
    }
}


users.deleteUser = (req, res, next) => {
    // console.log(req.body);
    const id = req.body.id;
    function removeFiles(image) {
        return new Promise((resolve, reject) => {
            const path = config.get("profile_directory");

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
    Users.findOne({ _id: id }).then(data => {
        const a = removeFiles(data.profile);
        data.delete().then(d => res.json({ success: 'OK' }));
    }).catch(err => {
        console.log(err)
        res.send(err);
    })
}

users.getRole = (req, res, next) => {
    const _id = req.uid
    Users.findById(_id).then(data => {
        res.json({ role: data.role })
    })
}


users.getOdp = (req, res, next) => {
    const _id = req.body._id;
    Users.findById(_id).then(data => {
        res.json({ odp: data.odp })
    })

}

users.getAllowedGateways = (req, res, next) => {
    let id = req.uid
    if (req.role == 'admin') {
        id = req.params.id
    } else {
        id = req.uid
    }

    Users.findById(id).select('paymentGateways').then(data => {
        res.json({ data: data })
    }).catch(err => {
        res.json({ error: err })
    })
}

users.sendNotification = (req, res, next) => {


    // Create a new Expo SDK client
    let expo = new Expo();
    let messages = [];
    Notifictaion.find().then(somePushTokens => {



        for (let d of somePushTokens) {
            // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

            // Check that all your push tokens appear to be valid Expo push tokens
            let pushToken = d.device_token;
            if (!Expo.isExpoPushToken(pushToken)) {
                console.error(`Push token ${pushToken} is not a valid Expo push token`);
                continue;
            }


            // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)
            messages.push({
                to: pushToken,
                sound: 'default',
                title: 'Test Notification..',
                body: 'Test message  ' + (new Date).toUTCString(),
                data: { withSome: 'data' },
                badge: 2,
                icon: '../uploads/1576232704912-289b64ff-1a01-4b81-999f-4b8e050165b3.jpg'
            });
        }

        let chunks = expo.chunkPushNotifications(messages);
        let tickets = [];
        (async () => {
            // Send the chunks to the Expo push notification service. There are
            // different strategies you could use. A simple one is to send one chunk at a
            // time, which nicely spreads the load out over time:
            for (let chunk of chunks) {
                try {
                    let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                    console.log(ticketChunk);
                    tickets.push(...ticketChunk);
                    // NOTE: If a ticket contains an error code in ticket.details.error, you
                    // must handle it appropriately. The error codes are listed in the Expo
                    // documentation:
                    // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
                } catch (error) {
                    console.error(error);
                }
            }
        })();
        res.json({ success: 'OK' });
    }).catch(next);


}



users.deviceToken = (req, res, next) => {
    if (req.body) {
        const query = { device_token: req.body.device_token },
            update = {
                device_token: req.body.device_token,
                user: req.body.user || '',
                status: req.body.status || 'not_regiestered',
            }, options = {
                upsert: true,
                new: true,
            };
        Notifictaion.update(query, { $set: update }, options)
            .then(data => res.json({ success: 'OK' }))
            .catch(err => console.log(err));

    } else {
        res.status(503).json({ err: 'Not data found.' });
    }
}

users.uploadfile = (req, res, next) => {
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


users.removeSingleImage = async (req, res, next) => {
    const { image, ...rest } = req.body;

    function removeFiles(image) {
        return new Promise((resolve, reject) => {
            const path = config.get("profile_directory");

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


users.removeImage = (req, res, next) => {
    //  console.log(req.body.id)
    const { id, image, ...rest } = req.body;

    function removeFiles(image) {
        return new Promise((resolve, reject) => {
            const path = config.get("profile_directory");

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

    Users.findOne({ _id: id })
        .then(async data => {
            await removeFiles(image);
            data.profile = '';
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



module.exports = users
