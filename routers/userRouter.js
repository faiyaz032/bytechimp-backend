//dependencies
const express = require('express');
const { login } = require('../controllers/userController');

//initialise the router
const router = express.Router();

router.post('/login', login);

//export the router
module.exports = router;
