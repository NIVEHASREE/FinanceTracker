import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="sidebar">
      <div className="sidebar-menu">
        <Link to="/dashboard" className={`sidebar-item ${isActive('/dashboard')}`}>
          Dashboard
        </Link>
        <Link to="/transactions" className={`sidebar-item ${isActive('/transactions')}`}>
          Transactions
        </Link>
        <Link to="/budgets" className={`sidebar-item ${isActive('/budgets')}`}>
          Budgets
        </Link>
        <Link to="/reports" className={`sidebar-item ${isActive('/reports')}`}>
          Reports
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;