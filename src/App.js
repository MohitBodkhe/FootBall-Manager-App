import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RosterDetails from './components/RosterDetails'
import FormationOverview from './components/FormationOverview';

const App = () => {
  const [roster, setRoster] = useState([]);
  const [teamName, setTeamName] = useState('Your Team');

  const handleRosterUpdate = (newRoster) => {
    setRoster(newRoster);
  };

  const handleTeamNameChange = (newName) => {
    setTeamName(newName);
  };

  return (
    <Router>
      <Routes>
       <Route path="/" element={<RosterDetails roster={roster} teamName={teamName} onRosterUpdate={handleRosterUpdate} onTeamNameChange={handleTeamNameChange} />} />
        <Route path="/formation" element={<FormationOverview roster={roster} />} />
      </Routes>
    </Router>
  );
};

export default App;

