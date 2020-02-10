import {
  fileListApi,
  uploadFileApi,
  getEntryListApi,
  fileTypeListApi,
  taskTypeListApi,
  deleteFileApi,
  downloadFileApi,
  createTaskTypeApi
} from 'api/vade';
import { isSuccess } from 'utils/helpers';
import msg from 'utils/messageCenter';

const msgTitle = 'VADE Program';
const initialState = {
  programList: {},
  entryList: [],
  dataTypeList: [],
  taskTypeList: []
};
export default {
  namespace: 'vadeProgram',
  state: {
    ...initialState
  },
  effects: {
    // *clearAll(_, { put }) {
    //   yield put({
    //     type: 'clearAll'
    //   });
    // },
    *getProgramList({ payload }, { call, put }) {
      const result = yield call(fileListApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getProgramListSuccess',
          programList: result.data
        });
      } else {
        msg.error(result.message, msgTitle);
      }
    },
    *saveProgram({ payload }, { call }) {
      const result = yield call(uploadFileApi, payload);
      return result;
    },
    *delProgram({ payload }, { call }) {
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
      } else {
        msg.error(result.message, msgTitle);
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
    *saveTaskType({ payload }, { call }) {
      const result = yield call(createTaskTypeApi, payload);
      return result;
    },
    *downloadFile({ payload }, { call }) {
      const result = yield call(downloadFileApi, payload.checkedIds);
      return result;
    }
  },
  reducers: {
    clearAll(state) {
      return {
        ...state,
        ...initialState
      };
    },
    getProgramListSuccess(state, { programList }) {
      return {
        ...state,
        programList
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
