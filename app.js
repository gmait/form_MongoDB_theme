
const express = require('express');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// const contactRoutes = require('./routes/contactRoutes');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/querydb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));

//middleware to parse Json bodies
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public_html'));
app.use(express.urlencoded({ extended: true }));
const Contact = require('./models/contactModel');
const contactRoutes = require('./routes/contactRoutes');

app.use('/api', contactRoutes);

// try to use contactRoutes middleware, mount the contact routes on a base URL 
// app.use('/contact', contactRoutes);
app.get('/', function (req, res) {
  res.render('index', { title: 'Crafts N More Website Project', errors: [] });
});

app.get('/contact', function (req, res) {
  res.render('contact', { title: 'Contact Us', errors: [] });
});

app.get('/backendQuery', function (req, res) {
  res.render('backendQuery', { title: "Query Database", errors: [] });
});



app.post('/contactForm', [
  //use expressValidator
  // body('enquiryType')  // this gives error
  //   .notEmpty().withMessage('EnquiryType is required'),
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

], async(req, res) => {

  const errors = validationResult(req);

  if(!errors.isEmpty()) {
  //if there is errors, show error messages and display form again
  // return res.status(400).render('contact', { title: 'Contact Us', errors: errors.array() });
  return res.status(400).json({ errors: errors.array() });
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
  res.render('queryReceived', {title: "Query Received", newContact : newContact});
} catch (error) {

  console.error('Error submitting contact form:', error);
  res.status(500).json({ error: 'An error occurred while processing your request' });
}
} );

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