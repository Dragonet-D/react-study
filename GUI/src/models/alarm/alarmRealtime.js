import {
  getAlarmRealtimeDataApi,
  updateAlarmHistoryActionApi,
  getAlarmHistoryActionApi,
  alarmHistoryDownloadApi,
  updateAlarmHistoryDetailsApi,
  updateAlarmHistoryDetailsNoFileApi,
  getRealTimeAlarmForVAPApi,
  getAlarmInitInfoApi,
  getLiveStreamApi,
  getPlaybackStreamApi,
  updateAlarmFalsePositiveStatusApi
} from 'api/alarm';
import { isSuccess } from 'utils/helpers';
import msg from 'utils/messageCenter';

const alarmRealTime = 'Alarm RealTime';
const alarmRealTimeVap = 'POI/VOI Alarms';

const initialData = {
  alarmRealtimeData: [],
  alarmRealtimeExportData: null,
  alarmRealtimeVapExportData: null,
  alarmRealtimeActionData: {},
  alarmRealtimeVapActionData: {},
  realTimeAlarmForVAP: [],
  alarmInitInfo: {},
  streamData: {},
  playbackStreamData: {}
};

export default {
  namespace: 'alarmRealtime',
  state: {
    ...initialData
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
        msg.error(result.message, alarmRealTime);
      }
    },
    *getAlarmRealtimeData({ payload }, { call, put }) {
      const result = yield call(getAlarmRealtimeDataApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getAlarmRealtimeDataSuccess',
          alarmRealtimeData: result.data
        });
      } else if (result) {
        msg.error(result.message, alarmRealTime);
      }
    },
    *updateAlarmRealtimeAction({ payload }, { call }) {
      const result = yield call(updateAlarmHistoryActionApi, payload);
      if (isSuccess(result)) {
        return result;
      } else if (result) {
        msg.error(result.message, alarmRealTime);
      }
    },
    *getAlarmRealtimeAction({ payload }, { call, put }) {
      const result = yield call(getAlarmHistoryActionApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getAlarmRealtimeActionSuccess',
          alarmRealtimeActionData: result.data
        });
      } else if (result) {
        msg.error(result.message, alarmRealTime);
      }
    },
    *getAlarmRealtimeVapAction({ payload }, { call, put }) {
      const result = yield call(getAlarmHistoryActionApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getAlarmRealtimeVapActionSuccess',
          alarmRealtimeVapActionData: result.data
        });
      } else if (result) {
        msg.error(result.message, alarmRealTimeVap);
      }
    },
    *alarmRealtimeDownload({ payload }, { call, put }) {
      const result = yield call(alarmHistoryDownloadApi, payload);
      if (result) {
        yield put({
          type: 'alarmRealtimeDownloadSuccess',
          alarmRealtimeExportData: result
        });
      } else if (result) {
        msg.error(result.message, alarmRealTime);
      }
    },
    *alarmRealtimeVapDownload({ payload }, { call, put }) {
      const result = yield call(alarmHistoryDownloadApi, payload);
      if (result) {
        yield put({
          type: 'alarmRealtimeVapDownloadSuccess',
          alarmRealtimeVapExportData: result
        });
      } else if (result) {
        msg.error(result.message, alarmRealTime);
      }
    },
    *updateAlarmRealtimeDetails({ payload }, { call }) {
      const result = yield call(updateAlarmHistoryDetailsApi, payload);
      if (result) {
        return result;
      } else if (result) {
        msg.error(result.message, alarmRealTime);
      }
    },
    *updateAlarmRealtimeDetailsNoFile({ payload }, { call }) {
      const result = yield call(updateAlarmHistoryDetailsNoFileApi, payload);
      if (isSuccess(result)) {
        return result;
      } else if (result) {
        msg.error(result.message, alarmRealTime);
      }
    },
    *getRealTimeAlarmForVAP({ payload }, { call, put }) {
      const result = yield call(getRealTimeAlarmForVAPApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getRealTimeAlarmForVAPSuccess',
          realTimeAlarmForVAP: result.data
        });
      } else if (result) {
        msg.error(result.message, alarmRealTime);
      }
    },
    *getLiveStream({ payload }, { call, put }) {
      const result = yield call(getLiveStreamApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getLiveStreamSuccess',
          streamData: result.data
        });
      } else if (result) {
        msg.error(result.message, alarmRealTime);
      }
    },
    *getPlaybackStream({ payload }, { call, put }) {
      const result = yield call(getPlaybackStreamApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getPlaybackStreamSuccess',
          playbackStreamData: result.data
        });
      } else if (result) {
        msg.error(result.message, alarmRealTime);
      }
    },
    *updateAlarmFalsePositiveStatus({ payload }, { call }) {
      return yield call(updateAlarmFalsePositiveStatusApi, payload);
    }
  },
  reducers: {
    getAlarmInitInfoSuccess(state, { alarmInitInfo }) {
      return {
        ...state,
        alarmInitInfo
      };
    },
    getAlarmRealtimeDataSuccess(state, { alarmRealtimeData }) {
      return {
        ...state,
        alarmRealtimeData
      };
    },
    alarmRealtimeDownloadSuccess(state, { alarmRealtimeExportData }) {
      return {
        ...state,
        alarmRealtimeExportData
      };
    },
    alarmRealtimeVapDownloadSuccess(state, { alarmRealtimeVapExportData }) {
      return {
        ...state,
        alarmRealtimeVapExportData
      };
    },
    getAlarmRealtimeActionSuccess(state, { alarmRealtimeActionData }) {
      return {
        ...state,
        alarmRealtimeActionData
      };
    },
    getAlarmRealtimeVapActionSuccess(state, { alarmRealtimeVapActionData }) {
      return {
        ...state,
        alarmRealtimeVapActionData
      };
    },
    clearAlarmRealtimeActionData(state) {
      return {
        ...state,
        alarmRealtimeExportData: null
      };
    },
    clearAlarmRealtimeVapActionData(state) {
      return {
        ...state,
        alarmRealtimeVapExportData: null
      };
    },
    getRealTimeAlarmForVAPSuccess(state, { realTimeAlarmForVAP }) {
      return {
        ...state,
        realTimeAlarmForVAP
      };
    },
    clearAllTheData(state) {
      return {
        ...state,
        ...initialData
      };
    },
    getLiveStreamSuccess(state, { streamData }) {
      return {
        ...state,
        streamData
      };
    },
    getPlaybackStreamSuccess(state, { playbackStreamData }) {
      return {
        ...state,
        playbackStreamData
      };
    }
  }
};
