const mongoose = require('mongoose');
const marked = require('marked');
const slugify = require('slugify');
const createDomPurify = require('dompurify');
const {JSDOM} = require('jsdom');
//Allows to dompurify to create HTML with the use JSDOM window object
const dompurify = createDomPurify(new JSDOM().window);

//Article Schema with the use of mongoose
const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {type:String},
  markdown: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  sanitizedHTML:{
    type: String,
    required: true
  }
});

//A function for validations that runs before CRUD operations 
articleSchema.pre('validate', function(next){
  if(this.title){
    this.slug = slugify(this.title, 
      {lower:true, strict:true})
  }
  //Markdown convertion to HTML with the use of dompurify and sanitize method for preventing of malicius code
  if(this.markdown){
    this.sanitizedHTML = dompurify.sanitize(marked.parse(this.markdown))
  }
  next()
})

//Article model and creation of Article table in database with the use of mongoose
module.exports = mongoose.model('Article', articleSchema);
