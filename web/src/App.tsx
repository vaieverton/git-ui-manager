import { TextField, Button, Select, MenuItem, InputLabel } from '@mui/material';
import React, { useState } from 'react';
import api from './api';

function App() {
  const [repositoryPath, setRepositoryPath] = useState('repo1');

  const [connectedToRepo, setConnectedToRepo] = useState(false);

  const [branch, setBranch] = useState('0');

  const [branches, setBranches] = useState<string[]>([]);

  const [log, setLog] = useState<string>('');

  const connectToRepo = async () => {
    return api.post('/get_repository_path', {
      repository: repositoryPath,
    }).then((response) => {
      setConnectedToRepo(true);
      setBranches(response.data.branches)
    })
  }

  const makeGitLog = async () => {
    return api.get('/make_log', {
      params: {
        branch,
        repository: repositoryPath,
      }
    }).then(response => setLog(response.data.message))
      .catch(error => error.response);
  }

  const handleBranchChange = (e: any) => {
    setBranch(e.target.value)
  }

  return (
    <div className="App">
      <h1>Git Manager</h1>

      <TextField
        type="text"
        placeholder="Repository name"
        value={repositoryPath}
        onChange={(e) => setRepositoryPath(e.target.value)}
      />

      <Button
        type="button"
        variant="contained"
        onClick={connectToRepo}
      >
        Connect to repository
      </Button>

      {connectedToRepo && (<>Successfuly connected to repository</>)}

      {connectedToRepo && (
        <div>
          <InputLabel id="demo-simple-select-label">Branch</InputLabel>

          <Select
            id="demo-simple-select"
            value={branch}
            placeholder="Select repository branch"

            onChange={handleBranchChange}
          >
            <MenuItem value="0" disabled>Select branch</MenuItem>
            {branches.map((branch_name) => <MenuItem value={branch_name}>{branch_name}</MenuItem>)}
          </Select>

          <Button
            type="button"
            onClick={makeGitLog}
          >
            git log
          </Button>
        </div>
      )}

      <div>{log.split('*').map((item) => {
        return <p>{item}</p>
      })}</div>
    </div>
  );
}

export default App;
