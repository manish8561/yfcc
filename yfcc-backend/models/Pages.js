const mongoose = require("mongoose");
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const PageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: { type: String, slug: "title", unique: true },
    description: {
        type: Array,
        default: []
    },
    image: {
        type: Array,
        default: []
    },
    status: {
        type: String,
        default: 'Active'
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('page', PageSchema);
