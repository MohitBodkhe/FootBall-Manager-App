import React, { useState , useRef} from 'react';
import PlayerDetails from './PlayerDetails';

const RosterImporter = ({ onRosterUpdate }) => {
  const [file, setFile] = useState(null);
  const [importedData, setImportedData] = useState(null);
  const [errorFields, setErrorFields] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [showPlayerDetails, setShowPlayerDetails] = useState(false);
  const [imported, setImported] = useState(false);
  const fileInputRef = useRef(null);

const handleFileChange = async (e) => {
  const selectedFile = e.target.files[0];

  if (!selectedFile) {
    setFile(null);
    setImportedData(null);
    setErrorFields([]);
    setShowSummary(false);
    setImported(false); 
    return;
  }

  try {
    const content = await selectedFile.text();
    const { data, errors } = processCSVData(content, selectedFile);

    if (errors.length === 0) {
      setImported(false); 
      setFile(selectedFile)
      setImportedData(data);
      setShowSummary(true);
    } else {
      setImportedData(null);
      setErrorFields(errors);
      setShowSummary(false);
      setImported(false);
    }
  } catch (error) {
    console.error('Error reading file:', error);
    setImportedData(null);
    setErrorFields(['Error reading the file.']);
    setShowSummary(false);
    setImported(false);
  }
};

const processCSVData = (csvData, file) => {
  const rows = csvData.split('\n');
  const headers = rows[0].split(',');

  const data = rows.slice(1).map((row) => {
    const values = row.split(',');
    return headers.reduce((obj, header, index) => {
      obj[header.trim()] = values[index].trim();
      return obj;
    }, {});
  });

  const errors = [];

  // Check for empty values
  data.forEach((item, index) => {
    Object.keys(item).forEach((key) => {
      if (item[key].trim() === '') {
        errors.push(`Your sheet is missing data. Please ensure all cells are filled out.`);
      }
    });
  });

  // Check for file extension
  const fileExtension = file.name.split('.').pop().toLowerCase();
  if (fileExtension !== 'csv') {
    errors.push('Invalid file format. Please select a .csv file.');
  }

  // Check for missing fields
  const requiredFields = ['Player Name', 'Position']; // Add other required fields
  const missingFields = requiredFields.filter((field) => !headers.includes(field));
  if (missingFields.length > 0) {
    errors.push(`Missing fields: ${missingFields.join(', ')}`);
  }

  return { data, errors };
};
const handleImport = async () => {
  if (imported) {
    // Reset import state and clear data
    setImported(false);
    setImportedData(null);
    setShowSummary(false);
    setShowPlayerDetails(false);
    setErrorFields([]); // Clear any previous errors
  } else if (file) {
    const content = await file.text();
    const { data, errors } = processCSVData(content, file);

    if (errors.length === 0) {
      setImported(true);
      setImportedData(data);
      setShowSummary(true);
      setShowPlayerDetails(true);
      // Reset the file input
      fileInputRef.current.value = '';
    } else {
      setImported(false);
      setImportedData(null);
      setErrorFields(errors);
      setShowSummary(false);
      setShowPlayerDetails(false);
    }
  }
};

const calculatePositionCounts = () => {
  const positionCounts = {
    Total: 0,
    Goalkeeper: 0,
    Defender: 0,
    Midfielder: 0,
    Forward: 0,
  };

  if (importedData) {
    importedData.forEach((player) => {
      console.log(player)
      // Use 'Height' instead of 'Position' to get the player position
      const position = player['Position'];
      const trimmedPosition = position.trim();

      // Log the raw position values to the console for analysis
      console.log('Raw Position:', position);

      // Check if the position is one of the standard positions
      if (trimmedPosition === 'Goalkeeper') {
        positionCounts.Goalkeeper++;
      } else if (trimmedPosition === 'Defender') {
        positionCounts.Defender++;
      } else if (trimmedPosition === 'Midfielder') {
        positionCounts.Midfielder++;
      } else if (trimmedPosition === 'Forward') {
        positionCounts.Forward++;
      } else {
        console.log('Unknown Position:', trimmedPosition);
      }

      // Increment the total player count
      positionCounts.Total++;
    });
  }

  // Log the position counts to the console
  console.log('Position Counts:', positionCounts);

  return positionCounts;
};

  return (
    <div>
       <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ borderColor: errorFields.length > 0 ? 'red' : 'initial' }}
      />

     {showSummary && (
  <div>
    <h3>Import Summary:</h3>
    <p>Total Players: {importedData ? importedData.length+1 : 0}</p>
    <p>Total Goalkeepers: {calculatePositionCounts()['Goalkeeper'] || 0}</p>
    <p>Total Defenders: {calculatePositionCounts()['Defender'] || 0}</p>
    <p>Total Midfielders: {calculatePositionCounts()['Midfielder'] || 0}</p>
    <p>Total Forwards: {calculatePositionCounts()['Forward'] || 0}</p>
  </div>
)}
      <button onClick={handleImport} disabled={errorFields.length > 0 || !file}>
        {imported ? 'Re-import' : 'Import'}
      </button>

      {errorFields.length > 0 && (
        <div style={{ color: 'red' }}>
          {errorFields.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
      {importedData  && showPlayerDetails && <PlayerDetails players={importedData} />}

    </div>
  );
};

export default RosterImporter;
