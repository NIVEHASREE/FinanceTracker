import React, { useState, useEffect } from 'react';
import BudgetProgress from './BudgetProgress';
import api from '../../services/api';
import BudgetForm from "./BudgetForm"; 

const BudgetList = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchBudgets();
  }, [currentMonth, currentYear]);

  const fetchBudgets = async () => {
    try {
      const response = await api.get(`/budgets?month=${currentMonth}&year=${currentYear}`);
      setBudgets(response.data);
    } catch (error) {
      console.error('Failed to fetch budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgetProgress = async () => {
    try {
      const response = await api.get(`/budgets/progress?month=${currentMonth}&year=${currentYear}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch budget progress:', error);
      return [];
    }
  };

  const handleAddBudget = () => {
    setEditingBudget(null);
    setShowForm(true);
  };

  const handleEditBudget = (budgetId) => {
    setEditingBudget(budgetId);
    setShowForm(true);
  };

  const handleDeleteBudget = async (budgetId) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await api.delete(`/budgets/${budgetId}`);
        fetchBudgets();
      } catch (error) {
        console.error('Failed to delete budget:', error);
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchBudgets();
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  const handleMonthChange = (e) => {
    setCurrentMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e) => {
    setCurrentYear(parseInt(e.target.value));
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="budgets-container">
      <div className="section-header">
        <h2>Budgets</h2>
        <button className="btn btn-primary" onClick={handleAddBudget}>
          Add Budget
        </button>
      </div>
      
      <div className="budget-filter">
        <div className="form-group">
          <label htmlFor="month">Month</label>
          <select
            id="month"
            name="month"
            value={currentMonth}
            onChange={handleMonthChange}
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
            value={currentYear}
            onChange={handleYearChange}
            min="2020"
            max="2030"
          />
        </div>
      </div>
      
      {showForm ? (
        <BudgetForm
          budgetId={editingBudget}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      ) : (
        <>
          {budgets.length > 0 ? (
            <BudgetProgress 
              month={currentMonth} 
              year={currentYear}
              onEdit={handleEditBudget}
              onDelete={handleDeleteBudget}
            />
          ) : (
            <div className="no-data">
              <p>No budgets found for {new Date(currentYear, currentMonth - 1).toLocaleString('default', { month: 'long' })} {currentYear}</p>
              <button className="btn btn-primary" onClick={handleAddBudget}>
                Add Your First Budget
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BudgetList;