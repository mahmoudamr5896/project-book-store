const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    books: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book' // Reference to the Book model
    }]
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
