import {
  initChannelsApi,
  saveChannelApi,
  delChannelApi,
  getGroupsApi,
  getAllSchedulesApi,
  getExtraSchedulesApi,
  saveScheduleApi,
  delScheduleApi,
  getChannelInfo,
  initModelsApi
} from 'api/vms';
import { isSuccess } from 'utils/helpers';
import msgCenter from 'utils/messageCenter';

export default {
  namespace: 'vmsChannel',
  state: {
    channelList: {},
    scheduleList: {},
    groupList: {},
    modelList: []
  },
  effects: {
    *getChannelList({ payload }, { call, put }) {
      const result = yield call(initChannelsApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getChannelListSuccess',
          channelList: result.data
        });
      } else if (result) {
        msgCenter.error(result.message, 'Video Channel');
      }
    },
    *getSchedules({ payload }, { call }) {
      const result = yield call(getAllSchedulesApi, payload);
      return result;
    },
    *getExtraSchedules({ payload }, { call }) {
      const result = yield call(getExtraSchedulesApi, payload);
      return result;
    },
    *getParentGroupList({ payload }, { call, put }) {
      const result = yield call(getGroupsApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getParentGroupListSuccess',
          groupList: result.data
        });
      } else if (result) {
        msgCenter.error(result.message, 'Video Channel');
      }
    },
    *getModelList({ payload }, { call, put }) {
      const result = yield call(initModelsApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getModelListSuccess',
          modelList: result.data
        });
      } else if (result) {
        msgCenter.error(result.message, 'Video Channel');
      }
    },
    *saveChannel({ payload }, { call }) {
      const result = yield call(saveChannelApi, payload);
      return result;
    },
    *delChannel({ payload }, { call }) {
      const result = yield call(delChannelApi, payload);
      return result;
    },
    *saveSchedule({ payload }, { call }) {
      const result = yield call(saveScheduleApi, payload);
      return result;
    },
    *delSchedule({ payload }, { call }) {
      const result = yield call(delScheduleApi, payload);
      return result;
    },
    *getChannelInfo({ payload }, { call }) {
      const result = yield call(getChannelInfo, payload);
      if (isSuccess(result)) {
        return result;
      } else if (result) {
        msgCenter.error(result.message, 'Video Channel');
      }
    }
  },
  reducers: {
    getChannelListSuccess(state, { channelList }) {
      return {
        ...state,
        channelList
      };
    },
    getModelListSuccess(state, { modelList }) {
      return {
        ...state,
        modelList
      };
    }
  }
};
