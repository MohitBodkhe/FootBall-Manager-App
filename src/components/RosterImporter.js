import React, { useState , useRef} from 'react';
import Papa from 'papaparse';
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
  try {
    const { data, errors } = Papa.parse(csvData, {
      header: true, // Treat the first row as headers
      skipEmptyLines: true, // Skip empty lines
    });

    if (errors.length === 0) {
      const requiredFields = ['Player Name', 'Position']; // Add other required fields
      const missingFields = requiredFields.filter((field) => !Object.keys(data[0]).includes(field));

      if (missingFields.length === 0) {
        return { data, errors: [] };
      } else {
        return { data: null, errors: [`Missing fields: ${missingFields.join(', ')}`] };
      }
    } else {
      return { data: null, errors: ['Error parsing CSV data.'] };
    }
  } catch (error) {
    console.error('Error parsing CSV data:', error);
    return { data: null, errors: ['Error reading the file.'] };
  }
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
