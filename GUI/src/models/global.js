import ReconnectingWebSocket from 'reconnecting-websocket';
import {
  getUserInfoByUserIdApi,
  updateUserApi,
  getPwdPolicyAPI,
  userOldPwdCheckAPI
} from 'api/user';
import { logout, updateSessionApi, getADFSLogoutUrlApi } from 'api/identify';
import tokenHelper from 'utils/tokenHelper';
import userHelper from 'utils/userHelper';
import { isSuccess } from 'utils/helpers';
import { reloadAuthorized } from 'utils/Authorized';
import { MSG_BUS_HEARTBEAT_INTERVAL } from 'commons/constants/const';
import { routerRedux } from 'dva';
import msg from 'utils/messageCenter';
import store from '@/index';
import getUrls from '../utils/urls/index';

let messageBusOfCommon = null;
let missedHeartbeats = 0;
const urls = getUrls.websocket;

function disConnect() {
  if (messageBusOfCommon && messageBusOfCommon.close) {
    messageBusOfCommon.close();
  }
}

function formatNotificationInfo(msg) {
  let content = {};
  if (msg.notificationContent) {
    const notificationContent = JSON.parse(msg.notificationContent);
    content = {
      ...msg,
      notificationContent
    };
  }
  return content;
}

function alarmLevel(d) {
  const content = formatNotificationInfo(d);
  const alarmType = content.notificationContent && content.notificationContent.alarmSeverity;
  if (alarmType === 'Critical') {
    msg.wsError(content);
  }
  if (alarmType === 'Major') {
    msg.wsWarn(content);
  }
  if (alarmType === 'Minor') {
    msg.wsInfo(content);
  }
}

function parseJson(data) {
  try {
    return JSON.parse(data);
  } catch (e) {
    return data;
  }
}

export default {
  namespace: 'global',
  state: {
    userInfo: {},
    userId: '',
    time: '',
    passwordPolicy: [],
    dialogStatus: {
      passwordDialogIsClose: false,
      profileDialogIsClose: false
    },
    theme: JSON.parse(userHelper.settingGet() || '{}').theme || 'Cyan.DARK_THEME',
    commonWebsocketData: {}
  },
  effects: {
    *getUserInfo({ payload }, { call, put }) {
      const result = yield call(getUserInfoByUserIdApi, payload.userId);
      if (isSuccess(result)) {
        yield put({
          type: 'getUserInfoSuccess',
          userInfo: result.data
        });

        yield put({
          type: 'initSystemTime',
          payload: {
            data: result.time
          }
        });
      } else {
        msg.error(result.message, 'User Information');
      }
    },
    *logout({ payload }, { call }) {
      const { auditUuid, userId } = payload;
      const result = yield call(logout, auditUuid, userId);
      if (!!result && result.status === 200) {
        if (result.data && result.data.isADFSUser) {
          const adfsResult = yield call(getADFSLogoutUrlApi);

          if (adfsResult && adfsResult.status === 200) {
            const url = adfsResult.data.idpLogoutUri;
            window.location.href = url;
            tokenHelper.remove();
            userHelper.remove();
            reloadAuthorized();
          } else {
            tokenHelper.remove();
            userHelper.remove();
            reloadAuthorized();
            window.location.reload();
            msg.error(adfsResult.message || 'Unkown error');
          }
        } else {
          tokenHelper.remove();
          userHelper.remove();
          reloadAuthorized();
          window.location.reload();
        }
      }
    },
    *connectCommonWebSocket({ payload }) {
      const messageBusOfCommonUrl = urls.messageBusOfCommon.url;
      const user = JSON.parse(userHelper.get());
      messageBusOfCommon = yield new ReconnectingWebSocket(
        `${messageBusOfCommonUrl}?id=${payload}`,
        [],
        {
          maxRetries: 5
        }
      );
      messageBusOfCommon.addEventListener('open', () => {
        const ticket = { flag: messageBusOfCommonUrl, data: 'Hello WebSocket!' };
        if (messageBusOfCommon) {
          try {
            messageBusOfCommon.send(JSON.stringify(ticket));
          } catch (e) {
            throw new Error(e);
          }
          let heartbeatInterval = null;
          const inv = MSG_BUS_HEARTBEAT_INTERVAL; // retry every 30 sec
          if (inv > 0) {
            missedHeartbeats = 0;
            heartbeatInterval = setInterval(() => {
              try {
                missedHeartbeats++;
                if (missedHeartbeats >= 3) {
                  throw new Error('Too many missed heartbeats.');
                }
                messageBusOfCommon.send(JSON.stringify(ticket));
                missedHeartbeats = 0;
              } catch (e) {
                clearInterval(heartbeatInterval);
                heartbeatInterval = null;
                disConnect();
              }
            }, inv);
          }
        }
      });

      messageBusOfCommon.addEventListener('message', e => {
        const data = JSON.parse(e.data || '{}');
        missedHeartbeats = 0;
        store.dispatch({
          type: 'global/triggerCommonWebsocketData',
          commonWebsocketData: data
        });
        if (data.type === 'alarm') {
          if (data.data) {
            alarmLevel(data.data);
          }
        } else if (data.type === 'device') {
          msg.info(data.message || 'Your current Camera session was disconnected by others');
        } else if (data.type === 'download') {
          if (data.data) {
            const info = JSON.parse(data.data);
            // console.log('dataDownload: ', info);
            // hide progress bar whether succ or fail
            if (info.clippingId) {
              store.dispatch({
                type: 'messageCenter/delProgressBar',
                id: info.clippingId
              });
            } else if (info.taskId) {
              store.dispatch({
                type: 'messageCenter/delProgressBar',
                id: info.taskId
              });
            }
            // pop err msg when time out or server down
            if (!info.status) {
              msg.error(info.message || 'Download Failure');
            } else {
              if (!info.url) return;
              const a = document.createElement('a');
              a.href = info.url;
              a.click();
            }
          }
        } else if (data.type === 'request') {
          const refreshRequestCount = parseJson(data.data).Pending_Request;
          user.pendingRequest = refreshRequestCount;
          userHelper.set(JSON.stringify(user));
          if (data.message && data.message !== '') {
            store.dispatch(msg.info(data.message || 'You have pending request for approval'));
          }
        }
      });

      messageBusOfCommon.addEventListener('error', e => {
        // eslint-disable-next-line no-console
        console.error(`websocket error: ${e}`);
      });

      messageBusOfCommon.addEventListener('close', () => {
        messageBusOfCommon = null;
        // eslint-disable-next-line no-console
        console.info('Message bus disconnected.');
      });
    },
    *disConnectCommonWebSocket() {
      yield disConnect();
    },
    *updateSession(_, { call }) {
      const result = yield call(updateSessionApi);
      if (isSuccess(result)) {
        tokenHelper.set(result.data);
      }
    },
    *updateUserInformation({ payload }, { call, put }) {
      const { info } = payload;
      const result = yield call(updateUserApi, info);
      let identify = '';
      if (isSuccess(result)) {
        // update userinfo in identify
        if (userHelper.get()) {
          identify = JSON.parse(userHelper.get());
          identify.userInfo.userFullName = info.userFullName;
          userHelper.set(JSON.stringify(identify));
        }
        msg.success(result.message, 'User Profile');
        yield put({
          type: 'closeProfileDialog',
          payload: {
            data: true
          }
        });
        yield put({
          type: 'getUserInfo',
          payload: {
            userId: info.lastUpdatedId
          }
        });
      } else {
        msg.error(result.message, 'User Profile');
      }
    },
    *getPasswordPolicy(_, { call, put }) {
      const result = yield call(getPwdPolicyAPI);

      if (isSuccess(result)) {
        yield put({
          type: 'getPasswordPolicySuccess',
          payload: {
            data: result.data.policyDetails
          }
        });
      } else {
        msg.error(result.message, 'Password Policy');
      }
    },
    *updatePassword({ payload }, { call, put }) {
      const { oldpwd, newpwd } = payload;
      const user = JSON.parse(userHelper.get() || false);
      const userId = user && user.userInfo && user.userInfo.userId;

      const result = yield call(userOldPwdCheckAPI, oldpwd, newpwd, userId);

      const restPassword = user && user.userInfo && user.userInfo.restPassword;
      if (result && result.status && result.status === 200 && result.message === 'Success') {
        msg.success(result.message, 'Change Password');
        yield put({
          type: 'closePasswordDialog',
          payload: {
            data: true
          }
        });

        tokenHelper.remove();
        userHelper.remove();
        store.dispatch(routerRedux.push('/user/login'));
      } else {
        msg.error(result.message, 'Change Password');
        if (restPassword === 'N') {
          yield put({
            type: 'closePasswordDialog',
            payload: {
              data: false
            }
          });
        }
      }
    }
  },
  reducers: {
    triggerCommonWebsocketData(state, { commonWebsocketData }) {
      return {
        ...state,
        commonWebsocketData
      };
    },
    getUserInfoSuccess(state, { userInfo }) {
      return {
        ...state,
        userInfo
      };
    },
    setUserId(state, { payload }) {
      return {
        ...state,
        userId: payload.userId
      };
    },
    initSystemTime(state, { payload }) {
      return {
        ...state,
        time: payload.data
      };
    },
    getPasswordPolicySuccess(state, { payload }) {
      return {
        ...state,
        passwordPolicy: payload.data
      };
    },
    closePasswordDialog(state, { payload }) {
      return {
        ...state,
        dialogStatus: {
          ...state.dialogStatus,
          passwordDialogIsClose: payload.data
        }
      };
    },
    closeProfileDialog(state, { payload }) {
      return {
        ...state,
        dialogStatus: {
          ...state.dialogStatus,
          profileDialogIsClose: payload.data
        }
      };
    },
    changeTheme(state, { payload }) {
      return {
        ...state,
        theme: payload
      };
    }
  },
  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    }
  }
};
