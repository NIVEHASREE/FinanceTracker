import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Overview = () => {
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
    categoryTotals: {},
    recentTransactions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await api.get('/transactions/summary');
        setSummary(response.data);
      } catch (error) {
        console.error('Failed to fetch summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="overview-container">
      <div className="overview-cards">
        <div className="overview-card balance-card">
          <h3>Total Balance</h3>
          <p className={`amount ${summary.balance >= 0 ? 'positive' : 'negative'}`}>
            ${summary.balance.toFixed(2)}
          </p>
        </div>
        
        <div className="overview-card income-card">
          <h3>Income</h3>
          <p className="amount positive">${summary.income.toFixed(2)}</p>
        </div>
        
        <div className="overview-card expense-card">
          <h3>Expenses</h3>
          <p className="amount negative">${summary.expenses.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="category-breakdown">
        <h3>Expense Breakdown</h3>
        <div className="category-list">
          {Object.entries(summary.categoryTotals).map(([category, amount]) => (
            <div key={category} className="category-item">
              <span className="category-name">{category}</span>
              <span className="category-amount">${amount.toFixed(2)}</span>
            </div>
          ))}
          {Object.keys(summary.categoryTotals).length === 0 && (
            <p className="no-data">No expense data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;