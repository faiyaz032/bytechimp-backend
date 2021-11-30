//dependencies
const express = require('express');
const { getCategories, createCategory } = require('../controllers/categoryController');

//initialise the router
const router = express.Router();

//routes here
router.get('/', getCategories);
router.post('/', createCategory);

//export the router
module.exports = router;
