import {
  getAlarmConfigurationListApi,
  getAlarmInitInfoApi,
  getAlarmDetailsOfOneApi,
  getChannelsDataApi,
  getVmsModelsDataApi,
  createAlarmApi,
  deleteAlarmConfigurationApi,
  getUserListApi,
  deliverToApi,
  updateAlarmSettingApi,
  updateAlarmApi
} from 'api/alarm';
import { isSuccess } from 'utils/helpers';
import msg from 'utils/messageCenter';

const alarmConfiguration = 'Alarm Configuration';

export default {
  namespace: 'alarmConfiguration',
  state: {
    alarmConfigurationData: {},
    alarmInitInfo: {},
    alarmDetailsOfOne: {},
    channelsData: [],
    vmsModelsData: [],
    userList: {},
    deliveryToUserList: {}
  },
  effects: {
    *getAlarmConfigurationList({ payload }, { call, put }) {
      const result = yield call(getAlarmConfigurationListApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getAlarmConfigurationListSuccess',
          alarmConfigurationData: result.data
        });
      } else if (result) {
        msg.error(result.message, alarmConfiguration);
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
        msg.error(result.message, alarmConfiguration);
      }
    },
    *getAlarmDetailsOfOne({ payload }, { call, put }) {
      const result = yield call(getAlarmDetailsOfOneApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getAlarmDetailsOfOneSuccess',
          alarmDetailsOfOne: result.data
        });
      } else if (result) {
        msg.error(result.message, alarmConfiguration);
      }
    },
    *getChannelsData({ payload }, { call, put }) {
      const result = yield call(getChannelsDataApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getChannelsDataSuccess',
          channelsData: result.data
        });
      } else if (result) {
        msg.error(result.message, alarmConfiguration);
      }
    },
    *getVmsModelsData(_, { call, put }) {
      const result = yield call(getVmsModelsDataApi);
      if (isSuccess(result)) {
        yield put({
          type: 'getVmsModelsDataSuccess',
          vmsModelsData: result.data
        });
      } else if (result) {
        msg.error(result.message, alarmConfiguration);
      }
    },
    *createAlarm({ payload }, { call }) {
      const result = yield call(createAlarmApi, payload);
      if (result) {
        return result;
      } else if (result) {
        msg.error(result.message, alarmConfiguration);
      }
    },
    *deleteAlarmConfiguration({ payload }, { call }) {
      const result = yield call(deleteAlarmConfigurationApi, payload);
      if (result) {
        return result;
      } else if (result) {
        msg.error(result.message, alarmConfiguration);
      }
    },
    *getUserList({ payload }, { call, put }) {
      const result = yield call(getUserListApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getUserListSuccess',
          deliveryToUserList: result.data
        });
      } else if (result) {
        msg.error(result.message, alarmConfiguration);
      }
    },
    *deliverTo({ payload }, { call }) {
      return yield call(deliverToApi, payload);
    },
    *updateAlarmSetting({ payload }, { call }) {
      return yield call(updateAlarmSettingApi, payload);
    },
    *updateAlarm({ payload }, { call }) {
      return yield call(updateAlarmApi, payload);
    }
  },
  reducers: {
    getAlarmConfigurationListSuccess(state, { alarmConfigurationData }) {
      return {
        ...state,
        alarmConfigurationData
      };
    },
    getAlarmInitInfoSuccess(state, { alarmInitInfo }) {
      return {
        ...state,
        alarmInitInfo
      };
    },
    getAlarmDetailsOfOneSuccess(state, { alarmDetailsOfOne }) {
      return {
        ...state,
        alarmDetailsOfOne
      };
    },
    clearAlarmDetailsOfOne(state) {
      return {
        ...state,
        alarmDetailsOfOne: {}
      };
    },
    getChannelsDataSuccess(state, { channelsData }) {
      return {
        ...state,
        channelsData
      };
    },
    getVmsModelsDataSuccess(state, { vmsModelsData }) {
      return {
        ...state,
        vmsModelsData
      };
    },
    getUserListSuccess(state, { deliveryToUserList }) {
      return {
        ...state,
        deliveryToUserList
      };
    }
  }
};
