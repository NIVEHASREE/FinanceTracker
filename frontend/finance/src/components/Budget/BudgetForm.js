import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const BudgetForm = ({ budgetId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    category: 'Food',
    amount: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (budgetId) {
      const fetchBudget = async () => {
        try {
          const response = await api.get(`/budgets/${budgetId}`);
          const budget = response.data;
          
          setFormData({
            category: budget.category,
            amount: budget.amount,
            month: budget.month,
            year: budget.year
          });
        } catch (error) {
          console.error('Failed to fetch budget:', error);
          setError('Failed to fetch budget details');
        }
      };
      
      fetchBudget();
    }
  }, [budgetId]);

  const { category, amount, month, year } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (budgetId) {
        // Update existing budget
        await api.put(`/budgets/${budgetId}`, formData);
      } else {
        // Create new budget
        await api.post('/budgets', formData);
      }
      
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="budget-form-container">
      <h2>{budgetId ? 'Edit Budget' : 'Add New Budget'}</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={onChange}
            required
          >
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Housing">Housing</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={amount}
            onChange={onChange}
            min="0.01"
            step="0.01"
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="month">Month</label>
            <select
              id="month"
              name="month"
              value={month}
              onChange={onChange}
              required
            >
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="year">Year</label>
            <input
              type="number"
              id="year"
              name="year"
              value={year}
              onChange={onChange}
              min="2020"
              max="2030"
              required
            />
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : (budgetId ? 'Update' : 'Add')}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BudgetForm;