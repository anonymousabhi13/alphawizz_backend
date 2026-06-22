const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const apiRoutes = require('./routes');
const errorHandler = require('./middlewares/error.middleware');
const { NotFoundError } = require('./utils/errors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Request logging
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});

// Root health-check
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running'
  });
});

// API Routes
app.use('/api', apiRoutes);

// Catch 404 and forward to error handler
app.all('*', (req, res, next) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server!`));
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
