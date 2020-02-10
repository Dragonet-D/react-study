import store from '../index';

// common message center

let id = 0;
function error(message, source) {
  messageCommon(message, source, 'error');
}

function info(message, source) {
  messageCommon(message, source, 'info');
}

function warn(message, source) {
  messageCommon(message, source, 'warning');
}

function success(message, source) {
  messageCommon(message, source, 'success');
}

function messageCommon(message, source, messageType) {
  id += 1;
  store.dispatch({
    type: 'messageCenter/sendMessage',
    payload: {
      source,
      message,
      id,
      unread: true,
      messageType
    }
  });
}

// websocket message center

let wsId = 0;

function wsMessageCommon(message, type) {
  wsId += 1;
  store.dispatch({
    type: 'messageCenter/sendMessage2',
    payload: {
      message,
      key: wsId,
      unread: true,
      type
    }
  });
}

function wsError(message) {
  wsMessageCommon(message, 'error');
}

function wsInfo(message) {
  wsMessageCommon(message, 'info');
}

function wsWarn(message) {
  wsMessageCommon(message, 'warning');
}

function wsSuccess(message) {
  wsMessageCommon(message, 'success');
}

export default { error, info, warn, success, wsError, wsInfo, wsWarn, wsSuccess };
