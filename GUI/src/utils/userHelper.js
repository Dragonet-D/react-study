import { USER_KEY, SETTING_KEY } from './const';

// user information
function set(userInfo) {
  sessionStorage.setItem(USER_KEY, userInfo);
}

function get() {
  return sessionStorage.getItem(USER_KEY);
}

function remove() {
  sessionStorage.removeItem(USER_KEY);
}

// user settings
function settingSet(settings) {
  sessionStorage.setItem(SETTING_KEY, settings);
}

function settingGet() {
  return sessionStorage.getItem(SETTING_KEY);
}

function settingRemove() {
  sessionStorage.removeItem(SETTING_KEY);
}

export default {
  set,
  get,
  remove,
  settingSet,
  settingGet,
  settingRemove
};
