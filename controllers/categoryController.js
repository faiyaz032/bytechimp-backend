//internal imports

const Category = require('../models/Category');
const catchAsync = require('../utils/catchAsync');

const getCategories = catchAsync(async (req, res, next) => {
   const categories = await Category.find({}).select({ __v: 0 });
   res.status(200).json({ status: 'success', message: 'Categories fetched successfully', categories });
});
const createCategory = catchAsync(async (req, res, next) => {
   await Category.create({ ...req.body });
   res.status(200).json({ status: 'success', message: 'Category created successfully' });
});

const deleteCategory = catchAsync(async (req, res, next) => {
   await Category.findByIdAndDelete({ id_: req.body.id });
   res.status(200).json({ status: 'success', message: 'Category deleted successfully' });
});

//export the functions
module.exports = { getCategories, createCategory, deleteCategory };
