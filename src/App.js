import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Inventory from './pages/Inventory';
import NewProduct from './pages/NewProduct';
import InventorySummary from './pages/InventorySummary'
import CategoryDistribution from './pages/CategoryDistribution';
import Dashboard from './pages/Dashboard';
import "./App.css";

function App() {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/newproduct" element={<NewProduct />} />
          <Route path="/InventorySummary" element={<InventorySummary />} />
          <Route path="/CategoryDistribution" element={<CategoryDistribution />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
