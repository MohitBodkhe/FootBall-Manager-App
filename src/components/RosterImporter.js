import React, { useState } from 'react';

const RosterImporter = ({ onRosterUpdate }) => {
  const [file, setFile] = useState(null);
  const [importedData, setImportedData] = useState(null);
  const [errorFields, setErrorFields] = useState([]);
  const [showSummary, setShowSummary] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);

      const reader = new FileReader();

      reader.onload = (e) => {
        const csvData = e.target.result;
        const { data, errors } = processCSVData(csvData, selectedFile);

        if (errors.length === 0) {
          setImportedData(data);
          setShowSummary(true);
        } else {
          setImportedData(null);
          setErrorFields(errors);
          setShowSummary(false);
        }
      };

      reader.readAsText(selectedFile);
    } else {
      // Reset state if no file is selected
      setFile(null);
      setImportedData(null);
      setErrorFields([]);
      setShowSummary(false);
    }
  };

  const handleImport = () => {
    if (file) {
      const { data, errors } = processCSVData(file);

      if (errors.length === 0) {
        setImportedData(data);
        setShowSummary(true);
      } else {
        setImportedData(null);
        setErrorFields(errors);
        setShowSummary(false);
      }
    }
  };

const processCSVData = (file) => {
  const fileExtension = file.name.split('.').pop().toLowerCase();
  const errors = [];

  if (fileExtension !== 'csv') {
    errors.push('Invalid file format. Please select a .csv file.');
  }

  const reader = new FileReader();

  reader.onload = (e) => {
    const csvData = e.target.result;
    const rows = csvData.split('\n');
    const headers = rows[0].split(',');

    const data = rows.slice(1).map((row) => {
      const values = row.split(',');
      return headers.reduce((obj, header, index) => {
        obj[header.trim()] = values[index].trim();
        return obj;
      }, {});
    });

    // Check for empty values
    data.forEach((item, index) => {
      Object.keys(item).forEach((key) => {
        if (item[key].trim() === '') {
          errors.push(`Empty value found in row ${index + 2}, column ${key}`);
        }
      });
    });

    // Check for missing fields
    const requiredFields = ['Player Name', 'Position']; // Add other required fields
    const missingFields = requiredFields.filter((field) => !headers.includes(field));
    if (missingFields.length > 0) {
      errors.push(`Missing fields: ${missingFields.join(', ')}`);
    }

    setImportedData(data);
    setShowSummary(true);
  };

  reader.readAsText(file);

  return { errors };
};


  const calculatePositionCounts = () => {
    const positionCounts = {};

    if (importedData) {
      importedData.forEach((player) => {
        const position = player['Position'];
        positionCounts[position] = (positionCounts[position] || 0) + 1;
      });
    }

    return positionCounts;
  };

  return (
    <div>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        style={{ borderColor: errorFields.length > 0 ? 'red' : 'initial' }}
      />

      {showSummary && (
        <div>
          <h3>Import Summary:</h3>
          <p>Total Players: {importedData ? importedData.length : 0}</p>
          <p>Total Goalkeepers: {calculatePositionCounts()['Goalkeeper'] || 0}</p>
          <p>Total Defenders: {calculatePositionCounts()['Defender'] || 0}</p>
          <p>Total Midfielders: {calculatePositionCounts()['Midfielder'] || 0}</p>
          <p>Total Forwards: {calculatePositionCounts()['Forward'] || 0}</p>
        </div>
      )}

      <button onClick={() => onRosterUpdate(importedData)} disabled={errorFields.length > 0}>
        Import
      </button>

      {errorFields.length > 0 && (
        <div style={{ color: 'red' }}>
          {errorFields.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default RosterImporter;
