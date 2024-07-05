require("dotenv").config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;

const cookieParser = require('cookie-parser');
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL)
.then((e) => console.log("MongoDb connected"));

const path = require('path');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');

const Blog = require('./models/blog');

app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));

app.use(express.static(path.resolve('./public')));

app.set('view engine','ejs');
app.set('views',path.resolve('./views'));

app.get('/',async(req,res)=>{
    const allBlogs = await Blog.find({});
    return res.render('home',{
        user: req.user,
        blogs: allBlogs,
    });
})

app.use('/user',userRoute);
app.use('/blog',blogRoute);

app.listen(PORT,()=>{
    console.log(`server started at port:${PORT}`);
})