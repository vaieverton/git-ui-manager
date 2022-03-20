import api from './api';

export const connectToRepo = (path: string) => {
  return api.post('/get_repository_path', {
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

export const getStatus = () => {
  return api.get('/git_status');
}