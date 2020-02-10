import { getUserDomainInfoApi, syncUpDomainApi } from 'api/securitySyncUpADAccounts';
import { isSuccess } from 'utils/helpers';
import msg from 'utils/messageCenter';

const msgTitle = 'Sync Up AD';

export default {
  namespace: 'securitySyncUpADAccounts',
  state: {
    createdNum: '',
    updatedNum: '',
    domainInfo: {},
    isSuccess: false,
    isPermission: false
  },
  effects: {
    *getDomainInformation({ payload }, { call, put }) {
      const { userId } = payload;
      const result = yield call(getUserDomainInfoApi, userId);
      if (isSuccess(result)) {
        yield put({
          type: 'getDomainInformationSuccess',
          payload: {
            data: result.data
          }
        });
        yield put({
          type: 'setPermission',
          payload: {
            data: true
          }
        });
      } else {
        if (result) {
          msg.error(result.message, msgTitle);
        }
        yield put({
          type: 'setPermission',
          payload: {
            data: false
          }
        });
      }
    },
    *updateDomainInformation({ payload }, { call, put }) {
      const { userId, domainName, pass } = payload;
      const result = yield call(syncUpDomainApi, userId, domainName, pass);
      if (isSuccess(result)) {
        yield put({
          type: 'initUsersInfo',
          payload: {
            data: result.data
          }
        });
        msg.success(result.message, 'Update Domain');
      } else if (result) {
        msg.error(result.message, msgTitle);
      }
    }
  },
  reducers: {
    getDomainInformationSuccess(state, { payload }) {
      return {
        ...state,
        domainInfo: payload.data
      };
    },
    initUsersInfo(state, { payload }) {
      return {
        ...state,
        createdNum: payload.data.created,
        updatedNum: payload.data.updated
      };
    },
    setPermission(state, { payload }) {
      return {
        ...state,
        isPermission: payload.data
      };
    }
  }
};
