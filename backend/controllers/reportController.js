const Transaction = require('../models/Transaction');

// Get monthly report
exports.getMonthlyReport = async (req, res) => {
  try {
    const { year } = req.query;
    const reportYear = parseInt(year) || new Date().getFullYear();
    
    // Initialize monthly data
    const monthlyData = [];
    for (let i = 0; i < 12; i++) {
      monthlyData.push({
        month: i + 1,
        income: 0,
        expenses: 0,
        balance: 0
      });
    }
    
    // Get all transactions for the year
    const transactions = await Transaction.find({
      user: req.user.id,
      date: {
        $gte: new Date(reportYear, 0, 1),
        $lt: new Date(reportYear + 1, 0, 1)
      }
    });
    
    // Calculate monthly income and expenses
    transactions.forEach(transaction => {
      const month = new Date(transaction.date).getMonth();
      
      if (transaction.type === 'income') {
        monthlyData[month].income += transaction.amount;
      } else {
        monthlyData[month].expenses += transaction.amount;
      }
    });
    
    // Calculate balance for each month
    monthlyData.forEach(data => {
      data.balance = data.income - data.expenses;
    });
    
    res.json({
      year: reportYear,
      data: monthlyData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get category breakdown
exports.getCategoryBreakdown = async (req, res) => {
  try {
    const { month, year } = req.query;
    
    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required' });
    }
    
    const reportMonth = parseInt(month);
    const reportYear = parseInt(year);
    
    // Get all expense transactions for the specified month and year
    const transactions = await Transaction.find({
      user: req.user.id,
      type: 'expense',
      date: {
        $gte: new Date(reportYear, reportMonth - 1, 1),
        $lt: new Date(reportYear, reportMonth, 1)
      }
    });
    
    // Calculate total for each category
    const categoryTotals = {};
    let totalExpenses = 0;
    
    transactions.forEach(transaction => {
      if (!categoryTotals[transaction.category]) {
        categoryTotals[transaction.category] = 0;
      }
      categoryTotals[transaction.category] += transaction.amount;
      totalExpenses += transaction.amount;
    });
    
    // Calculate percentage for each category
    const categoryBreakdown = Object.keys(categoryTotals).map(category => ({
      category,
      amount: categoryTotals[category],
      percentage: (categoryTotals[category] / totalExpenses) * 100
    }));
    
    // Sort by amount (highest first)
    categoryBreakdown.sort((a, b) => b.amount - a.amount);
    
    res.json({
      month: reportMonth,
      year: reportYear,
      totalExpenses,
      categories: categoryBreakdown
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get income vs expenses comparison
exports.getIncomeVsExpenses = async (req, res) => {
  try {
    const { period } = req.query; // 'week', 'month', 'year'
    const now = new Date();
    let startDate;
    
    switch (period) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    
    // Get all transactions for the period
    const transactions = await Transaction.find({
      user: req.user.id,
      date: {
        $gte: startDate,
        $lte: now
      }
    });
    
    // Calculate income and expenses
    let income = 0;
    let expenses = 0;
    
    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        income += transaction.amount;
      } else {
        expenses += transaction.amount;
      }
    });
    
    res.json({
      period: period || 'month',
      income,
      expenses,
      balance: income - expenses,
      startDate,
      endDate: now
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};