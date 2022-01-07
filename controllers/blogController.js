//dependencies
const fs = require('fs');
//internal imports
const Blog = require('../models/Blog');
const Category = require('../models/Category');
const catchAsync = require('../utils/catchAsync');
const cloudinary = require('./../utils/cloudinary');
const { default: slugify } = require('slugify');

const createBlog = catchAsync(async (req, res, next) => {
   const imageName = req.file.filename;
   const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path);

   const blog = await Blog.create({ ...req.body, image: imageName, imageAccessLink: secure_url, imageId: public_id });

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

   const blogs = await Blog.find({ category: { $ne: 'Trending' } })
      .select('title slug imageAccessLink category createdAt')
      .skip(skip)
      .limit(limit);
   res.status(200).json({ status: 'success', message: 'All Blogs fetched sucessfully', results: blogs.length, blogs });
});

const getAllBlogsAdmin = catchAsync(async (req, res, next) => {
   const page = req.query.page * 1 || 1;
   const limit = req.query.limit * 1 || 100;
   const skip = (page - 1) * limit;

   const blogs = await Blog.find({}).select('title slug imageAccessLink category createdAt').skip(skip).limit(limit);
   res.status(200).json({ status: 'success', message: 'All Blogs fetched sucessfully', results: blogs.length, blogs });
});

const getBlog = catchAsync(async (req, res, next) => {
   const blog = await Blog.findOne({ slug: req.params.slug }).select({ __v: 0 });
   res.status(200).json({ status: 'success', message: 'Blog fetched sucessfully', blog });
});

const getBlogsByCategory = catchAsync(async (req, res, next) => {
   const page = req.query.page * 1 || 1;
   const limit = req.query.limit * 1 || 100;
   const skip = (page - 1) * limit;
   const { blogs } = await Category.findOne({ slug: req.params.category }).populate({
      path: 'blogs',
      select: 'title slug imageAccessLink category createdAt',
      options: {
         limit: limit,
         skip: skip,
      },
   });

   res.status(200).json({
      status: 'success',
      message: `Blogs of a ${req.params.category} catogory fetched sucessfully`,
      results: blogs.length,
      blogs,
   });
});

const updateBlog = catchAsync(async (req, res, next) => {
   let blog;

   if (req.file !== undefined) {
      //delete the previous image
      const currentBlog = await Blog.findOne({ slug: req.params.slug });
      if (currentBlog.imageId) {
         await cloudinary.uploader.destroy(currentBlog.imageId, { type: 'upload', resource_type: 'image' });
      }

      const imageName = req.file.filename;
      const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path);
      blog = await Blog.findOneAndUpdate(
         { slug: req.params.slug },

         { ...req.body, image: imageName, imageAccessLink: secure_url, imageId: public_id },
         { new: true, runValidators: true }
      );
   }

   if (req.body.category) {
      const correspondingBlog = await Blog.findOne({ slug: req.params.slug });

      await Category.findOneAndUpdate(
         { name: correspondingBlog.category },

         {
            $pull: { blogs: correspondingBlog._id },
         }
      );
      await Category.findOneAndUpdate(
         { name: req.body.category },

         {
            $push: { blogs: correspondingBlog._id },
         }
      );
   }

   blog = await Blog.findOneAndUpdate({ slug: req.params.slug }, req.body, { new: true, runValidators: true });
   if (req.body.title) {
      const slug = slugify(req.body.title, { lower: true });
      blog = await Blog.findOneAndUpdate(
         { slug: req.params.slug },
         { $set: { slug: slug } },
         { new: true, runValidators: true }
      );
   }
   res.status(200).json({ status: 'success', message: 'Blog updated successfully', data: { blog } });
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

   if (deletedBlog.imageId) {
      await cloudinary.uploader.destroy(deletedBlog.imageId, { type: 'upload', resource_type: 'image' });
   }
   //delete the blog from the corresponding category
   await Category.findOneAndUpdate(
      { name: deletedBlog.category },
      {
         $pull: { blogs: deletedBlog._id },
      }
   );
   res.status(200).json({ status: 'success', message: 'Blog deleted sucessfully' });
});

module.exports = { createBlog, getAllBlogs, getBlog, getBlogsByCategory, updateBlog, deleteBlog, getAllBlogsAdmin };
