import request from 'commons/utils/request';

export function login(username, password) {
  return request('/api/login', {
    username,
    password
  });
}
