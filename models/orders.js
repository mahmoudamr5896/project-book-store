const mongoose = require('mongoose');

// Schema for Wishlist Item
const orederItemSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const orderItemt = mongoose.model('orderItemt', orederItemSchema);
module.exports =    orderItemt

