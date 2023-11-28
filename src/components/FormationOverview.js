import React from 'react';
import FormationPreview from './FormationPreview';
import PlayerDetails from './PlayerDetails';

const FormationOverview = ({ roster }) => {
 
  return (
    <div>
      <h1>Formation Overview</h1>
      <FormationPreview roster={roster} />
      <PlayerDetails />
    </div>
  );
};

export default FormationOverview;
