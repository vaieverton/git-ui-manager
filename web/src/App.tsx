import React, { useState } from 'react';

function App() {
  const [repositoryPath, setRepositoryPath] = useState('');

  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [isSelected, setIsSelected] = useState(false)

  const changeHandler = (event: any) => {
    setSelectedFile(event.target.files[0]);
    // setIsSelected(true);
  };
  return (
    <div className="App">
      <h1>Git Manager</h1>

      <input type="file" name="file" onChange={changeHandler} />
      {isSelected ? (
        <div>
          <p>Filename: {selectedFile.name}</p>
          <p>Filetype: {selectedFile.type}</p>
          <p>Size in bytes: {selectedFile.size}</p>
          <p>
            lastModifiedDate:{' '}
            {selectedFile.lastModifiedDate.toLocaleDateString()}
          </p>
        </div>
      ) : (
        <p>Select a file to show details</p>
      )}
      <div>
        <button onClick={handleSubmission}>Submit</button>
      </div>
    </div>
    </div >
  );
}

export default App;
