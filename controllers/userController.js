//internal imports
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');

const login = catchAsync(async (req, res, next) => {
   const user = await User.findOne({ username: req.body.username });
   if (user && user.password === req.body.password) {
      res.status(200).json({ status: 'success', message: 'Admin logged in successfully' });
   }
});

//export the functions
module.exports = { login };
