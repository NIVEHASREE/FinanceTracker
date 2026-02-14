const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Get all budgets
router.get('/', budgetController.getBudgets);

// Get budget progress
router.get('/progress', budgetController.getBudgetProgress);

// Get a single budget
router.get('/:id', budgetController.getBudget);

// Create a new budget
router.post('/', budgetController.createBudget);

// Update a budget
router.put('/:id', budgetController.updateBudget);

// Delete a budget
router.delete('/:id', budgetController.deleteBudget);

module.exports = router;