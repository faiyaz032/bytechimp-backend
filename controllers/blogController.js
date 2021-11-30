//dependencies
const fs = require('fs');
//internal imports
const Blog = require('../models/Blog');
const Category = require('../models/Category');
const catchAsync = require('../utils/catchAsync');

const createBlog = catchAsync(async (req, res, next) => {
   const imageAccessLink = `https://bytechimp-api.herokuapp.com/uploads/${req.file.filename}`;
   const image = req.file.filename;
   const blog = await Blog.create({ ...req.body, image: image, imageAccessLink: imageAccessLink });

   await Category.findOneAndUpdate(
      { name: blog.category },
      {
         $push: { blogs: blog._id },
      }
   );

   res.status(200).json({ status: 'sucess', message: 'Blog created successfully' });
});

const getAllBlogs = catchAsync(async (req, res, next) => {
   const blogs = await Blog.find({}).select({ __v: 0 });
   res.status(200).json({ status: 'success', message: 'All Blogs fetched sucessfully', blogs });
});

const getBlog = catchAsync(async (req, res, next) => {
   const blog = await Blog.findOne({ slug: req.params.slug }).select({ __v: 0 });
   res.status(200).json({ status: 'success', message: 'Blog fetched sucessfully', blog });
});

const getBlogsByCategory = catchAsync(async (req, res, next) => {
   const { blogs } = await Category.findOne({ slug: req.params.category }).populate('blogs');
   res.status(200).json({ status: 'success', message: `Blogs of a catogory fetched sucessfully`, blogs });
});

const deleteBlog = catchAsync(async (req, res, next) => {
   const deletedBlog = await Blog.findByIdAndDelete({ _id: req.body.id });

   const path = `${__dirname}/../public/uploads/${deletedBlog.image}`;

   fs.unlink(path, (err) => {
      if (err) {
         console.error(err);
      }
   });

   await Category.findOneAndUpdate(
      { name: deletedBlog.category },
      {
         $pull: { blogs: deletedBlog._id },
      }
   );
   res.status(200).json({ status: 'success', message: 'Blog deleted sucessfully' });
});

module.exports = { createBlog, getAllBlogs, getBlog, getBlogsByCategory, deleteBlog };
