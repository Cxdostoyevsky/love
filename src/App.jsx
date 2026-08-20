import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import UndergroundDetail from './pages/UndergroundDetail';
import IdiotDetail from './pages/IdiotDetail';
import VisualReferences from './pages/VisualReferences';
import GrandInquisitor from './pages/GrandInquisitor';
import SnowFootsteps from './components/SnowFootsteps';
import CharacterRoom from './pages/CharacterRoom';

function App() {
  return (
    <Router>
      <SnowFootsteps />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/underground" element={<UndergroundDetail />} />
        <Route path="/idiot" element={<IdiotDetail />} />
        <Route path="/grand-inquisitor" element={<GrandInquisitor />} />
        <Route path="/crime-and-punishment" element={<CharacterRoom room="raskolnikov" />} />
        <Route path="/nelly" element={<CharacterRoom room="nelly" />} />
        <Route path="/visuals" element={<VisualReferences />} />
      </Routes>
    </Router>
  );
}

export default App;
