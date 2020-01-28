const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true
    },
    total_quantity: {
        type: Number,
        default: 0
    },
    total_amount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: 'Pending'
    },
    products: {
        type: Array,
        default: [],
        required: true
    },
    addresses: {
        type: Array,
        default: [],
        required: true
    },
    payment_status: {
        type: String,
        default: 'Pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('order', OrderSchema);