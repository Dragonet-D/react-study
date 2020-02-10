import {
  getTaskResourceListApi,
  getServerResourceListApi,
  getServerResourceTotalApi
} from 'api/vade';
import { isSuccess } from 'utils/helpers';
import msg from 'utils/messageCenter';

const msgTitle = 'VADE Resource Monitor';
export default {
  namespace: 'vadeResourceMonitor',
  state: {
    taskResourceList: {},
    serverResourceList: [],
    serverResourceTotal: ''
  },
  effects: {
    *getTaskResource({ payload }, { call, put }) {
      const result = yield call(getTaskResourceListApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getTaskResourceSuccess',
          taskResourceList: result.data
        });
      } else {
        msg.error(result.message, msgTitle);
      }
    },
    *getServerResource({ payload }, { call, put }) {
      const result = yield call(getServerResourceListApi, payload);
      if (isSuccess(result)) {
        yield put({
          type: 'getServerResourceSuccess',
          serverResourceList: result.data
        });
      } else {
        msg.error(result.message, msgTitle);
      }
    },
    *getServerResourceTotal(_, { call, put }) {
      const result = yield call(getServerResourceTotalApi);
      if (isSuccess(result)) {
        yield put({
          type: 'getServerResourceTotalSuccess',
          serverResourceTotal: result.data
        });
      } else {
        msg.error(result.message, msgTitle);
      }
    }
  },
  reducers: {
    getTaskResourceSuccess(state, { taskResourceList }) {
      return {
        ...state,
        taskResourceList
      };
    },
    getServerResourceSuccess(state, { serverResourceList }) {
      return {
        ...state,
        serverResourceList
      };
    },
    getServerResourceTotalSuccess(state, { serverResourceTotal }) {
      return {
        ...state,
        serverResourceTotal
      };
    }
  }
};
