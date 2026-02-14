import React, { useState, useEffect } from 'react';
import TransactionItem from './TransactionItem';
import api from '../../services/api';
import TransactionForm from './TransactionForm';;
const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions');
      setTransactions(response.data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setShowForm(true);
  };

  const handleEditTransaction = (transactionId) => {
    setEditingTransaction(transactionId);
    setShowForm(true);
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await api.delete(`/transactions/${transactionId}`);
        fetchTransactions();
      } catch (error) {
        console.error('Failed to delete transaction:', error);
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchTransactions();
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="transactions-container">
      <div className="section-header">
        <h2>Transactions</h2>
        <button className="btn btn-primary" onClick={handleAddTransaction}>
          Add Transaction
        </button>
      </div>
      
      {showForm ? (
        <TransactionForm
          transactionId={editingTransaction}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      ) : (
        <>
          {transactions.length > 0 ? (
            <div className="transaction-list">
              {transactions.map((transaction) => (
                <TransactionItem
                  key={transaction._id}
                  transaction={transaction}
                  onEdit={handleEditTransaction}
                  onDelete={handleDeleteTransaction}
                />
              ))}
            </div>
          ) : (
            <div className="no-data">
              <p>No transactions found</p>
              <button className="btn btn-primary" onClick={handleAddTransaction}>
                Add Your First Transaction
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TransactionList;