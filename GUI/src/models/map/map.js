import {
  getTreeDataAPI,
  getRealTimeAlarmAPI,
  initCreateAlarmDataApi,
  getLiveStreamApi,
  endStreamApi,
  controlPTZApi,
  getAlarmRealtimeDataApi,
  getAOIPolygonApi,
  createPolygonApi,
  deleteAOIApi
} from 'api/map';
import { isSuccess } from 'utils/helpers';
// import { treeData as treeDataTest } from 'commons/map/setting';
import { formatFeatureLayerNormalData, formatFeatureLayerAlarmData } from 'commons/map/utils';
import msg from 'utils/messageCenter';
import tools from 'utils/treeTools';

let isPTZcontrolFailed = false;
const msgTitle = 'Map';

export default {
  namespace: 'map',
  state: {
    treeData: [],
    channelData: [],
    alarmData: [],
    sensorStream: {},
    channelSelected: [],
    alarmEventType: {
      alarmSeverity: [],
      eventType: []
    },
    streamData: {},
    alarmRealtimeData: []
  },
  effects: {
    *getTreeData({ payload }, { call, put }) {
      const { userId } = payload;
      const result = yield call(getTreeDataAPI, userId);
      if (isSuccess(result)) {
        const treeData = tools.formatSensorList({
          data: result.data,
          search: ''
        });
        // const treeData = tools.formatSensorList({
        //   data: treeDataTest,
        //   search: ''
        // });
        const channelData = formatFeatureLayerNormalData(treeData);
        yield put({
          type: 'getTreeDataSuccess',
          payload: {
            data: treeData
          }
        });
        yield put({
          type: 'setChannelData',
          payload: {
            channelData
          }
        });
      } else if (result) {
        msg.error(result.message, msgTitle);
      }
    },
    *getRealTimeAlarmData({ payload }, { call, put }) {
      const { userId, sort } = payload;
      const result = yield call(getRealTimeAlarmAPI, userId, sort);
      if (isSuccess(result)) {
        yield put({
          type: 'getAlarmRealtimeDataSuccess',
          alarmRealtimeData: result.data
        });
        const alarmData = formatFeatureLayerAlarmData(result.data);
        // const alarmData = formatFeatureLayerAlarmData(alarmDataTest);
        yield put({
          type: 'getRealTimeAlarmDataSuccess',
          payload: {
            alarmData
          }
        });
      } else if (result) {
        msg.error(result.message, msgTitle);
      }
    },
    *getAlarmEventType(_, { call, put }) {
      const result = yield call(initCreateAlarmDataApi);
      if (isSuccess(result)) {
        yield put({
          type: 'getAlarmEventTypeSuccess',
          payload: {
            data: result.data
          }
        });
      } else if (result) {
        msg.error(result.message, msgTitle);
      }
    },
    *getLiveViewStream({ payload }, { call, put }) {
      const { obj } = payload;
      const result = yield call(getLiveStreamApi, obj);
      if (isSuccess(result)) {
        result.data.targetId = obj.targetId;
        yield put({
          type: 'getLiveViewStreamSuccess',
          payload: {
            data: result.data
          }
        });
        return result.data;
      } else if (result) {
        msg.error(result.message, msgTitle);
      }
    },
    *endLiveViewStream({ payload }, { call }) {
      const { obj } = payload;
      const result = yield call(endStreamApi, obj);
      if (!isSuccess(result)) {
        msg.error(result.message, 'End Stream');
      } else if (result) {
        msg.error(result.message, msgTitle);
      }
    },
    *controlPTZ({ payload }, { call }) {
      const { obj } = payload;
      if (obj.action === 'stop' && isPTZcontrolFailed) {
        return;
      }
      const result = yield call(controlPTZApi, obj);
      if (result.status === 200) {
        isPTZcontrolFailed = false;
        if (!!result.data && !!result.data.statusCode && result.data.statusCode !== '201') {
          msg.warn(result.data.message, 'Control PTZ');
        }
      } else {
        isPTZcontrolFailed = true;
        if (result) {
          msg.error(result.message, msgTitle);
        }
      }
    },
    *getRealtimeAlarmSortedData({ payload }, { call, put }) {
      const result = yield call(getAlarmRealtimeDataApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getAlarmRealtimeDataSuccess',
          alarmRealtimeData: result.data
        });
      } else if (result) {
        msg.error(result.message, msgTitle);
      }
    },
    *getAOIPolygon({ payload }, { call }) {
      const result = yield call(getAOIPolygonApi, payload);
      if (isSuccess(result)) {
        return result;
      } else if (result) {
        // msg.error(result.message, msgTitle);
      }
    },
    *createPolygon({ payload }, { call }) {
      const result = yield call(createPolygonApi, payload);
      if (isSuccess(result)) {
        msg.success(result.message, msgTitle);
        return result;
      } else if (result) {
        msg.error(result.message, msgTitle);
      }
    },
    *deleteAOI({ payload }, { call }) {
      const result = yield call(deleteAOIApi, payload);
      if (isSuccess(result)) {
        msg.success(result.message, msgTitle);
        return result;
      } else if (result) {
        msg.error(result.message, msgTitle);
      }
    }
  },
  reducers: {
    getTreeDataSuccess(state, { payload }) {
      return {
        ...state,
        treeData: payload.data
      };
    },
    setChannelData(state, { payload }) {
      return {
        ...state,
        channelData: payload.channelData
      };
    },
    getRealTimeAlarmDataSuccess(state, { payload }) {
      return {
        ...state,
        alarmData: payload.alarmData
      };
    },
    setChannelSelected(state, { payload }) {
      // const data = mapUtils.dataTools.getFlatTreeData(payload.data);
      return {
        ...state,
        channelSelected: payload.data
      };
    },
    getAlarmEventTypeSuccess(state, { payload }) {
      return {
        ...state,
        alarmEventType: payload.data
      };
    },
    getLiveViewStreamSuccess(state, { payload }) {
      return {
        ...state,
        streamData: payload.data
      };
    },
    getAlarmRealtimeDataSuccess(state, { alarmRealtimeData }) {
      return {
        ...state,
        alarmRealtimeData
      };
    }
  }
};
