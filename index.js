require('dotenv').config();
const express = require('express');
const cors = require('cors');
const loanRoutes = require('./src/routes/loanRoutes');
const { errorHandler, notFoundHandler } = require('./src/middleware/errorHandler');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Library Loan API is running 📚',
    version: '1.0.0',
    endpoints: {
      loans: '/api/loans',
      docs: 'https://github.com/your-username/library-loan-api#readme',
    },
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API v1 - Library Loan Management System',
    routes: {
      'GET    /api/loans': 'Get all loans (filter: ?status=, ?member_id=, ?book_id=)',
      'GET    /api/loans/:id': 'Get loan by ID',
      'POST   /api/loans': 'Create new loan',
      'PUT    /api/loans/:id': 'Update loan',
      'DELETE /api/loans/:id': 'Delete loan',
    },
  });
});

app.use('/api/loans', loanRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 Library Loan API ready!`);
});

module.exports = app;
