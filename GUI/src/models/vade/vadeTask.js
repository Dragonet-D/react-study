import {
  taskListApi,
  fileListApi,
  saveTaskApi,
  taskTypeListApi,
  createTaskTypeApi,
  downloadFileApi,
  deleteTaskApi,
  doTaskApi
} from 'api/vade';
import { isSuccess } from 'utils/helpers';
import msg from 'utils/messageCenter';

const msgTitle = 'VADE Task';
export default {
  namespace: 'vadeTask',
  state: {
    taskList: {},
    fileTypeList: [],
    taskTypeList: []
  },
  effects: {
    *getTaskList({ payload }, { call, put }) {
      const result = yield call(taskListApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getTaskListSuccess',
          taskList: result.data
        });
      } else {
        msg.error(result.message, msgTitle);
      }
    },
    *saveTask({ payload }, { call }) {
      const result = yield call(saveTaskApi, payload);
      return result;
    },
    *deleteTask({ payload }, { call }) {
      const result = yield call(deleteTaskApi, payload);
      return result;
    },
    *getFileList({ payload }, { call }) {
      const result = yield call(fileListApi, payload);
      return result;
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
    *createTaskType({ payload }, { call }) {
      const result = yield call(createTaskTypeApi, payload);
      return result;
    },
    *downloadLiveLog({ payload }, { call }) {
      const result = yield call(downloadFileApi, payload.id);
      return result;
    },
    *doTask({ payload }, { call }) {
      const result = yield call(doTaskApi, payload);
      return result;
    }
  },
  reducers: {
    getTaskListSuccess(state, { taskList }) {
      return {
        ...state,
        taskList
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
