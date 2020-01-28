const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true
    },
    gatewayName: {
        type: String
    },
    orderId: {
        type: String
    },
    amount: {
        type: Number
    },
    transactionId: {
        type: String
    },
    status: {
        type: String,
        default:'Pending'
    },
    request: { type: Object, default: null },
    response: { type: Object, default: null },
    customer :{
        name : String,
    },
    timeZone: {
        EST: String,
        PST: String,
        IST: String,
        CST: String,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('payment', PaymentSchema);