//dependencies
const mongoose = require('mongoose');
const slugify = require('slugify').default;

const categorySchema = mongoose.Schema({
   name: { type: String, required: [true, 'Category must be required'] },
   slug: String,
});

categorySchema.pre('save', function (next) {
   this.slug = slugify(this.name, { lower: true });
   next();
});

const Category = mongoose.model('category', categorySchema);

module.exports = Category;
