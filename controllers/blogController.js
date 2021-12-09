//dependencies
const fs = require('fs');
//internal imports
const Blog = require('../models/Blog');
const Category = require('../models/Category');
const catchAsync = require('../utils/catchAsync');
const cloudinary = require('./../utils/cloudinary');

const createBlog = catchAsync(async (req, res, next) => {
   const imageName = req.file.filename;
   const { public_id, url } = await cloudinary.uploader.upload(req.file.path);

   const blog = await Blog.create({ ...req.body, image: imageName, imageAccessLink: url, imageId: public_id });

   await Category.findOneAndUpdate(
      { name: blog.category },
      {
         $push: { blogs: blog._id },
      }
   );

   res.status(200).json({ status: 'sucess', message: 'Blog created successfully', blog });
});

const getAllBlogs = catchAsync(async (req, res, next) => {
   const page = req.query.page * 1 || 1;
   const limit = req.query.limit * 1 || 100;
   const skip = (page - 1) * limit;

   const blogs = await Blog.find({}).select({ __v: 0 }).skip(skip).limit(limit);
   res.status(200).json({ status: 'success', message: 'All Blogs fetched sucessfully', results: blogs.length, blogs });
});

const getBlog = catchAsync(async (req, res, next) => {
   const blog = await Blog.findOne({ slug: req.params.slug }).select({ __v: 0 });
   res.status(200).json({ status: 'success', message: 'Blog fetched sucessfully', blog });
});

const getBlogsByCategory = catchAsync(async (req, res, next) => {
   const { blogs } = await Category.findOne({ slug: req.params.category }).populate('blogs');
   res.status(200).json({
      status: 'success',
      message: `Blogs of a catogory fetched sucessfully`,

      blogs,
   });
});

const deleteBlog = catchAsync(async (req, res, next) => {
   const deletedBlog = await Blog.findByIdAndDelete({ _id: req.body.id });

   //delete image local and from cloudinary
   const path = `${__dirname}/../public/uploads/${deletedBlog.image}`;
   fs.unlink(path, (err) => {
      if (err) {
         console.error(err);
      }
   });

   await cloudinary.uploader.destroy(deletedBlog.imageId, { type: 'upload', resource_type: 'image' });
   //delete the blog from the corresponding category
   await Category.findOneAndUpdate(
      { name: deletedBlog.category },
      {
         $pull: { blogs: deletedBlog._id },
      }
   );
   res.status(200).json({ status: 'success', message: 'Blog deleted sucessfully' });
});

module.exports = { createBlog, getAllBlogs, getBlog, getBlogsByCategory, deleteBlog };
