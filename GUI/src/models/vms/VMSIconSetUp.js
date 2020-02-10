import { deviceModelListApi, deviceIconUploadApi, deviceIconSaveApi, deleteIconApi } from 'api/vms';
import { isSuccess } from 'utils/helpers';
import msgCenter from 'utils/messageCenter';

export default {
  namespace: 'VMSIconSetUp',
  state: {
    deviceModelList: []
  },
  effects: {
    *getDeviceModelList(_, { call, put }) {
      const result = yield call(deviceModelListApi);
      if (isSuccess(result)) {
        yield put({
          type: 'getDeviceModelSuccess',
          payload: {
            data: result.data
          }
        });
      } else if (result) {
        msgCenter.error(result.message, 'Icon Setup');
      }
    },
    *uploadDeviceIcon({ payload }, { call }) {
      const result = yield call(deviceIconUploadApi, payload);
      if (isSuccess(result)) {
        return result;
      } else if (result) {
        msgCenter.error(result.message, 'Icon Setup');
      }
    },
    *saveDeviceIcon({ payload }, { call }) {
      const result = yield call(deviceIconSaveApi, payload);
      if (isSuccess(result)) {
        return result;
      } else if (result) {
        msgCenter.error(result.message, 'Icon Setup');
      }
    },
    *deleteIcon({ payload }, { call, put }) {
      const result = yield call(deleteIconApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getDeviceModelList'
        });
      } else if (result) {
        msgCenter.error(result.message, 'Icon Setup');
      }
    }
  },
  reducers: {
    getDeviceModelSuccess(state, { payload }) {
      return {
        ...state,
        deviceModelList: payload.data
      };
    }
  }
};
