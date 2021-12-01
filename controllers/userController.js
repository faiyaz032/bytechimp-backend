//internal imports
const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const login = catchAsync(async (req, res, next) => {
   const user = await User.findOne({ username: req.body.username });
   if (user && user.password === req.body.password) {
      res.status(200).json({ status: 'success', message: 'Admin logged in successfully' });
   } else {
      next(new AppError(400, 'Please provide correct credentials'));
   }
});

//export the functions
module.exports = { login };
