import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Inventory from './Inventory';
import NewProduct from './NewProduct';
import InventorySummary from './InventorySummary'
import Dashboard from './Dashboard';
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
        </Routes>
      </Router>
    </div>
  );
}

export default App;
