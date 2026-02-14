import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const CategoryBreakdown = () => {
  const [categoryData, setCategoryData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    categories: [],
    totalExpenses: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchCategoryData();
  }, [selectedMonth, selectedYear]);

  const fetchCategoryData = async () => {
    try {
      const response = await api.get(`/reports/category-breakdown?month=${selectedMonth}&year=${selectedYear}`);
      setCategoryData(response.data);
    } catch (error) {
      console.error('Failed to fetch category data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="category-breakdown-container">
      <div className="section-header">
        <h2>Category Breakdown</h2>
      </div>
      
      <div className="report-filters">
        <div className="form-group">
          <label htmlFor="month">Month</label>
          <select
            id="month"
            name="month"
            value={selectedMonth}
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
            value={selectedYear}
            onChange={handleYearChange}
            min="2020"
            max="2030"
          />
        </div>
      </div>
      
      <div className="category-summary">
        <div className="summary-card">
          <h3>Total Expenses</h3>
          <p className="amount negative">${categoryData.totalExpenses.toFixed(2)}</p>
        </div>
      </div>
      
      {categoryData.categories.length > 0 ? (
        <div className="category-list">
          <div className="category-list-header">
            <div>Category</div>
            <div>Amount</div>
            <div>Percentage</div>
          </div>
          
          {categoryData.categories.map((category, index) => (
            <div key={index} className="category-list-item">
              <div className="category-name">{category.category}</div>
              <div className="category-amount">${category.amount.toFixed(2)}</div>
              <div className="category-percentage">
                {category.percentage.toFixed(1)}%
                <div className="percentage-bar">
                  <div 
                    className="percentage-fill" 
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-data">
          <p>No expense data available for {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' })} {selectedYear}</p>
        </div>
      )}
    </div>
  );
};

export default CategoryBreakdown;