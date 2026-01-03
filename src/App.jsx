import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import UndergroundDetail from './pages/UndergroundDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/underground" element={<UndergroundDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
