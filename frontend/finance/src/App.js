import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Common/Navbar';
import Sidebar from './components/Common/Sidebar';
import ProtectedRoute from './components/Common/ProtectedRoute';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import OAuth from './components/Auth/OAuth';
import Overview from './components/Dashboard/Overview';
import RecentTransactions from './components/Dashboard/RecentTransactions';
import TransactionList from './components/Transactions/TransactionList';
import BudgetList from './components/Budget/BudgetList';
import Charts from './components/Reports/Charts';
import CategoryBreakdown from './components/Reports/CategoryBreakdown';
import './App.css';

const AppLayout = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth/callback" element={<OAuth />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <div className="app-container">
      <Navbar />
      <div className="app-content">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/dashboard" element={
              <>
                <Overview />
                <RecentTransactions />
              </>
            } />
            <Route path="/transactions" element={<TransactionList />} />
            <Route path="/budgets" element={<BudgetList />} />
            <Route path="/reports" element={<Charts />} />
            <Route path="/reports/category-breakdown" element={<CategoryBreakdown />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
};

export default App;