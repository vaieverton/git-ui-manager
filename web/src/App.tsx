import { Dialog, Paper, Snackbar } from '@material-ui/core';
import { TextField, Button, Select, MenuItem, InputLabel } from '@mui/material';
import { Box } from '@mui/system';
import DoneIcon from '@mui/icons-material/Done';
import InfoIcon from '@mui/icons-material/Info';
import React, { useEffect, useState } from 'react';
import useStyles from './globalStyles';
import { connectToRepo, getStatus, getLog, getDiff, postCommit } from './services/Requests';
import { PageProps, SnackProps } from './models/Properties';
import GIT_LOGO from './images/Git-Icon-1788C.png';

const GIT_EMAIL = process.env.GIT_HUB_EMAIL || '';
const GIT_USER = process.env.GIT_HUB_USER;
const GIT_PASSWORD = process.env.GIT_HUB_PASSWORD;

const DefaultPageValues = {
  repositoryPath: 'repo2',
  connectedToRepo: false,
  current_branch: '0',
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

  const [content, setContent] = useState<JSX.Element | string>(<></>);

  const connectToRepository = async () => {
    await connectToRepo(appValues.repositoryPath)
      .then(response => {
        setAppValues({
          connectedToRepo: true,
          branches: response.data.branches,
          repositoryPath: appValues.repositoryPath,
          author: GIT_EMAIL,
          current_branch: response.data.branch
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

  const gitLog = async () => {
    await getLog(appValues.current_branch)
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

  useEffect(() => {
    const log = async () => {
      if (appValues.current_branch !== '0') {
        await gitLog();
      }
    };
    log();
  }, [appValues.current_branch])

  const gitStatus = async () => {
    await getStatus()
      .then(response => setContent(response.data.status))
  };

  const gitDiff = async () => {
    await getDiff()
      .then(response => setContent(response.data.message))
  };

  const handleBranchChange = (e: any) => {
    setAppValues(values => ({ ...values, current_branch: e.target.value }));
  };

  const gitCommit = async (message: string) => {
    await postCommit(message, GIT_EMAIL)
      .then(response => {
        setSnackState({
          message: response.data.message,
          open: true,
        });
        setCommitOpen(false);
        gitLog();
      })
      .catch(error => setSnackState({
        message: error.response,
        open: true,
      }))
  }

  const gitChanges = async () => {
    let logResult = [];
    await getLog(appValues.current_branch).then(response => { logResult = response.data.message.split('*') })
  }

  const connectionHandler = async () => {
    if (appValues.connectedToRepo) {
      setAppValues(DefaultPageValues);
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

          <Button
            type="button"
            variant='contained'
            onClick={() => gitCommit(commitMessage)}
          >
            Commit!
          </Button>

        </Paper>
      </Dialog>
    )
  }

  return (
    <div className={classes.root}>
      <Box className={classes.flexRow} >
        <h1>Git Manager&nbsp;</h1>
        <img src={GIT_LOGO} alt="-" className={classes.iconSize} />
      </Box>

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
          {appValues.connectedToRepo ? 'Disconnect' : 'Connect to repository'}
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
              value={appValues.current_branch}
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
              disabled={appValues.current_branch === '0'}
              onClick={gitLog}
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

            <Button
              type="button"
              variant="contained"
              onClick={gitDiff}
              className={classes.button}
            >
              Changes
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
