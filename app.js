//app.js
const express = require('express')
const book = require('./Router/books')
const Routeruser = require('./Router/user')
// app.set('view engine', 'ejs');
// app.set('views', __dirname + '/views');
const mongoose = require('mongoose');
//2) connect
mongoose.connect('mongodb://localhost:27017/bookstore', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
//4)



//_______________________________________
//3)create schema 
// const bookSchema = require('./models/books')
// bookSchema.find().then((data) =>{
//     console.log(data)
// })
// const User = require('./models/user')
// User.find().then((data) =>{
//     console.log(data)
// })
// //4) create model
// const newUser = new User({
//     name: 'john_doe',
//     email: 'john@example.com',
//     age: 23,
//   });
  
//   // Save the new user to the database
//   newUser.save()
//     .then((user) => {
//       console.log('User created:', user);
//     })
//     .catch((error) => {
//       console.error('Error creating user:', error);
//     });


// const Book = require('./models/books'); // Assuming the Book model is in a separate file
// const newBook = new Book({
//     title: 'The Great Gatsby',
//     image: 'path/to/image.jpg',
//     description: 'A novel by F. Scott Fitzgerald',
//     price: 12.99
// });

// // Save the new book to the database
// newBook.save()
//     .then((book) => {
//         console.log('Book created:', book);
//     })
//     .catch((error) => {
//         console.error('Error creating book:', error);
//     });
//3) crud opration 

