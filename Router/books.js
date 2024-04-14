const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const OrderItem = require('../models/orders');
const WishlistItem = require('../models/wishlist');

// Configure express-session middleware

const path = require('path');
const books = require('../models/books');
const Category = require('../models/Category');
const User = require('../models/user');
const app = express();
app.use(session({
  secret: 'your-secret-key', // Replace with a random string for session encryption
  resave: false,
  saveUninitialized: false
}));
app.set('view engine', 'ejs');

app.use('/users', require('./user'));

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static('uploads'));

app.set('../views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Crud Opration 
//1)Create Book
const multer = require('multer');

// Set up Multer storage for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/') // Specify the directory where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname) // Specify the filename format
    }
});

// Set up multer middleware
const upload = multer({ storage: storage });

// POST route for adding a new book
app.post('/home', upload.single('image'), async (req, res) => {
    try {
        // Create a new book object based on the form data
        const newBook = new books({
            title: req.body.title,
            image: '/uploads/' + req.file.filename, // Access the uploaded file's filename
            description: req.body.description,
            price: req.body.price
        });

        // Save the new book to the database
        await newBook.save();
        res.redirect('/create'); // Redirect to a page displaying all books
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
});

// create Category 
// Define a route to handle the creation of a new category
app.post('/category', async (req, res) => {
  try {
      // Extract the new category name from the request body
      const newCategoryName = req.body.newCategory;

      // Create a new category document using the Category model
      const newCategory = new Category({
          name: newCategoryName
      });

      // Save the new category to the database
      await newCategory.save();

      // Redirect the user to the /create route after successfully creating the category
      res.redirect('/create');
  } catch (error) {
      // Handle any errors that occur during the category creation process
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
  }
});



//2)Delete BOOK
// Route to handle deleting a book
app.delete('/books/:id', async (req, res) => {
  const { id } = req.params;

  try {
      const deletedBook = await books.findByIdAndDelete(id);
      res.json(deletedBook);
  } catch (err) {
      res.status(400).json({ message: err.message });
  }
});

//3)GET bOOK
// app.get('/book/:id', (req, res) => {
//     // const id = parseInt(req.params.id);
//     const book = books.find(book => book.id === id);
//     if (!book) {
//         res.status(404).json({ error: 'Book not found' });
//     } else {
//         res.json(book);
//     }
// });
app.get('/books/:id', (req, res) => {
  // Handle the request to retrieve a specific book by ID
  const bookId = req.params.id;
  // Fetch the book from the database based on the ID and send the response
  books.findById(bookId).then((data) =>{
    res.render('bookdetail', { book: data });
  
  })
  // res.render(`bookdetail`,);
});


//4)







app.get('/search', (req, res) => {
  const { title } = req.query;
  // Assuming you have a Book model and want to filter by title
  books.find({ title: { $regex: new RegExp(title, 'i') } })
    .then((book) => {
      console.log(book)
      res.render('searchResults', { book });
    })
    .catch((err) => {
      console.error('Error:', err);
      res.status(500).send('Internal Server Error');
    });
});





































app.get('/', (req, res) => {
  books.find().then((data) =>{
  res.render('home', { books: data });

})
});

app.get('/create', async (req, res) => {
  try {
      // Query both the books and Category collections asynchronously
      const booksData = await books.find();
      const categoriesData = await Category.find();
      const users = await User.find();
      const Orders = await OrderItem.find().populate({ path: 'user', select: 'username' }).populate('book');
      const wishlist = await WishlistItem.find().populate({ path: 'user', select: 'username' }).populate('book');
      
      
      // Render the view with data from both collections
      res.render('Ceatebook', { 
        books: booksData,
        categories: categoriesData,
        users:users,
        Orders:Orders,
        wishlist:wishlist
       });
  } catch (error) {
      // Handle any errors that occur during the query or rendering process
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
  }
});


app.get('/api/books/', (req, res) => {
    res.json(books);
});


app.get('/bookstore',(req,res)=>{
  books.find().then((data) =>{
      res.render('bookdetail', { books: data });

  })

})
// Assuming you're using Express and Mongoose


app.put('/books/:id', async (req, res) => {
  const { id } = req.params;
  const { title, author, description, price } = req.body;

  try {
      const updatedBook = await books.findByIdAndUpdate(id, { title, author, description, price }, { new: true });
      res.json(updatedBook);
      
  } catch (err) {
      res.status(400).json({ message: err.message });
  }
});


// app.get('/bookstore.html',(req, res) => {
//     const { title, author, genre, publicationYear } = req.query;
//     const id = books.length + 1;
//     const newBook = { id, title, author, genre, publicationYear };
//     console.log(newBook)
//     books.push(newBook);
//     res.json(newBook);
// });
//_____________________________________________________________
//______________________________________________________________

// Login page
app.get('/login', (req, res) => {
  res.render('login'); // Render the login page view
});


app.get('/profile/:id', async (req, res) => {
  const id = req.params.id;
  try {
    // Fetch wishlist items for the logged-in user
    const wishlistItems = await WishlistItem.find({ user: req.session.userId }).populate('book');
    
    // Fetch orders for the logged-in user
    const orders = await orderItemt.find({ user: req.session.userId }).populate('book');

    // Fetch the user based on the provided ID
    const user = await User.findById(id);

    if (!user) {
      // Handle case where user is not found
      return res.status(404).send('User not found');
    }

    // Render the profile page with user data, wishlist items, and orders
    res.render('Userprofile', { user, wishlistItems, orders });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Registration page
app.get('/register', (req, res) => {
  res.render('register'); // Render the registration page view
});
// Login form submission

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log(req.body)
      // Find the user in the database based on the provided email
      const user = await User.findOne({ email });
      if (!user) {
          // If user does not exist, render login page with error message
          return res.render('login', { error: 'Invalid email or password' });
      }

      // Compare the provided password with the hashed password stored in the database
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        req.session.userId = user._id;
        res.redirect(`/profile/${user._id}`);
      const secretKey = 'secret-key-jwt-mahmoud-bookstore'; // Replace 'your-secret-key' with your actual secret key
      const options = {
        expiresIn: '24h', // Token expiration time
      };
      // Generate Token 
      const token = jwt.sign({User_id : user._id}, secretKey, options);
      console.log(token)
      } else {
          // If passwords do not match, render login page with error message
          res.render('login', { error: 'Invalid email or password' });
      }
  } catch (error) {
      // Handle any errors that occur during the login process
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
  }
});

const jwt = require('jsonwebtoken');
const orderItemt = require('../models/orders');

// Registration form submission
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
        console.log(req.body)
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.render('register', { error: 'Email already exists' });
      }
       
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({
          username,
          email,
          password: hashedPassword
      });

      // Save the new user to the database
      await newUser.save();
      const secretKey = 'secret-key-jwt-mahmoud-bookstore'; // Replace 'your-secret-key' with your actual secret key
      const options = {
        expiresIn: '24h', // Token expiration time
      };
      // Generate Token 
      const token = jwt.sign({User_id : newUser._id}, secretKey, options);
      res.redirect('/login'); // Redirect to login page upon successful registration
      console.log(token)
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});

//wishlist and ordders 

// Route handler for adding item to order
// app.post('', async (req, res) => {
//   try {
//     const { bookId, quantity } = req.body;
//     const userId = req.session.userId; // Assuming you have the userId in the session

//     console.log('User ID:', userId); // Log the userId

//     // Find user by ID
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Create order item
//     const orderItem = {
//       book: bookId,
//       quantity: quantity || 1 // Assuming default quantity is 1
//     };

//     // Add order item to user's orders array
//     user.orders.push(orderItem);
    
//     // Save user
//     await user.save();

//     res.status(200).json({ message: 'Item added to order successfully' });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

app.post('/orders/add', async (req, res) => {
  try {
    const { bookId } = req.query; // Extract bookId from the query string
    const userId = req.session.userId; // Assuming you have the userId in the session

    console.log(bookId);
    console.log(userId);

    // Check if bookId is provided
    if (!bookId) {
      return res.status(400).json({ error: 'Book ID is required' });
    }

    // Create order item
    const orderItem = new OrderItem({
      book: bookId,
      user: userId
    });

    console.log(orderItem);

    // Save order item
    await orderItem.save();
    res.status(200).json({ message: 'Item added to orders successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Route handler for adding item to wishlist

app.post('/wishlist/add', async (req, res) => {
  try {
    const { bookId } = req.query; // Extract bookId from the query string
    const userId = req.session.userId; // Assuming you have the userId in the session

    console.log(bookId);
    console.log(userId);

    // Check if bookId is provided
    if (!bookId) {
      return res.status(400).json({ error: 'Book ID is required' });
    }

    // Create wishlist item
    const wishlistItem = new WishlistItem({
      book: bookId,
      user: userId
    });

    console.log(wishlistItem);

    // Save wishlist item
    await wishlistItem.save();
    res.status(200).json({ message: 'Item added to wishlist successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


