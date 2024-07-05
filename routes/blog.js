const express = require('express');
const app = express();
const router = express.Router();

const multer = require('multer');
const path = require('path');
const blog = require('../models/blog');
const comment = require('../models/comment');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,path.resolve(`./public/uploads`));
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`
      cb(null, fileName);
    }
  })
  
  const upload = multer({ storage: storage })

router.get('/add-new',(req,res)=>{
    return res.render('addBlog',{
        user: req.user,
    });
})

router.get('/:id',async(req,res)=>{
  const Blog = await blog.findById(req.params.id).populate('createdBy');
  const Comment = await comment.find({blogId:req.params.id}).populate('createdBy');
  res.render('blog',{
    user:req.user,
    blog:Blog,
    comment:Comment,
  });
})

router.post('/',upload.single('coverImageUrl'),async(req,res)=>{
    const {title,body} = req.body;
    const Blog = await blog.create({
        title,
        body,
        createdBy: req.user._id,
        coverImageUrl: `/uploads/${req.file.filename}`,
    })
    return res.redirect('/');
})

router.post('/comment/:blogId', async(req,res)=>{
  const Comment = await comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
})

module.exports = router;