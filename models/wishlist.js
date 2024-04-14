const mongoose = require('mongoose');

// Schema for Wishlist Item
const wishlistItemSchema = new mongoose.Schema({
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

const WishlistItem = mongoose.model('WishlistItem', wishlistItemSchema);
module.exports =    WishlistItem

