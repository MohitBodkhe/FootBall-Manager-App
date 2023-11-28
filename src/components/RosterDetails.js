import React from 'react';
import { Link } from 'react-router-dom';
import TeamName from './TeamName';
import SearchBar from './SearchBar';
import RosterImporter from './RosterImporter';
import RosterTable from './RosterTable';

const RosterDetails = ({ roster, teamName, onRosterUpdate, onTeamNameChange }) => {
  // Implement state and functions for the RosterDetails component

  return (
    <div>
      <Link to="/formation">Go to Formation</Link>
      <TeamName teamName={teamName} onTeamNameChange={onTeamNameChange} />
      <SearchBar />
      <RosterImporter onRosterUpdate={onRosterUpdate} />
      <RosterTable roster={roster} onRosterUpdate={onRosterUpdate} />
    </div>
  );
};

export default RosterDetails;
