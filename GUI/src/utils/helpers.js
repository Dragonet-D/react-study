import store from '@/index';
import { UPDATE_SESSION_TIMER } from 'commons/constants/const';
import msg from './messageCenter';

let timer = null;

// judge if the request success
function isSuccess(result) {
  return result && result.status === 200;
}

// handle updated
function dataUpdatedHandle(data, source, callback = () => {}) {
  if (isSuccess(data)) {
    msg.success(data.message, source);
    callback(data);
  } else if (data) {
    msg.error(data.message, source);
  }
}

function autoUpdateSession() {
  const timer1 = setTimeout(() => {
    store.dispatch({
      type: 'global/updateSession'
    });
  }, 1000 * 60 * 10);
  timer = setInterval(() => {
    if (timer1) {
      clearTimeout(timer1);
    }
    store.dispatch({
      type: 'global/updateSession'
    });
  }, UPDATE_SESSION_TIMER);
}

function clearAutoUpdateSession() {
  if (timer) {
    clearInterval(timer);
  }
}

export { isSuccess, dataUpdatedHandle, autoUpdateSession, clearAutoUpdateSession };
