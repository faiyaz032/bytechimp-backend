//dependencies
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const path = require('path');
//internal imports
const { notFoundHandler, defaultErrorHandler } = require('./middlewares/errorHandlers');
const categoryRouter = require('./routers/categoryRouter');
const userRouter = require('./routers/userRouter');
const blogRouter = require('./routers/blogRouter');

//initialise express app
const app = express();

//initialise cors
app.use(cors({ origin: true }));

//request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//set static folder
app.use(express.static('public')); 

//root route of the app
app.get('/', (req, res, next) => {
   res.status(200).json({ status: 'success', message: 'This is the root of shoppingify backend' });
});

//routers
app.use('/api/user', userRouter);
app.use('/api/category', categoryRouter);
app.use('/api/blog', blogRouter);

//Error handlers
app.all('*', notFoundHandler);

//default error handler
app.use(defaultErrorHandler);

module.exports = app;
