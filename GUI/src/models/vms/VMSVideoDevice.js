import { isSuccess } from 'utils/helpers';
import {
  getVideoDeviceListApi,
  initModelsApi,
  getBatchUploadTaskListApi,
  downloadFailedDevicesApi,
  uploadDevicesApi,
  updateDeviceApi,
  addDeviceApi,
  downloadTemplateApi,
  deleteDeviceApi
} from 'api/vms';
import msgCenter from 'utils/messageCenter';

let count = 0;

export default {
  namespace: 'VMSVideoDevice',
  state: {
    deviceList: [],
    uploadTaskList: {}
  },
  effects: {
    *getDeviceList({ payload }, { call, put }) {
      const result = yield call(getVideoDeviceListApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getDeviceListSuccess',
          deviceList: result.data
        });
      } else if (result) {
        msgCenter.error(result.message, 'Video Device');
      }
      return result;
    },
    *getModelList({ payload }, { call, put }) {
      const result = yield call(initModelsApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getModelListSuccess',
          modelList: result.data
        });
      } else if (result) {
        msgCenter.error(result.message, 'Video Device');
      }
    },
    *getBatchUploadTaskList({ payload }, { call, put }) {
      const result = yield call(getBatchUploadTaskListApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getBatchUploadTaskListSuccess',
          uploadTaskList: result.data
        });
      } else if (result) {
        msgCenter.error(result.message, 'Video Device');
      }
    },
    *downloadFromTaskList({ payload }, { call, put }) {
      const result = yield call(downloadFailedDevicesApi, payload.id);
      if (result) {
        yield put({
          type: 'downloadFromTaskListSuccess',
          exportData: result
        });
      } else if (result) {
        msgCenter.error(result.message, 'Video Device');
      }
    },
    *downloadTemplate(_, { call, put }) {
      const result = yield call(downloadTemplateApi);
      if (result) {
        yield put({
          type: 'downloadFromTaskListSuccess',
          exportData: result
        });
      } else if (result) {
        msgCenter.error(result.message, 'Video Device');
      }
    },
    *fileUpload({ payload }, { call }) {
      const result = yield call(uploadDevicesApi, payload);
      return result;
    },
    *addDevice({ payload }, { call }) {
      const result = yield call(addDeviceApi, payload);
      return result;
    },
    *updateDevice({ payload, id }, { call }) {
      const result = yield call(updateDeviceApi, { payload, id });
      // if (isSuccess(result)) {
      //   yield put({
      //     type: 'updateDeviceSuccess'
      //   });
      //   const getListResult = yield call(getVideoDeviceListApi, getList);
      //   if (isSuccess(result) && result.status === 200) {
      //     yield put({
      //       type: 'getDeviceListSuccess',
      //       deviceList: getListResult.data
      //     });
      //   }
      //   msgCenter.success('Update Success');
      // } else {
      //   msgCenter.error(result.message);
      // }
      return result;
    },
    *batchDeleteDevice({ payload }, { call }) {
      const result = yield call(deleteDeviceApi, payload);
      // if (isSuccess(result)) {
      //   yield put({
      //     type: 'batchDeleteDeviceSuccess'
      //   });
      //   const getListResult = yield call(getVideoDeviceListApi, getList);
      //   if (isSuccess(result) && result.status === 200) {
      //     yield put({
      //       type: 'getDeviceListSuccess',
      //       deviceList: getListResult.data
      //     });
      //   }
      //   msgCenter.success('Delete Success');
      // }
      return result;
    }
  },
  reducers: {
    getDeviceListSuccess(state, { deviceList }) {
      return {
        ...state,
        deviceList
      };
    },
    getModelListSuccess(state, { modelList }) {
      return {
        ...state,
        modelList
      };
    },
    getBatchUploadTaskListSuccess(state, { uploadTaskList }) {
      return {
        ...state,
        uploadTaskList
      };
    },
    downloadFromTaskListSuccess(state, { exportData }) {
      return {
        ...state,
        exportData
      };
    },
    updateDeviceSuccess(state) {
      count += 1;
      return {
        ...state,
        resetCount: count
        // selectedStorage: new Set()
      };
    },
    clearExportDataActionData(state) {
      return {
        ...state,
        exportData: null
      };
    },
    batchDeleteDeviceSuccess(state) {
      count += 1;
      return {
        ...state,
        resetCount: count
        // selectedStorage: new Set()
      };
    }
  }
};
