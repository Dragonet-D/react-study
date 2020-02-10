import { isSuccess } from 'utils/helpers';
import {
  getFirmwareListApi,
  initModelsApi,
  getUpgradeSchedulesApi,
  updateFirmwareApi,
  uploadFirmwareApi,
  getScheduleDeviceListApi,
  getSelectedDeviceArrayApi,
  createScheduleApi,
  delFirmwareScheduleApi,
  delFirmwareApi
} from 'api/vms';
import msgCenter from 'utils/messageCenter';
// import tools from 'utils/treeTools';

export default {
  namespace: 'VMSFirmware',
  state: {
    firmwareDataSource: []
  },
  effects: {
    *getFirmwareList({ payload }, { call, put }) {
      const result = yield call(getFirmwareListApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getFirmwareListSuccess',
          firmwareDataSource: result.data
        });
      } else if (result) {
        msgCenter.error(result.message, 'Firmware');
      }
    },
    *getModelList({ payload }, { call, put }) {
      const result = yield call(initModelsApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getModelListSuccess',
          modelList: result.data
        });
      } else if (result) {
        msgCenter.error(result.message, 'Firmware');
      }
    },
    *getUpgradeList({ payload }, { call, put }) {
      const result = yield call(getUpgradeSchedulesApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getUpgradeListSuccess',
          upgradeList: result.data
        });
      } else if (result) {
        msgCenter.error(result.message, 'Firmware');
      }
    },
    *updateFirmware({ payload }, { call }) {
      const result = yield call(updateFirmwareApi, payload);
      if (isSuccess(result)) {
        return result;
      } else if (result) {
        msgCenter.error(result.message, 'Firmware');
      }
    },
    *uploadFirmware({ payload }, { call }) {
      const result = yield call(uploadFirmwareApi, payload);
      if (isSuccess(result)) {
        return result;
      } else if (result) {
        msgCenter.error(result.message, 'Firmware');
      }
    },
    *delFirmware({ payload }, { call }) {
      const result = yield call(delFirmwareApi, payload);
      if (isSuccess(result)) {
        return result;
      } else if (result) {
        msgCenter.error(result.message, 'Firmware');
      }
    },
    *getFirmwareUpgradeDeviceList({ payload }, { call, put }) {
      const result = yield call(getScheduleDeviceListApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getScheduleDeviceListSuccess',
          firmwareUpgradeDeviceList: result.data
        });
      } else if (result) {
        msgCenter.error(result.message, 'Firmware');
      }
      return result;
    },
    *getSelectedDeviceArray({ payload }, { call, put }) {
      const result = yield call(getSelectedDeviceArrayApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getSelectedDeviceArraySuccess',
          selectedDeviceArray: result.data
        });
      } else if (result) {
        msgCenter.error(result.message, 'Firmware');
      }
      return result;
    },
    *deleteSchedule({ payload, getListPayload }, { call, put }) {
      const result = yield call(delFirmwareScheduleApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'deleteScheduleSuccess'
        });
        msgCenter.success('Delete action Success');
        const getList = yield call(getUpgradeSchedulesApi, getListPayload);
        if (isSuccess(result)) {
          yield put({
            type: 'getUpgradeListSuccess',
            upgradeList: getList.data
          });
        } else if (result) {
          msgCenter.error(result.message, 'Firmware');
        }
      } else if (result) {
        msgCenter.error(result.message, 'Firmware');
      }
      return result;
    },
    *firmwareUpgradeRequest({ payload }, { call }) {
      const result = yield call(createScheduleApi, payload);
      if (isSuccess(result)) {
        return result;
      } else if (result) {
        msgCenter.error(result.message, 'Firmware');
      }
    }
  },
  reducers: {
    getFirmwareListSuccess(state, { firmwareDataSource }) {
      return {
        ...state,
        firmwareDataSource
      };
    },
    getModelListSuccess(state, { modelList }) {
      return {
        ...state,
        modelList
      };
    },
    getUpgradeListSuccess(state, { upgradeList }) {
      return {
        ...state,
        upgradeList
      };
    },
    getScheduleDeviceListSuccess(state, { firmwareUpgradeDeviceList }) {
      return {
        ...state,
        firmwareUpgradeDeviceList
      };
    },
    getSelectedDeviceArraySuccess(state, { selectedDeviceArray }) {
      return {
        ...state,
        selectedDeviceArray
      };
    }
  }
};
