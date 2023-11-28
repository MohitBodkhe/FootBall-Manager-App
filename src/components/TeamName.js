import React, { useState } from 'react';

const TeamName = ({ teamName, onTeamNameChange }) => {
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(teamName);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = () => {
    onTeamNameChange(newName);
    setEditing(false);
  };

  return (
    <div>
      {editing ? (
        <>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button onClick={handleSave}>Save</button>
        </>
      ) : (
        <>
          <span>{teamName}</span>
          <button onClick={handleEdit}>Edit</button>
        </>
      )}
    </div>
  );
};

export default TeamName;
