//dependencies
const mongoose = require('mongoose');
//internal imports
const app = require('./app');

//database connection
mongoose
   .connect(process.env.MONGODB_CONNECTION_STRING)
   .then(() => console.log('App is successfully connected to database'))
   .catch((error) => console.log(error));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`App is alive on port:${PORT}`));
