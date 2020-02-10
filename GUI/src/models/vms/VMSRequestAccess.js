import { isSuccess } from 'utils/helpers';
import {
  channelGroupTree,
  initAccessRequestApi,
  initAllGroupsApi,
  createRequestApi,
  updateRequestApi,
  getUserPermission
} from 'api/vms';
import msgCenter from 'utils/messageCenter';
import tools from 'utils/treeTools';
import { formatFeatureLayerNormalData } from 'commons/map/utils';

export default {
  namespace: 'VMSRequestAccess',
  state: {
    namespace: 'VMSRequestAccess'
  },
  effects: {
    *getChannelListData({ userId }, { call, put }) {
      const result = yield call(channelGroupTree, userId);
      const data = tools.formatSensorList({ data: result.data, search: '' });
      if (isSuccess(result)) {
        yield put({
          type: 'getChannelListDataSuccess',
          listData: formatFeatureLayerNormalData(data)
        });
      } else if (result) {
        msgCenter.error(result.message, 'Request Access');
      }
    },
    *getRequestList({ payload }, { call, put }) {
      const result = yield call(initAccessRequestApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getRequestListSuccess',
          requestDataSource: result.data
        });
      } else if (result) {
        msgCenter.error(result.message, 'Request Access');
      }
    },
    *getGroupDataSource({ payload }, { call, put }) {
      const result = yield call(initAllGroupsApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getGroupDataSourceSuccess',
          groupDataSource: result.data
        });
      } else if (result) {
        msgCenter.error(result.message, 'Request Access');
      }
    },
    *createRequest({ payload }, { call }) {
      const result = yield call(createRequestApi, payload);
      if (isSuccess(result)) {
        return result;
      } else if (result) {
        msgCenter.error(result.message, 'Request Access');
      }
    },
    *updateRequest({ payload }, { call }) {
      const result = yield call(updateRequestApi, payload);
      if (isSuccess(result)) {
        return result;
      } else if (result) {
        msgCenter.error(result.message, 'Request Access');
      }
    },
    *getUserPermission({ payload }, { call }) {
      const result = yield call(getUserPermission, payload);
      if (isSuccess(result)) {
        return result;
      } else if (result) {
        msgCenter.error(result.message, 'Request Access');
      }
    }
  },
  reducers: {
    getChannelListDataSuccess(state, { listData }) {
      return {
        ...state,
        channelData: listData
      };
    },
    getRequestListSuccess(state, { requestDataSource }) {
      return {
        ...state,
        requestDataSource
      };
    },
    getGroupDataSourceSuccess(state, { groupDataSource }) {
      return {
        ...state,
        groupDataSource
      };
    }
  }
};
