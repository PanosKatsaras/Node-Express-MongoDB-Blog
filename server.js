const port = 5000
const express = require('express')
const mongoose = require('mongoose')
const articleRouter = require('./routes/articles')
const Article = require('./models/article')
const methodOverride = require('method-override')

const app = express()

//static files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
//connection to mongodb database (blog) with the use of mongoose
mongoose.connect('mongodb://127.0.0.1:27017/blog');

//use of ejs
app.set('view engine', 'ejs')
//Accessing data in the form to article route with req.body
app.use(express.urlencoded({extended:false}))
//Use of method-override library for overrride GET/POST
app.use(methodOverride('_method'))

//main get method with all articles in descending order
app.get('/', async (req, res) => {
    const articles = await Article.find().sort({createdAt: 'desc'})
    res.render('articles/index', {articles:articles})
})

app.use('/articles', articleRouter)

//port 5000
app.listen(port, () => console.log(`Server running on port: ${port}`));