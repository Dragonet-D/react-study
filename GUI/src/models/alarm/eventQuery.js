import { getEventsApi, getAlarmInitInfoApi, exportEventListApi } from 'api/alarm';
import { isSuccess } from 'utils/helpers';
import msg from 'utils/messageCenter';

const eventQuery = 'Event Query';

export default {
  namespace: 'eventQuery',
  state: {
    eventsData: {},
    alarmInitInfo: {},
    eventsExportData: null
  },
  effects: {
    *getEvents({ payload }, { call, put }) {
      const result = yield call(getEventsApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getEventsSuccess',
          eventsData: result.data
        });
      } else if (result) {
        msg.error(result.message, eventQuery);
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
        msg.error(result.message, eventQuery);
      }
    },
    *exportEventList({ payload }, { call, put }) {
      const result = yield call(exportEventListApi, payload);
      if (result) {
        yield put({
          type: 'exportEventListSuccess',
          eventsExportData: result
        });
      } else if (result) {
        msg.error(result.message, eventQuery);
      }
    }
  },
  reducers: {
    getEventsSuccess(state, { eventsData }) {
      return {
        ...state,
        eventsData
      };
    },
    getAlarmInitInfoSuccess(state, { alarmInitInfo }) {
      return {
        ...state,
        alarmInitInfo
      };
    },
    exportEventListSuccess(state, { eventsExportData }) {
      return {
        ...state,
        eventsExportData
      };
    },
    clearExportEventList(state) {
      return {
        ...state,
        eventsExportData: null
      };
    }
  }
};
