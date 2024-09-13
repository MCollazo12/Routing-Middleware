const express = require('express');
const ExpressError = require('./expressError');
const itemRoutes = require('./itemRoutes');
const morgan = require('morgan');

const app = express();

app.use(express.json());
app.use('/items', itemRoutes);
app.use(morgan('dev'))

// 404 Handler
app.use((req, res, next) => {
  const err = new ExpressError('Not found', 404);
  return next(err)
});

// Generic error handler
app.use((err, req, res, next) => {
  // Default status is 500 Internal Server Error
  let status = err.status || 500;

  // Set status and alert the user
  return res.status(status).json({
    error: {
      message: err.message,
      status: status,
    },
  });
});

app.listen(3000, () => {
  console.log('App on port 3000');
});
