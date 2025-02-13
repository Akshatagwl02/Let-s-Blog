const express = require('express');
const app = express();
const User = require('../models/user');
const router = express.Router();


router.get('/signin',(req,res)=>{
    res.render('signin');
})

router.get('/signup',(req,res)=>{
    res.render('signup');
})

router.post('/signup', async (req,res)=>{
    const { fullName, email, password} = req.body;
    await User.create({
        fullName,
        email,
        password,
    });
    try{
        return res.redirect('/user/signin');
    }
    catch(error){
        res.render('signup',{
            error: "Email already exist",
        });
    }
})

router.post('/signin', async (req,res)=>{
    const {email,password} = req.body;
    try{
        const token = await User.matchPasswordAndGenerateToken(email,password);
        return res.cookie("token",token).redirect('/');
    }
    catch(error){
        res.render('signin',{
            error: "Incorrect Email or Password",
        });
    }
});

router.get('/logout',(req,res)=>{
    res.clearCookie('token').redirect('/');
});

module.exports = router;