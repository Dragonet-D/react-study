import {
  getRealTimeAlarmForVAPApi,
  getAlarmInitInfoApi,
  alarmHistoryDownloadApi,
  getAlarmHistoryActionApi,
  getLiveStreamApi,
  getPlaybackStreamApi,
  updateAlarmFalsePositiveStatusApi,
  updateAlarmHistoryDetailsNoFileApi,
  updateAlarmHistoryDetailsApi
} from 'api/alarm';
import {
  getFrsGroupsApi,
  vapFrsGetPersonsApi,
  vapFrsAddPersonApi,
  vapFrsUpdatePersonImagesApi,
  vapFrsUpdatePersonAssignedGroupApi,
  vapFrsDeletePersonApi
} from 'api/vapFace';
import { isSuccess } from 'utils/helpers';
import msg from 'utils/messageCenter';

const specialWatchList = 'Special Watch List';

const initialState = {
  groupsData: [],
  realTimeAlarmForVAP: [],
  alarmInitInfo: {},
  alarmRealtimeVapExportData: null,
  alarmRealtimeVapActionData: {},
  streamData: {},
  personsList: {},
  playbackStreamData: {}
};

export default {
  namespace: 'specialWatchList',
  state: {
    ...initialState
  },
  effects: {
    *getFrsGroups({ payload }, { call, put }) {
      const result = yield call(getFrsGroupsApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getFrsGroupsSuccess',
          groupsData: result.data
        });
      } else if (result) {
        msg.error(result.message, specialWatchList);
      }
    },
    *vapFrsGetPersons({ payload }, { call, put }) {
      const result = yield call(vapFrsGetPersonsApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'vapFrsGetPersonsSuccess',
          personsList: result.data
        });
      } else if (result) {
        msg.error(result.message, specialWatchList);
      }
    },
    *vapFrsAddPerson({ payload }, { call }) {
      return yield call(vapFrsAddPersonApi, payload);
    },
    *vapFrsUpdatePersonImages({ payload }, { call }) {
      return yield call(vapFrsUpdatePersonImagesApi, payload);
    },
    *vapFrsUpdatePersonAssignedGroup({ payload }, { call }) {
      return yield call(vapFrsUpdatePersonAssignedGroupApi, payload);
    },
    *vapFrsDeletePerson({ payload }, { call }) {
      return yield call(vapFrsDeletePersonApi, payload);
    },
    *getRealTimeAlarmForVAP({ payload }, { call, put }) {
      const result = yield call(getRealTimeAlarmForVAPApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getRealTimeAlarmForVAPSuccess',
          realTimeAlarmForVAP: result.data
        });
      } else if (result) {
        msg.error(result.message, specialWatchList);
      }
    },
    *getAlarmInitInfo(_, { call, put }) {
      const result = yield call(getAlarmInitInfoApi);
      if (isSuccess(result)) {
        yield put({
          type: 'getAlarmInitInfoSuccess',
          alarmInitInfo: result.data
        });
      } else if (result) {
        msg.error(result.message, specialWatchList);
      }
    },
    *alarmRealtimeVapDownload({ payload }, { call, put }) {
      try {
        const result = yield call(alarmHistoryDownloadApi, payload);
        if (result) {
          yield put({
            type: 'alarmRealtimeVapDownloadSuccess',
            alarmRealtimeVapExportData: result
          });
        } else if (result) {
          msg.error(result.message, specialWatchList);
        }
      } catch (e) {
        msg.error('Download Failed', specialWatchList);
      }
    },
    *getAlarmRealtimeVapAction({ payload }, { call, put }) {
      try {
        const result = yield call(getAlarmHistoryActionApi, payload);
        if (isSuccess(result)) {
          yield put({
            type: 'getAlarmRealtimeVapActionSuccess',
            alarmRealtimeVapActionData: result.data
          });
        } else if (result) {
          msg.error(result.message, specialWatchList);
        }
      } catch (e) {
        msg.err('', specialWatchList);
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
        msg.error(result.message, specialWatchList);
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
        msg.error(result.message, specialWatchList);
      }
    },
    *updateAlarmRealtimeDetails({ payload }, { call }) {
      const result = yield call(updateAlarmHistoryDetailsApi, payload);
      if (result) {
        return result;
      } else if (result) {
        msg.error(result.message, specialWatchList);
      }
    },
    *updateAlarmRealtimeDetailsNoFile({ payload }, { call }) {
      const result = yield call(updateAlarmHistoryDetailsNoFileApi, payload);
      if (isSuccess(result)) {
        return result;
      } else if (result) {
        msg.error(result.message, specialWatchList);
      }
    },
    *updateAlarmFalsePositiveStatus({ payload }, { call }) {
      return yield call(updateAlarmFalsePositiveStatusApi, payload);
    }
  },
  reducers: {
    getFrsGroupsSuccess(state, { groupsData }) {
      return {
        ...state,
        groupsData
      };
    },
    vapFrsGetPersonsSuccess(state, { personsList }) {
      return {
        ...state,
        personsList
      };
    },
    getRealTimeAlarmForVAPSuccess(state, { realTimeAlarmForVAP }) {
      return {
        ...state,
        realTimeAlarmForVAP
      };
    },
    getAlarmInitInfoSuccess(state, { alarmInitInfo }) {
      return {
        ...state,
        alarmInitInfo
      };
    },
    clear() {
      return initialState;
    },
    alarmRealtimeVapDownloadSuccess(state, { alarmRealtimeVapExportData }) {
      return {
        ...state,
        alarmRealtimeVapExportData
      };
    },
    getAlarmRealtimeVapActionSuccess(state, { alarmRealtimeVapActionData }) {
      return {
        ...state,
        alarmRealtimeVapActionData
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
