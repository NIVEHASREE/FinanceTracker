import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import api from '../../services/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

const Charts = () => {
  const [monthlyData, setMonthlyData] = useState({
    year: new Date().getFullYear(),
    data: []
  });
  const [categoryData, setCategoryData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    categories: [],
    totalExpenses: 0
  });
  const [incomeVsExpenses, setIncomeVsExpenses] = useState({
    period: 'month',
    income: 0,
    expenses: 0,
    balance: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchMonthlyData();
  }, []);

  useEffect(() => {
    fetchCategoryData();
    fetchIncomeVsExpenses();
  }, [selectedMonth, selectedYear]);

  const fetchMonthlyData = async () => {
    try {
      const response = await api.get(`/reports/monthly?year=${selectedYear}`);
      setMonthlyData(response.data);
    } catch (error) {
      console.error('Failed to fetch monthly data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryData = async () => {
    try {
      const response = await api.get(`/reports/category-breakdown?month=${selectedMonth}&year=${selectedYear}`);
      setCategoryData(response.data);
    } catch (error) {
      console.error('Failed to fetch category data:', error);
    }
  };

  const fetchIncomeVsExpenses = async () => {
    try {
      const response = await api.get(`/reports/income-vs-expenses?period=month`);
      setIncomeVsExpenses(response.data);
    } catch (error) {
      console.error('Failed to fetch income vs expenses data:', error);
    }
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  // Monthly income vs expenses chart data
  const monthlyChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Income',
        data: monthlyData.data.map(item => item.income),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Expenses',
        data: monthlyData.data.map(item => item.expenses),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      }
    ],
  };

  const monthlyChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Monthly Income vs Expenses - ${monthlyData.year}`,
      },
    },
  };

  // Category breakdown chart data
  const categoryChartData = {
    labels: categoryData.categories.map(item => item.category),
    datasets: [
      {
        data: categoryData.categories.map(item => item.amount),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(199, 199, 199, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const categoryChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: `Expense Category Breakdown - ${new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' })} ${selectedYear}`,
      },
    },
  };

  // Income vs expenses summary
  const incomeVsExpensesData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        data: [incomeVsExpenses.income, incomeVsExpenses.expenses],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const incomeVsExpensesOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Income vs Expenses - ${incomeVsExpenses.period}`,
      },
    },
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="reports-container">
      <h2>Financial Reports</h2>
      
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
      
      <div className="charts-grid">
        <div className="chart-container">
          <Bar data={monthlyChartData} options={monthlyChartOptions} />
        </div>
        
        <div className="chart-container">
          <Pie data={categoryChartData} options={categoryChartOptions} />
        </div>
        
        <div className="chart-container">
          <Pie data={incomeVsExpensesData} options={incomeVsExpensesOptions} />
        </div>
      </div>
      
      <div className="summary-cards">
        <div className="summary-card">
          <h3>Total Income</h3>
          <p className="amount positive">${incomeVsExpenses.income.toFixed(2)}</p>
        </div>
        
        <div className="summary-card">
          <h3>Total Expenses</h3>
          <p className="amount negative">${incomeVsExpenses.expenses.toFixed(2)}</p>
        </div>
        
        <div className="summary-card">
          <h3>Net Balance</h3>
          <p className={`amount ${incomeVsExpenses.balance >= 0 ? 'positive' : 'negative'}`}>
            ${incomeVsExpenses.balance.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Charts;