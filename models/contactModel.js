// contactModel.js

const mongoose = require('mongoose');
const { DateTime } = require("luxon");

// Define a schema
const contactSchema = new mongoose.Schema({
  enquiryType: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  orderNumber: {
    type: String,
    required: false
  },
  message: {
    type: String,
    required: true
  },
  created_date: {
    type: Date,  
    default: Date.now 
     //  this is in native format and will stay this way
  }
});

contactSchema.virtual("created_date_formatted").get(function () {
  return DateTime.fromJSDate(this.created_date).toLocaleString(DateTime.DATE_MED);
});

contactSchema.virtual("created_date_yyyy_mm_dd").get(function () {
  return DateTime.fromJSDate(this.created_date).toISODate(); //format 'YYYY-MM-DD'
});

// export Contact model
const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;


