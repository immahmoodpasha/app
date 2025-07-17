import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Inventory from './Inventory';
import NewProduct from './NewProduct';
import "./App.css";

function App() {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/newproduct" element={<NewProduct />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
