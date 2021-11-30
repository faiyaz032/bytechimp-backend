//dependencies
const express = require('express');
const { getCategories, createCategory, deleteCategory } = require('../controllers/categoryController');

//initialise the router
const router = express.Router();

//routes here
router.get('/', getCategories);
router.post('/', createCategory);
router.delete('/', deleteCategory);

//export the router
module.exports = router;
