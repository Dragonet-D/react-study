import {
  fileListApi,
  uploadFileApi,
  getEntryListApi,
  fileTypeListApi,
  taskTypeListApi,
  saveDataTypeApi,
  deleteFileApi,
  downloadFileApi,
  addModelApi
} from 'api/vade';
import { isSuccess } from 'utils/helpers';
import msg from 'utils/messageCenter';

const msgTitle = 'VADE Data';
export default {
  namespace: 'vadeData',
  state: {
    dataListPage: {},
    entryList: [],
    dataTypeList: [],
    taskTypeList: []
  },
  effects: {
    *getDataList({ payload }, { call, put }) {
      const result = yield call(fileListApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getDataListSuccess',
          dataListPage: result.data
        });
      } else {
        msg.error(result.message, msgTitle);
      }
    },
    *saveData({ payload }, { call }) {
      const result = yield call(uploadFileApi, payload);
      return result;
    },
    *delData({ payload }, { call }) {
      const result = yield call(deleteFileApi, payload.ids);
      return result;
    },
    *getEntryList({ payload }, { call, put }) {
      const result = yield call(getEntryListApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getEntryListSuccess',
          entryList: result.data
        });
      }
    },
    *getFileTypeList({ payload }, { call, put }) {
      const result = yield call(fileTypeListApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getFileTypeSuccess',
          dataTypeList: result.data
        });
      } else {
        msg.error(result.message, msgTitle);
      }
    },
    *getTaskTypeList({ payload }, { call, put }) {
      const result = yield call(taskTypeListApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getTaskTypeSuccess',
          taskTypeList: result.data.items
        });
      } else {
        msg.error(result.message, msgTitle);
      }
    },
    *createDataTypeList({ payload }, { call }) {
      const result = yield call(saveDataTypeApi, payload);
      return result;
    },
    *downloadFile({ payload }, { call }) {
      const result = yield call(downloadFileApi, payload.checkedIds);
      return result;
    },
    *addModel({ payload }, { call }) {
      const result = yield call(addModelApi, payload);
      return result;
    }
  },
  reducers: {
    getDataListSuccess(state, { dataListPage }) {
      return {
        ...state,
        dataListPage
      };
    },
    getEntryListSuccess(state, { entryList }) {
      return {
        ...state,
        entryList
      };
    },
    getFileTypeSuccess(state, { dataTypeList }) {
      return {
        ...state,
        dataTypeList
      };
    },
    getTaskTypeSuccess(state, { taskTypeList }) {
      return {
        ...state,
        taskTypeList
      };
    }
  }
};
