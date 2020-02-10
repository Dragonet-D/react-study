import { subscribeSearchApi, getAlarmInitInfoApi, subscribeSettingSaveApi } from 'api/alarm';
import { isSuccess } from 'utils/helpers';
import msg from 'utils/messageCenter';

const alarmSubscribe = 'Alarm Subscribe';

export default {
  namespace: 'alarmSubscribe',
  state: {
    subscribeSettingData: {},
    alarmInitInfo: {}
  },
  effects: {
    *getSubscribeData({ payload }, { call, put }) {
      const result = yield call(subscribeSearchApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getSubscribeDataSuccess',
          subscribeSettingData: result.data
        });
      } else if (result) {
        msg.error(result.message, alarmSubscribe);
      }
    },
    *saveSubscribeData({ payload }, { call, put }) {
      const result = yield call(subscribeSettingSaveApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'saveSubscribeDataSuccess',
          saveSubscribeData: result.data
        });
        return result;
      } else if (result) {
        msg.error(result.message, alarmSubscribe);
      }
    },
    *getAlarmInitInfoApi(_, { call, put }) {
      const result = yield call(getAlarmInitInfoApi);
      if (isSuccess(result)) {
        yield put({
          type: 'getAlarmInitInfo',
          alarmInitInfo: result.data
        });
      } else if (result) {
        msg.error(result.message, alarmSubscribe);
      }
    }
  },
  reducers: {
    getSubscribeDataSuccess(state, { subscribeSettingData }) {
      return {
        ...state,
        subscribeSettingData
      };
    },
    saveSubscribeDataSuccess(state, { saveSubscribeData }) {
      return {
        ...state,
        saveSubscribeData
      };
    },
    getAlarmInitInfo(state, { alarmInitInfo }) {
      return {
        ...state,
        alarmInitInfo
      };
    }
  }
};
