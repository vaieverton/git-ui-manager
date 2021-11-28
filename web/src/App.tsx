import React, { useState } from 'react';
import api from './api';

function App() {
  const [repositoryPath, setRepositoryPath] = useState('');

  const [connectedToRepo, setConnectedToRepo] = useState(false);

  const [branch, setBranch] = useState('');

  const [log, setLog] = useState<string[]>([]);

  const connectToRepo = async () => {
    return api.post('/get_repository_path', {
      repository: repositoryPath,
    }).then(() => {
      setConnectedToRepo(true);
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

  return (
    <div className="App">
      <h1>Git Manager</h1>

      <input type="text" placeholder="Repository name" value={repositoryPath} onChange={(e) => setRepositoryPath(e.target.value)} />

      <button type="button" onClick={connectToRepo}>Connect to repository</button>

      {connectedToRepo && (
        <div>
          <input type="text" value={branch} placeholder="branch" onChange={(e) => setBranch(e.target.value)} />

          <button type="button" onClick={makeGitLog}>git log</button>
        </div>
      )}

      <div>{log}</div>
    </div>
  );
}

export default App;
