import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Inventory2 from './pages/Inventory2';
import NewProduct from './pages/NewProduct';
import InventorySummary from './pages/InventorySummary'
import CategoryDistribution from './pages/CategoryDistribution';
import InventoryTrends from './pages/InventoryTrends';
import Dashboard from './pages/Dashboard';
import CategoryRevenue from './pages/CategoryRevenue';
import OverviewAnalytics from './pages/OverviewAnalytics';
import ProtectedRoute from './ProtectedRoute';
import "./App.css";


function App() {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<ProtectedRoute />}>
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory2 />} />
              <Route path="/InventorySummary" element={<InventorySummary />} />
              <Route path="/CategoryDistribution" element={<CategoryDistribution />} />
              <Route path="/OverviewAnalytics" element={<OverviewAnalytics />} />

            <Route path="/newproduct" element={<NewProduct />} />
            
          </Route>
          
        </Routes>
      </Router>
    </div>
  );
}

export default App;
