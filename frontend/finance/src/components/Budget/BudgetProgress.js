import React, { useState, useEffect } from 'react';

const BudgetProgress = ({ month, year, onEdit, onDelete }) => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBudgetProgress = async () => {
      try {
        const response = await fetch(`/api/budgets/progress?month=${month}&year=${year}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch budget progress');
        }
        
        const data = await response.json();
        setBudgets(data);
      } catch (error) {
        console.error('Failed to fetch budget progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetProgress();
  }, [month, year]);

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="budget-progress-container">
      <h3>Budget Progress for {new Date(year, month - 1).toLocaleString('default', { month: 'long' })} {year}</h3>
      
      {budgets.length > 0 ? (
        <div className="budget-list">
          {budgets.map((budget) => (
            <div key={budget._id} className={`budget-item ${budget.isOverBudget ? 'over-budget' : ''}`}>
              <div className="budget-info">
                <div className="budget-category">{budget.category}</div>
                <div className="budget-details">
                  <span>${budget.spent.toFixed(2)} of ${budget.amount.toFixed(2)}</span>
                  <span className={`budget-percentage ${budget.isOverBudget ? 'over-budget' : ''}`}>
                    {budget.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <div className="budget-progress-bar">
                <div 
                  className={`progress-fill ${budget.isOverBudget ? 'over-budget' : ''}`}
                  style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                ></div>
              </div>
              
              <div className="budget-remaining">
                {budget.isOverBudget ? (
                  <span className="over-budget-amount">
                    ${(budget.spent - budget.amount).toFixed(2)} over budget
                  </span>
                ) : (
                  <span>
                    ${budget.remaining.toFixed(2)} remaining
                  </span>
                )}
              </div>
              
              <div className="budget-actions">
                <button 
                  className="btn btn-sm btn-secondary" 
                  onClick={() => onEdit(budget._id)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-sm btn-danger" 
                  onClick={() => onDelete(budget._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-data">
          <p>No budgets found for this period</p>
        </div>
      )}
    </div>
  );
};

export default BudgetProgress;