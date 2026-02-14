import React from 'react';

const TransactionItem = ({ transaction, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="transaction-item">
      <div className="transaction-info">
        <div className="transaction-category">{transaction.category}</div>
        <div className="transaction-description">{transaction.description || 'No description'}</div>
        <div className="transaction-date">{formatDate(transaction.date)}</div>
      </div>
      <div className="transaction-actions">
        <div className={`transaction-amount ${transaction.type === 'income' ? 'positive' : 'negative'}`}>
          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
        </div>
        <div className="action-buttons">
          <button 
            className="btn btn-sm btn-secondary" 
            onClick={() => onEdit(transaction._id)}
          >
            Edit
          </button>
          <button 
            className="btn btn-sm btn-danger" 
            onClick={() => onDelete(transaction._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;