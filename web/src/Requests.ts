import api from './api';

export const connectToRepo = (path: string) => {
  return api.post('/connect_to_repo', {
    repository: path,
  })
}

export const getLog = (branch: string) => {
  return api.get('/make_log', {
    params: {
      branch,
    }
  });
}

export const getDiff = () => {
  return api.get('/get_diff');
}

export const getStatus = () => {
  return api.get('/git_status');
}