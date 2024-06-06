const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/querydb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));

const db = mongoose.connection;

//middleware to parse Json bodies
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public_html'));
app.use(express.urlencoded({ extended: true }));  // false for simple search

app.use(logger("dev"));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

const Contact = require('./models/contactModel');

app.get('/theme', function(req, res) {
  res.render('theme', {title: "Change Theme with buttons, CSS or icon"});
});

app.get('/readme', function(req, res) {
  res.render('readme', {title: "Read About What has been used in this project!"});
});

app.get('/docker', function(req, res) {
  res.render('docker', {title: "My experience with Docker!"});
});

app.get('/mongodb', function(req, res) {
  res.render('mongodb', {title: "My first experience with MongoDB!"});
});

app.get('/contact', function (req, res) {
  res.render('contact', { title: 'Contact Us', errors: [] });
});

app.get('/express', function (req, res) {
  res.render('express', { title: 'This Node Project with Express, MongoDB', errors: [] });
});

//render retrieveQuery form
app.get('/retrieveQuery', function (req, res) {
  res.render('retrieveQuery', { title: "Query Database", errors: [], id: null });
});

//routes to search with date
app.get('/contact/date', (req, res) => {
  res.render('retreiveQuery', { title: "Query Database", errors: []});
});  

app.post('/contact/date', async (req, res) => {
  try {
  let searchDate = new Date(req.body.date);
  if (isNaN(searchDate)) {
    return res.status(400).send('Invalid Date');
  }
  let startOfDay = new Date(searchDate.setHours(0,0,0,0));
  let endOfDay = new Date(searchDate.setHours(23,59,59,999));

  let result = await Contact.find({ created_date: { $gte: startOfDay, $lt: endOfDay } });
    res.render('queryList', { title: "Query by Date", result });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/search-id', (req,res) => {
  res.render('retrieveQuery');
});

app.post('/search-id', async (req, res) => {
  try {
    let searchId = req.body.id;
    let result = await Contact.findById(searchId);
    res.render('querybyID', {title: "Query by ID", result} );

  } catch (err) {
    res.status(500).send(err);
  }
});

// get all contacts old method works

app.get('/allqueries', async(req, res) => {
  try {
      const result = await Contact.find().sort({created_date: -1});
      // res.json(data);
      res.render('queryList', {title: 'Query List', result} );
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});


app.get('/searchEnquiryType', (req, res) => {
  res.render('retrieveQuery');
});
//
app.post('/searchEnquiryType', async (req, res) => {
  try {
    const searchTerm = req.body.searchEnquiryType; 
    const result = await Contact.find({ enquiryType : searchTerm });
    res.render('QueryList', {title: "Search By enquiry Type", result });
  } catch (err) {
    res.status(500).send('Error searching by enquiry Type: ' + err.message);
  }
});


// contact form
app.post('/contactForm', [
 //use expressValidator
  body('name')
    .trim()
    .notEmpty().withMessage('First Name is required.')
    .isAlpha().withMessage('First Name must contain only letters.')
    .isLength({ min: 1, max: 30 }).withMessage('First Name must be between 1 and 20 characters,'),
  body('email')
    .isEmail().withMessage('Valid email is required.')
    .isLength({ max: 30 }).withMessage('Email must be less than 30 characters'),
  body('phone')
    .matches(/^\d{10}$/).withMessage('Valid mobile number used when placing order is required.'),
  body('ordertNumber')
    .trim()
    .isLength({ max: 8 }).withMessage('Order Number example is ASD12345.'),
  body('message')
    .isLength({ max: 150 }).withMessage('Maximum number of characters is 150.')

], async (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    //if there is errors, show error messages and display form again
    return res.status(400).render('contact', { title: 'Contact Us', errors: errors.array() });
    // return res.status(400).json({ errors: errors.array() });
  }
  // no error, extract validated data
  try {
    const enquiryType = req.body.enquiryType;
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const orderNumber = req.body.orderNumber;
    const message = req.body.message;
    const created_date = req.body.created_date;

    console.log(name);

    //     const { enquiryType, name, email, phone, orderNumber, message, created_date } = req.body;

    const newContact = new Contact({ enquiryType, name, email, phone, orderNumber, message, created_date });

    await newContact.save();

    // res.status(201).json({ message: 'Contact form submitted successfully' });
    res.render('queryReceived', { title: "Query Received", newContact: newContact });
  } catch (error) {

    console.error('Error submitting contact form:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});





//error middleware for handling 404 file not found errors
app.use((request, response) => {
  response.status(404).send("404: File not found");
});
//other errors due to server code

app.use((error, request, response, next) => {
  let errorStatus = error.status || 500;
  response.status(errorStatus);
  response.send(`ERROR (` + errorStatus + `): ` + error.toString());
});

// Tell our application to listen to requests at port 3000 on the localhost 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  // when the application SVGTransformList, print to the console that our app is running 
  // at http://localhost:3000. Print another message indicating how to shut the server down 
  console.log(`web server running at: http://localhost:${PORT}`);
  console.log(`Type Ctrl+C to shut down the web server`);

})