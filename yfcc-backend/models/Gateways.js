const mongoose = require("mongoose");

const GatewaySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Active'
    },
    endpoint : {
        type: String
    },
    postVars : {
        type : Array,
        default : []
    },
    rules : {
       totalAmt : Number,
       maxAmt: Number,
       minAmt: Number
    },
    priority : {
        type: Number,
        default: 1
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('gateway', GatewaySchema);