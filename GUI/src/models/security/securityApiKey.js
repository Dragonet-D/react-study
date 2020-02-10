import {
  getApiKeyListApi,
  createApikeyApi,
  deleteApiKeyApi,
  getApiKeyApi,
  isPostponeApi,
  assignRoleApi,
  assignGroupApi,
  getVapRoleListApi,
  generateApiKeyApi
} from 'api/securityApiKey';
import { initRolesApi, roleFeaturelistApi } from 'api/securityRoleManagement';
import { isSuccess } from 'utils/helpers';
import msg from 'utils/messageCenter';
import tools from './utils';

const msgTitle = 'Security Api Key';
export default {
  namespace: 'securityApiKey',
  state: {
    apiKeyList: { items: [], pageNo: 0, pageSize: 0, totalNum: 0 },
    roleData: {},
    groupData: {},
    featureData: {},
    featureTreeData: []
  },
  effects: {
    *getApiKeyList({ payload }, { call }) {
      const result = yield call(getApiKeyListApi, payload);
      return result;
    },
    *createApikey({ payload }, { call }) {
      const result = yield call(createApikeyApi, payload);
      return result;
    },
    *deleteApiKey({ payload }, { call }) {
      const result = yield call(deleteApiKeyApi, payload);
      return result;
    },
    *getApiKey({ payload }, { call }) {
      const result = yield call(getApiKeyApi, payload);
      return result;
    },
    *isPostpone({ payload }, { call }) {
      const result = yield call(isPostponeApi, payload);
      return result;
    },
    *getRoleData({ payload }, { call, put }) {
      const result = yield call(initRolesApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getRoleDataSuccess',
          payload: {
            data: result.data
          }
        });
      } else if (result) {
        msg.error(result.message, msgTitle);
      }
    },
    *getVapRoleList(_, { call, put }) {
      const result = yield call(getVapRoleListApi);
      if (isSuccess(result)) {
        yield put({
          type: 'getRoleDataSuccess',
          payload: {
            data: result.data
          }
        });
      } else if (result) {
        msg.error(result.message, msgTitle);
      }
    },
    *getFeatureData({ payload }, { call, put }) {
      const result = yield call(roleFeaturelistApi, payload.roleId, payload.userId);
      if (isSuccess(result)) {
        const dataList = result.data.filter(item => item.statusPlus === 'Y');
        yield put({
          type: 'getFeatureDataSuccess',
          payload: {
            data: dataList
          }
        });
      } else if (result) {
        msg.error(result.message, msgTitle);
      }
    },
    *assignRole({ payload }, { call }) {
      const result = yield call(assignRoleApi, payload);
      return result;
    },
    *assignGroup({ payload }, { call }) {
      const result = yield call(assignGroupApi, payload);
      return result;
    },
    *generateApiKey({ payload }, { call }) {
      const result = yield call(generateApiKeyApi, payload);
      return result;
    }
  },
  reducers: {
    getRoleDataSuccess(state, { payload }) {
      return {
        ...state,
        roleData: payload.data
      };
    },
    getFeatureDataSuccess(state, { payload }) {
      return {
        ...state,
        featureData: payload.data,
        featureTreeData: tools.getTreeData(payload.data)
      };
    },
    getGroupDataSuccess(state, { payload }) {
      return {
        ...state,
        groupData: payload.data
      };
    }
  }
};
