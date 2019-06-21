import fetch from 'commons/utils/request';

export async function login({ username, password }) {
  return fetch.post('/api/login', {
    username,
    password
  });
}
