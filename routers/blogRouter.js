//dependencies
const express = require('express');
const multer = require('multer');

const upload = multer();
const {
   createBlog,
   getAllBlogs,
   getBlog,
   deleteBlog,
   getBlogsByCategory,
   updateBlog,
   getAllBlogsAdmin,
} = require('../controllers/blogController');
const processMulterImage = require('../utils/processMulterImage');

//initialise the router
const router = express.Router();

//routes here
router.post('/', processMulterImage, createBlog);
router.get('/', getAllBlogs);
router.get('/admin', getAllBlogsAdmin);
router.put('/:slug', processMulterImage, updateBlog);
router.get('/:slug', getBlog);
router.get('/category/:category', getBlogsByCategory);
router.delete('/', deleteBlog);
//export the router
module.exports = router;
