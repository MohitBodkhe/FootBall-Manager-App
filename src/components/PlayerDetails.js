import React from 'react';

const PlayerDetails = ({ players }) => {
  if (!players || players.length === 0) {
    return null;
  }

  const headers = Object.keys(players[0]);

  return (
    <div>
      <h3>Player Details:</h3>
      <table border="1">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {players.map((player, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header, colIndex) => (
                <td key={colIndex}>{player[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerDetails;
