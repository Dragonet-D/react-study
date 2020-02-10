import { routerRedux } from 'dva';
import tokenHelper from 'utils/tokenHelper';
import userHelper from 'utils/userHelper';
import { login, loginAD, getIdpParameterApi, initIdpApi, adfsLoginApi } from 'api/identify';
import { getForgotPasswordAPI } from 'api/user';
import msg from 'utils/messageCenter';
import { reloadAuthorized } from 'utils/Authorized';
import _ from 'lodash';
import { autoUpdateSession, isSuccess } from 'utils/helpers';

export default {
  namespace: 'user',
  state: {
    adfsLoginUrl: ''
  },
  effects: {
    *login({ payload }, { call, put }) {
      const { userName, password } = payload;
      const result = yield call(login, userName, password);
      if (
        !!result &&
        result.status === 200 &&
        result.data &&
        result.data.access_token &&
        result.data.user_info
      ) {
        const identify = {};
        const featureInfo = result.data.user_info.feature_info;
        identify.isValid = !!result.data.access_token;
        identify.auditLogId = result.data.AuditLogId;
        identify.tokenid = result.data.access_token;
        identify.userInfo = result.data.user_info;
        identify.code = result.data.code;
        identify.deviceAddress = result.data.clientIp;
        identify.AD_User = result.data.AD_User;
        identify.approvalRequest = result.data.Approval_Request;
        identify.pendingRequest = result.data.Pending_Request;

        if (!_.isEmpty(featureInfo)) {
          identify.permissions = Object.values(featureInfo)[0].map(item => item[1]);
        } else {
          identify.permissions = [];
        }
        if (identify.userInfo.passwordExpired === 'Y') {
          msg.warn('The password is already expired. Please change the password', 'login');
        }
        if (
          identify.approvalRequest &&
          Number(identify.pendingRequest) > 0 &&
          identify.userInfo.restPassword === 'Y'
        ) {
          msg.info('You have pending request for approval', 'login');
        }

        tokenHelper.set(identify.tokenid);
        userHelper.set(JSON.stringify(identify));
        reloadAuthorized();
        autoUpdateSession();
        if (result.data.access_token && result.data.user_info.restPassword === 'N') {
          yield put(routerRedux.push('/user/reset-password'));
          return;
        }

        if (
          identify.permissions.length === 0 ||
          identify.userInfo.roleIds.length === 0 ||
          identify.userInfo.roleIds[0] === 'ed74be5d-246a-4b1d-a5f4-21aad40ac70d'
        ) {
          yield put(routerRedux.push('/unauthorized/home'));
          return;
        }

        yield put(routerRedux.push('/'));
        const userId = _.get(result.data, 'user_info.userId', '');
        yield put({
          type: 'global/setLoggedUserInfo',
          userLoggedInfo: identify
        });
        yield put({
          type: 'global/getUserInfo',
          payload: {
            userId
          }
        });
        yield put({
          type: 'global/setUserId',
          payload: {
            userId
          }
        });
        yield put({
          type: 'global/connectCommonWebSocket',
          payload: userId
        });
      } else if (result) {
        msg.error(result.message, 'Login');
      }
    },
    *loginAD({ payload }, { put, call }) {
      const { userName, password, adName } = payload;
      const result = yield call(loginAD, userName, password, adName);
      if (
        !!result &&
        result.status === 200 &&
        result.data &&
        result.data.access_token &&
        result.data.user_info
      ) {
        const identify = {};
        let permissions = [];
        const featureInfo = result.data.user_info.feature_info;
        identify.isValid = !!result.data.access_token;
        identify.auditLogId = result.data.AuditLogId;
        identify.tokenid = result.data.access_token;
        identify.userInfo = result.data.user_info;
        identify.code = result.data.code;
        identify.deviceAddress = result.data.clientIp;
        identify.AD_User = result.data.AD_User;
        identify.approvalRequest = result.data.Approval_Request;
        identify.pendingRequest = result.data.Pending_Request;
        for (const key in featureInfo) {
          permissions = permissions.concat(...featureInfo[key]);
        }
        identify.permissions = permissions;
        tokenHelper.set(identify.tokenid);
        userHelper.set(JSON.stringify(identify));
        // login success
        reloadAuthorized();
        autoUpdateSession();
        yield put(routerRedux.push('/'));
        const userId = _.get(result.data, 'user_info.userId', '');
        // save user infos
        yield put({
          type: 'global/getUserInfo',
          payload: {
            userId
          }
        });
        yield put({
          type: 'global/setUserId',
          payload: {
            userId
          }
        });
      } else {
        msg.error(result.message, 'Login');
      }
    },
    *loginADFS({ payload }, { call, put }) {
      const { id } = payload;
      const result = yield call(adfsLoginApi, id);
      if (
        result &&
        result.status === 200 &&
        result.data &&
        result.data.access_token &&
        result.data.user_info
      ) {
        const identify = {};
        const featureInfo = result.data.user_info.feature_info || {};
        identify.isValid = !!result.data.access_token;
        identify.auditLogId = result.data.AuditLogId;
        identify.tokenid = result.data.access_token;
        identify.userInfo = result.data.user_info;
        identify.code = result.data.code;
        identify.deviceAddress = result.data.clientIp;
        identify.AD_User = result.data.AD_User;
        identify.approvalRequest = result.data.Approval_Request;
        identify.pendingRequest = result.data.Pending_Request;

        if (!_.isEmpty(featureInfo)) {
          identify.permissions = Object.values(featureInfo)[0].map(item => item[1]);
        } else {
          identify.permissions = [];
        }
        if (
          identify.approvalRequest &&
          Number(identify.pendingRequest) > 0 &&
          identify.userInfo.restPassword === 'Y'
        ) {
          msg.info('You have pending request for approval', 'login');
        }

        tokenHelper.set(identify.tokenid);
        userHelper.set(JSON.stringify(identify));

        reloadAuthorized();
        autoUpdateSession();

        if (
          identify.permissions.length === 0 ||
          identify.userInfo.roleIds.length === 0 ||
          identify.userInfo.roleIds[0] === 'ed74be5d-246a-4b1d-a5f4-21aad40ac70d'
        ) {
          yield put(routerRedux.push('/unauthorized/home'));
          return;
        }

        yield put(routerRedux.push('/'));
        const userId = _.get(result.data, 'user_info.userId', '');
        yield put({
          type: 'global/setLoggedUserInfo',
          userLoggedInfo: identify
        });
        yield put({
          type: 'global/getUserInfo',
          payload: {
            userId
          }
        });
        yield put({
          type: 'global/setUserId',
          payload: {
            userId
          }
        });
        yield put({
          type: 'global/connectCommonWebSocket',
          payload: userId
        });

        history.push('/');
      } else if (result) {
        msg.error(result.message, 'Login');
      }
    },
    *initIdpDataOfADFS(_, { call, put }) {
      const result = yield call(getIdpParameterApi);

      if (result && result.status === 200 && result.data) {
        const IDPResult = yield call(initIdpApi, result.data.idpParameter);

        if (IDPResult && IDPResult.status === 200 && IDPResult.data) {
          yield put({
            type: 'setADFSLoginUrl',
            payload: {
              url: IDPResult.data.adfsLoginUrl
            }
          });
        } else {
          msg.error(result.message || 'Get IDP failure', 'Login');
        }
      } else {
        msg.error(result.message || 'Failed to get IDP Parameter', 'Login');
      }
    },
    *findBackPassword({ payload }, { call }) {
      const { object } = payload;
      const result = yield call(getForgotPasswordAPI, object);
      if (isSuccess(result)) {
        msg.success(
          result.message || 'The default password send successfully',
          'Find Back Password'
        );
      } else {
        msg.error(result.message, 'Find Back Password');
      }
    }
  },
  reducers: {
    setADFSLoginUrl(state, { payload }) {
      return {
        ...state,
        adfsLoginUrl: payload.url
      };
    }
  }
};
