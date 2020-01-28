const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const config = require("config");
const Users = require("../models/Users");

const Notifictaion = require("../models/Notifications");
const login = {

}
login.loginCheck = (req, res, next) => {

    const { email, password, device_token, ...rest } = req.body;
    // console.log(req.body);
    Users.findOne({ email: email, status: 'Active' }).then(udata => {
        if (udata) {
            bcrypt.compare(password, udata.password).then(data => {
                if (data) {
                    console.log(udata);
                    /* adding device_token */
                    if (device_token) {
                        const query = { device_token: device_token },
                            update = {
                                device_token: device_token,
                                user: udata._id,
                                status: 'registered',
                            }, options = {
                                upsert: true,
                                new: true,
                            };
                        Notifictaion.update(query, { $set: update }, options)
                            .then(data => console.log('device token added'))
                            .catch(err => console.log(err));

                    }
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
                        { expiresIn: (2 * 60 * 60) },
                        (err, token) => {
                            if (err) throw err;
                            res.json({ token })
                        }
                    )
                }
                else {
                    res.json({ error: "Password mismatch" })
                }
            })
        }
        else {
            res.json({ error: "Username Not found" });
        }
    });

}

login.validToken = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        res.json({ error: "Unauth" });
    }
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        res.json({ message: "valid" })
    }
    catch (err) {
        res.json({ error: err });
    }
}

module.exports = login
