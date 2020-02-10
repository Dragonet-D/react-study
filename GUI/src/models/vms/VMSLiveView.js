import { isSuccess } from 'utils/helpers';
import {
  channelGroupTree,
  getLiveStreamApi,
  getDefaultApi,
  setDefaultApi,
  getChannelPTZpresetsApi,
  controlPTZApi,
  clearPTZpresetApi,
  setPTZpresetApi,
  updatePTZpresetApi,
  endStreamApi,
  startClippingApi,
  endClippingApi
} from 'api/vms';
import msgCenter from 'utils/messageCenter';
import tools from 'utils/treeTools';

export default {
  namespace: 'VMSLiveView',
  state: {
    namespace: 'VMSLiveView',
    defaultData: null,
    presetsDatasource: {}
  },
  effects: {
    *getChannelListData({ payload }, { call, put }) {
      const result = yield call(channelGroupTree, payload.id);
      const data = tools.formatSensorList({ data: result.data, search: '' });
      if (isSuccess(result)) {
        yield put({
          type: 'getChannelListDataSuccess',
          listData: data
        });
      } else if (result) {
        msgCenter.error(result.message, 'Live View');
      }
    },
    *getLiveStream({ payload, id }, { call, put }) {
      const result = yield call(getLiveStreamApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getLiveStreamSuccess',
          videoPlayInfo: { data: result.data, id }
        });
      } else if (result) {
        msgCenter.error(result.message, 'Live View');
      }
    },
    *getDefault({ payload }, { call }) {
      const result = yield call(getDefaultApi, payload);
      if (isSuccess(result)) {
        // yield put({
        //   type: 'getDefaultSuccess',
        //   defaultData: result.data
        // });
        return result.data;
      } else if (result) {
        msgCenter.error(result.message, 'Live View');
      }
    },
    *setDefault({ payload }, { call, put }) {
      const result = yield call(setDefaultApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'setDefaultSuccess'
        });
        msgCenter.success(result.message, 'Live View');
      } else if (result) {
        msgCenter.error(result.message, 'Live View');
      }
    },
    *getPtzPreset({ payload }, { call, put }) {
      const result = yield call(getChannelPTZpresetsApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getPtzPresetSuccess',
          presetsDatasource: result.data
        });
      } else if (result) {
        msgCenter.error(result.message, 'Live View');
      }
    },
    *ptzControl({ payload }, { call, put }) {
      const result = yield call(controlPTZApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'ptzControlSuccess'
        });
      } else if (result) {
        msgCenter.error(result.message, 'Live View');
      }
    },
    *delPTZpreset({ payload }, { call }) {
      const result = yield call(clearPTZpresetApi, payload);
      if (isSuccess(result)) {
        return result;
      } else if (result) {
        msgCenter.error(result.message, 'Live View');
      }
    },
    *setPTZpreset({ payload }, { call }) {
      const result = yield call(setPTZpresetApi, payload);
      if (isSuccess(result)) {
        return result;
      } else if (result) {
        msgCenter.error(result.message, 'Live View');
      }
    },
    *updatePTZpreset({ payload }, { call }) {
      const result = yield call(updatePTZpresetApi, payload);
      if (isSuccess(result)) {
        return result;
      } else if (result) {
        msgCenter.error(result.message, 'Live View');
      }
    },
    *endStream({ payload }, { call }) {
      const result = yield call(endStreamApi, payload);
      if (isSuccess(result)) {
        return result;
      } else if (result) {
        msgCenter.error(result.message, 'Live View');
      }
    },
    *beginClipping({ payload }, { call }) {
      const result = yield call(startClippingApi, payload);
      if (isSuccess(result)) {
        msgCenter.success(result.message);
        return result;
      } else if (result) {
        msgCenter.error(result.message, 'Live View');
      }
    },
    *endClipping({ payload }, { call }) {
      const result = yield call(endClippingApi, payload);
      if (isSuccess(result)) {
        msgCenter.success(result.message);
        return result;
      } else if (result) {
        msgCenter.error(result.message, 'Live View');
      }
    }
  },
  reducers: {
    getChannelListDataSuccess(state, { listData }) {
      return {
        ...state,
        listData
      };
    },
    getLiveStreamSuccess(state, { videoPlayInfo }) {
      return {
        ...state,
        videoPlayInfo
      };
    },
    getDefaultSuccess(state, { defaultData }) {
      return {
        ...state,
        defaultData
      };
    },
    getPtzPresetSuccess(state, { presetsDatasource }) {
      return {
        ...state,
        presetsDatasource
      };
    }
  }
};
