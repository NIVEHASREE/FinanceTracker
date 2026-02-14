const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

// Get all budgets for a user
exports.getBudgets = async (req, res) => {
  try {
    const { month, year } = req.query;
    
    const filter = { user: req.user.id };
    
    if (month) filter.month = parseInt(month);
    if (year) filter.year = parseInt(year);
    
    const budgets = await Budget.find(filter);
    
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single budget
exports.getBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    
    // Check if budget belongs to user
    if (budget.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new budget
exports.createBudget = async (req, res) => {
  try {
    const { category, amount, month, year } = req.body;
    
    // Check if budget already exists for this category and month
    const existingBudget = await Budget.findOne({
      user: req.user.id,
      category,
      month,
      year
    });
    
    if (existingBudget) {
      return res.status(400).json({ message: 'Budget already exists for this category and month' });
    }
    
    const budget = await Budget.create({
      user: req.user.id,
      category,
      amount,
      month,
      year
    });
    
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a budget
exports.updateBudget = async (req, res) => {
  try {
    let budget = await Budget.findById(req.params.id);
    
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    
    // Check if budget belongs to user
    if (budget.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    budget = await Budget.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a budget
exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    
    // Check if budget belongs to user
    if (budget.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await budget.remove();
    
    res.json({ message: 'Budget removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get budget progress
exports.getBudgetProgress = async (req, res) => {
  try {
    const { month, year } = req.query;
    
    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required' });
    }
    
    // Get all budgets for the specified month and year
    const budgets = await Budget.find({
      user: req.user.id,
      month: parseInt(month),
      year: parseInt(year)
    });
    
    // Get all expenses for the specified month and year
    const expenses = await Transaction.find({
      user: req.user.id,
      type: 'expense',
      date: {
        $gte: new Date(parseInt(year), parseInt(month) - 1, 1),
        $lt: new Date(parseInt(year), parseInt(month), 1)
      }
    });
    
    // Calculate spent amount for each category
    const categorySpent = {};
    expenses.forEach(expense => {
      if (!categorySpent[expense.category]) {
        categorySpent[expense.category] = 0;
      }
      categorySpent[expense.category] += expense.amount;
    });
    
    // Calculate progress for each budget
    const budgetProgress = budgets.map(budget => {
      const spent = categorySpent[budget.category] || 0;
      const remaining = budget.amount - spent;
      const percentage = (spent / budget.amount) * 100;
      
      return {
        ...budget.toObject(),
        spent,
        remaining,
        percentage,
        isOverBudget: spent > budget.amount
      };
    });
    
    res.json(budgetProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};