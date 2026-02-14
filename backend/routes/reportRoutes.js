const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Get monthly report
router.get('/monthly', reportController.getMonthlyReport);

// Get category breakdown
router.get('/category-breakdown', reportController.getCategoryBreakdown);

// Get income vs expenses comparison
router.get('/income-vs-expenses', reportController.getIncomeVsExpenses);

module.exports = router;