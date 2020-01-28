const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        default: 'Active'
    },
    products: {
        type: Object,
        required: true
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('wishlist', WishlistSchema);