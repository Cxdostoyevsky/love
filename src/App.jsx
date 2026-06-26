import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import UndergroundDetail from './pages/UndergroundDetail';
import IdiotDetail from './pages/IdiotDetail';
import VisualReferences from './pages/VisualReferences';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/underground" element={<UndergroundDetail />} />
        <Route path="/idiot" element={<IdiotDetail />} />
        <Route path="/visuals" element={<VisualReferences />} />
      </Routes>
    </Router>
  );
}

export default App;
