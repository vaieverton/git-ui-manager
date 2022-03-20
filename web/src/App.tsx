import { Dialog, Paper, Snackbar } from '@material-ui/core';
import { TextField, Button, Select, MenuItem, InputLabel } from '@mui/material';
import { Box } from '@mui/system';
import DoneIcon from '@mui/icons-material/Done';
import InfoIcon from '@mui/icons-material/Info';
import React, { useState } from 'react';
import useStyles from './globalStyles';
import { connectToRepo, getStatus, getLog, getDiff } from './Requests';
import { PageProps, SnackProps } from './Properties';

const GIT_EMAIL = 'everton.scorpion@hotmail.com';
const GIT_USER = 'vaieverton';
const GIT_PASSWORD = 'Saolazaroam123!';

const DefaultPageValues = {
  repositoryPath: 'repo2',
  connectedToRepo: false,
  branches: [],
  author: GIT_EMAIL
} as PageProps;

const DefaultSnack = {
  open: false,
  message: '',
} as SnackProps;

function App() {
  const classes = useStyles();

  const [appValues, setAppValues] = useState<PageProps>(DefaultPageValues);
  const [snackState, setSnackState] = useState<SnackProps>(DefaultSnack);
  const [commitOpen, setCommitOpen] = useState(false);

  const [branch, setBranch] = useState('0');

  const [content, setContent] = useState<JSX.Element | string>(<></>);

  const connectToRepository = async () => {
    await connectToRepo(appValues.repositoryPath)
      .then(response => {
        setAppValues({
          connectedToRepo: true,
          branches: response.data.branches,
          repositoryPath: appValues.repositoryPath,
          author: GIT_EMAIL,
        });
        setSnackState({
          message: 'Successfully connected to repository',
          open: true,
        });
      }).catch(error => setSnackState({
        open: true,
        message: 'Not connected. Check if your path is correct, or if your repository exists'
      }));
  };

  const gitLogRepository = async () => {
    await getLog(branch)
      .then(response => setContent(response.data.message.split('*').map((item: any) => {
        return <p>{item}</p>
      })))
      .catch(error => {
        setSnackState({
          open: true,
          message: 'Failed to log. Check your path to the repository.'
        })
      });
  };

  const gitStatus = async () => {
    await getStatus()
      .then(response => setContent(response.data.status))
  };

  const gitDiff = async () => {
    await getDiff()
      .then(response => setContent(response.data.message))
  };

  const handleBranchChange = (e: any) => {
    setBranch(e.target.value);
  };

  const connectionHandler = async () => {
    if (appValues.connectedToRepo) {
      setAppValues({
        connectedToRepo: false,
        repositoryPath: '',
        branches: [],
        author: GIT_EMAIL,
      })
      setSnackState({ message: 'Disconnected from repository', open: true });
    } else {
      await connectToRepository();
    }
  };

  const CommitDialog = () => {
    const [commitMessage, setCommitMessage] = useState('');

    return (
      <Dialog
        open={commitOpen}
        onClose={() => setCommitOpen(false)}
      >
        <Paper>
          <h6>Commit</h6>

          <TextField
            type="text"
            placeholder="Commit Message"
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
          />

          <p>Files added:</p>

          <p>Files not added:</p>

          <Button type="button" variant='contained'>Commit!</Button>

        </Paper>
      </Dialog>
    )
  }

  return (
    <div className={classes.root}>
      <h1>Git Manager</h1>


      <Box className={classes.header}>
        <InputLabel>Repository Name <InfoIcon />: </InputLabel>
        <TextField
          type="text"
          placeholder="ex: project_1, filesbootcamp"
          disabled={appValues.connectedToRepo}
          value={appValues.repositoryPath}
          onChange={(e) => setAppValues(values => ({
            ...values,
            repositoryPath: e.target.value,
          }))}
          className={classes.input}
        />

        <Button
          type="button"
          variant="contained"
          color={appValues.connectedToRepo ? 'secondary' : 'primary'}
          onClick={connectionHandler}
          className={classes.buttonConnect}
        >
          {appValues.connectedToRepo ? 'Disconnet' : 'Connect to repository'}
        </Button>

        {appValues.connectedToRepo &&
          (<DoneIcon style={{ color: 'green' }} />)
        }

        <Snackbar
          open={snackState.open}
          autoHideDuration={3000}
          onClose={() => setSnackState({ message: '', open: false })}
          message={snackState.message}
        />
      </Box>

      {appValues.connectedToRepo && (
        <div>
          <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
            <InputLabel>Branch:</InputLabel>

            <Select
              value={branch}
              placeholder="Select repository branch"
              onChange={handleBranchChange}
            >
              <MenuItem value="0" disabled>Select branch</MenuItem>
              {appValues.branches.map((branch_name) =>
                <MenuItem value={branch_name}>{branch_name}</MenuItem>)}
            </Select>
          </Box>

          <Box className={classes.actionButton}>
            <Button
              type="button"
              variant="contained"
              disabled={branch === '0'}
              onClick={gitLogRepository}
              className={classes.button}
            >
              Log
            </Button>

            <Button
              type="button"
              variant="contained"
              onClick={gitStatus}
              className={classes.button}
            >
              Status
            </Button>

            <Button
              type="button"
              variant="contained"
              onClick={() => setCommitOpen(true)}
              className={classes.button}
            >
              Commit
            </Button>

            <Button
              type="button"
              variant="contained"
              onClick={gitDiff}
              className={classes.button}
            >
              Diff
            </Button>

            <CommitDialog />
          </Box>
        </div>
      )}

      <Paper>
        {appValues.connectedToRepo ? content : null}
      </Paper>
    </div>
  );
};

export default App;
