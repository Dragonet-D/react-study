import {
  getAlarmHistoryDataApi,
  exportAlarmHistoryDataApi,
  updateAlarmHistoryActionApi,
  getAlarmInitInfoApi,
  getAlarmHistoryActionApi,
  updateAlarmHistoryDetailsApi,
  alarmHistoryDownloadApi,
  updateAlarmHistoryDetailsNoFileApi
} from 'api/alarm';
import { isSuccess } from 'utils/helpers';
import msg from 'utils/messageCenter';

const alarmHistory = 'Alarm History';

export default {
  namespace: 'alarmHistory',
  state: {
    alarmHistoryData: [],
    alarmHistoryExportData: null,
    alarmInitInfo: {},
    alarmHistoryActionData: {}
  },
  effects: {
    *getAlarmInitInfo(_, { call, put }) {
      const result = yield call(getAlarmInitInfoApi);
      if (isSuccess(result)) {
        yield put({
          type: 'getAlarmInitInfoSuccess',
          alarmInitInfo: result.data
        });
      } else if (result) {
        msg.error(result.message, alarmHistory);
      }
    },
    *getAlarmHistoryData({ payload }, { call, put }) {
      const result = yield call(getAlarmHistoryDataApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getAlarmHistoryDataSuccess',
          alarmHistoryData: result.data
        });
      } else if (result) {
        msg.error(result.message, alarmHistory);
      }
    },
    *exportAlarmHistoryData({ payload }, { call, put }) {
      const result = yield call(exportAlarmHistoryDataApi, payload);
      if (result && result.size > 0) {
        yield put({
          type: 'exportAlarmHistoryDataSuccess',
          alarmHistoryExportData: result
        });
      } else if (result) {
        msg.error(result.message, alarmHistory);
      }
    },
    *updateAlarmHistoryAction({ payload }, { call }) {
      const result = yield call(updateAlarmHistoryActionApi, payload);
      if (isSuccess(result)) {
        return result;
      } else if (result) {
        msg.error(result.message, alarmHistory);
      }
    },
    *getAlarmHistoryAction({ payload }, { call, put }) {
      const result = yield call(getAlarmHistoryActionApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getAlarmHistoryActionSuccess',
          alarmHistoryActionData: result.data
        });
      } else if (result) {
        msg.error(result.message, alarmHistory);
      }
    },
    *updateAlarmHistoryDetails({ payload }, { call }) {
      const result = yield call(updateAlarmHistoryDetailsApi, payload);
      if (result) {
        return result;
      } else if (result) {
        msg.error(result.message, alarmHistory);
      }
    },
    *alarmHistoryDownload({ payload }, { call, put }) {
      const result = yield call(alarmHistoryDownloadApi, payload);
      if (result && result.size > 0) {
        yield put({
          type: 'exportAlarmHistoryDataSuccess',
          alarmHistoryExportData: result
        });
      } else if (result) {
        msg.error(result.message, alarmHistory);
      }
    },
    *updateAlarmHistoryDetailsNoFile({ payload }, { call }) {
      const result = yield call(updateAlarmHistoryDetailsNoFileApi, payload);
      if (isSuccess(result)) {
        return result;
      } else if (result) {
        msg.error(result.message, alarmHistory);
      }
    }
  },
  reducers: {
    getAlarmInitInfoSuccess(state, { alarmInitInfo }) {
      return {
        ...state,
        alarmInitInfo
      };
    },
    getAlarmHistoryDataSuccess(state, { alarmHistoryData }) {
      return {
        ...state,
        alarmHistoryData
      };
    },
    exportAlarmHistoryDataSuccess(state, { alarmHistoryExportData }) {
      return {
        ...state,
        alarmHistoryExportData
      };
    },
    getAlarmHistoryActionSuccess(state, { alarmHistoryActionData }) {
      return {
        ...state,
        alarmHistoryActionData
      };
    },
    clearAlarmHistoryActionData(state) {
      return {
        ...state,
        alarmHistoryExportData: null
      };
    }
  }
};
