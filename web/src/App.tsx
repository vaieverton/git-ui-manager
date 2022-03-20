import { TextField, Button, Select, MenuItem, InputLabel } from '@mui/material';
import React, { useState } from 'react';
import useStyles from './globalStyles';
import { connectToRepo, getStatus, getLog } from './Requests';

function App() {
  const classes = useStyles();

  const [repositoryPath, setRepositoryPath] = useState('repo1');

  const [connectedToRepo, setConnectedToRepo] = useState(false);

  const [branch, setBranch] = useState('0');

  const [branches, setBranches] = useState<string[]>([]);

  const [content, setContent] = useState<JSX.Element>(<></>);


  const connectToRepository = async () => {
    await connectToRepo(repositoryPath)
      .then(response => {
        setConnectedToRepo(true);
        setBranches(response.data.branches);
      }).catch(error => console.log(error.response));
  };

  const gitLogRepository = async () => {
    await getLog(branch)
      .then(response => setContent(response.data.message.split('*').map(item => {
        return <p>{item}</p>
      })))
      .catch(error => console.log(error.response));
  };

  const gitStatus = async () => {
    await getStatus()
      .then(response => setContent(<p>{response.data.status}</p>))
  }

  const handleBranchChange = (e: any) => {
    setBranch(e.target.value);
  }

  return (
    <div className={classes.root}>
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
        onClick={connectToRepository}
      >
        Connect to repository
      </Button>

      {connectedToRepo &&
        (<p>Successfuly connected to repository!</p>)}

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
            onClick={gitLogRepository}
          >
            Git Log
          </Button>

          <Button
            type="button"
            onClick={gitStatus}
          >
            Git Status
          </Button>
        </div>
      )}

      {content}
    </div>
  );
}

export default App;
