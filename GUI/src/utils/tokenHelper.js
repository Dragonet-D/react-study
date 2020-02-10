import { TOKEN_KEY } from './const';

function set(token) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

function get() {
  return sessionStorage.getItem(TOKEN_KEY);
}

function remove() {
  sessionStorage.removeItem(TOKEN_KEY);
}

export default {
  set,
  get,
  remove
};
