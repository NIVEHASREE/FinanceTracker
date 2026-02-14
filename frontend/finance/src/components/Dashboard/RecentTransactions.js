import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get('/transactions/summary');
        setTransactions(response.data.recentTransactions || []);
      } catch (error) {
        console.error('Failed to fetch recent transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="recent-transactions">
      <div className="section-header">
        <h3>Recent Transactions</h3>
        <Link to="/transactions" className="view-all">
          View All
        </Link>
      </div>
      
      {transactions.length > 0 ? (
        <div className="transaction-list">
          {transactions.map((transaction) => (
            <div key={transaction._id} className="transaction-item">
              <div className="transaction-info">
                <div className="transaction-category">{transaction.category}</div>
                <div className="transaction-description">{transaction.description || 'No description'}</div>
                <div className="transaction-date">{formatDate(transaction.date)}</div>
              </div>
              <div className={`transaction-amount ${transaction.type === 'income' ? 'positive' : 'negative'}`}>
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-data">No transactions found</p>
      )}
    </div>
  );
};

export default RecentTransactions;