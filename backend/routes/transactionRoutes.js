const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Get all transactions
router.get('/', transactionController.getTransactions);

// Get transaction summary for dashboard
router.get('/summary', transactionController.getTransactionSummary);

// Get a single transaction
router.get('/:id', transactionController.getTransaction);

// Create a new transaction
router.post('/', transactionController.createTransaction);

// Update a transaction
router.put('/:id', transactionController.updateTransaction);

// Delete a transaction
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;