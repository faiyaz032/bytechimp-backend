//dependencies
const express = require('express');
const { createBlog, getAllBlogs, getBlog, deleteBlog, getBlogsByCategory } = require('../controllers/blogController');
const processMulterImage = require('../utils/processMulterImage');

//initialise the router
const router = express.Router();

//routes here
router.post('/', processMulterImage, createBlog);
router.get('/', getAllBlogs);
router.get('/:slug', getBlog);
router.get('/category/:category', getBlogsByCategory);
router.delete('/', deleteBlog);
//export the router
module.exports = router;
