import { isSuccess } from 'utils/helpers';
import {
  getApproveAccessListApi,
  getUserPermission,
  initRecordingChannelsApi,
  AddOrApproveRequestApi
} from 'api/vms';

import msgCenter from 'utils/messageCenter';

export default {
  namespace: 'VMSApproveAccess',
  state: {
    listDataSource: []
  },
  effects: {
    *getApproveAccessList({ payload }, { call, put }) {
      const result = yield call(getApproveAccessListApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getApproveAccessListSuccess',
          listDataSource: result.data
        });
      } else if (result) {
        msgCenter.error(result.message, 'Approve Access');
      }
    },
    *getChannel({ payload }, { call, put }) {
      const result = yield call(initRecordingChannelsApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getChannelSuccess',
          channelDataSource: result.data
        });
      } else if (result) {
        msgCenter.error(result.message, 'Approve Access');
      }
    },
    *saveRequest({ payload }, { call }) {
      const result = yield call(AddOrApproveRequestApi, payload);
      return result;
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
    getApproveAccessListSuccess(state, { listDataSource }) {
      return {
        ...state,
        listDataSource
      };
    },
    getChannelSuccess(state, { channelDataSource }) {
      return {
        ...state,
        channelDataSource
      };
    },
    saveRequestSuccess(state, { saveRequest }) {
      return {
        ...state,
        saveRequest
      };
    }
  }
};
