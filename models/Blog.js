//dependencies
const mongoose = require('mongoose');
const { default: slugify } = require('slugify');

//create user schema
const blogSchema = mongoose.Schema(
   {
      title: { type: String, required: [true, 'title is required'] },
      category: { type: String, required: [true, 'category is required'] },
      slug: String,
      image: { type: String, required: [true, 'image is required'] },
      imageAccessLink: { type: String, required: [true, 'image access link is required'] },
      description: { type: String, required: [true, 'description is required'] },
   },
   { timestamps: true }
);

blogSchema.pre('save', function (next) {
   this.slug = slugify(this.title, { lower: true });
   next();
});

//create User model
const Blog = mongoose.model('blog', blogSchema);

//export the model
module.exports = Blog;
