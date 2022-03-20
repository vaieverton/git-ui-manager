import { Paper } from '@material-ui/core';
import { TextField, Button, Select, MenuItem, InputLabel } from '@mui/material';
import { Box } from '@mui/system';
import DoneIcon from '@mui/icons-material/Done';
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
      .then(response => setContent(response.data.message.split('*').map((item: any) => {
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

      <Box className={classes.header}>
        <InputLabel>Repository Name: </InputLabel>
        <TextField
          type="text"
          placeholder="Repository name"
          value={repositoryPath}
          onChange={(e) => setRepositoryPath(e.target.value)}
          className={classes.input}
        />

        <Button
          type="button"
          variant="contained"
          onClick={connectToRepository}
          className={classes.buttonConnect}
        >
          Connect to repository
        </Button>

        {connectedToRepo &&
        (<DoneIcon style={{color: 'green'}} />)}
      </Box>

      {connectedToRepo && (
        <div>
          <InputLabel>Branch</InputLabel>

          <Select
            id="demo-simple-select"
            value={branch}
            placeholder="Select repository branch"

            onChange={handleBranchChange}
          >
            <MenuItem value="0" disabled>Select branch</MenuItem>
            {branches.map((branch_name) => <MenuItem value={branch_name}>{branch_name}</MenuItem>)}
          </Select>

          <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>

            <Button
              type="button"
              variant="contained"
              onClick={gitLogRepository}
            >
              Log
            </Button>

            <Button
              type="button"
              variant="contained"
              onClick={gitStatus}
            >
              Status
            </Button>

            <Button
              type="button"
              variant="contained"
              onClick={gitStatus}
            >
              Commit
            </Button>
          </Box>
        </div>
      )}

      <Paper>
        {content}
      </Paper>
    </div>
  );
}

export default App;
