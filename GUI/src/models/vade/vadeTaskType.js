import { taskTypeListApi, createTaskTypeApi, deleteTaskTypeApi } from 'api/vade';
import { isSuccess } from 'utils/helpers';
import msg from 'utils/messageCenter';

const msgTitle = 'VADE Task Type';
export default {
  namespace: 'vadeTaskType',
  state: {
    taskTypeList: {}
  },
  effects: {
    *getTaskTypeList({ payload }, { call, put }) {
      const result = yield call(taskTypeListApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getTaskTypeListSuccess',
          taskTypeList: result.data
        });
      } else {
        msg.error(result.message, msgTitle);
      }
    },
    *saveTaskType({ payload }, { call }) {
      const result = yield call(createTaskTypeApi, payload);
      return result;
    },
    *delTaskType({ payload }, { call }) {
      const result = yield call(deleteTaskTypeApi, payload.ids);
      return result;
    }
  },
  reducers: {
    getTaskTypeListSuccess(state, { taskTypeList }) {
      return {
        ...state,
        taskTypeList
      };
    }
  }
};
