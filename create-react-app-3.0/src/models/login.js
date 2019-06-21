import { routerRedux } from 'dva/router';
import { login } from 'api/login';
import store from '../index';

const { dispatch } = store;

export default {
  namespace: 'login',
  state: {
    userInfo: []
  },
  effects: {
    *loginRequest({ payload }, { call, put }) {
      const result = yield call(login, payload);
      console.log(result);
      if (result && result.code === '00000000') {
        dispatch(routerRedux.push('/todo'));
      }
      yield put({
        type: 'login',
        userInfo: result
      });
    }
  },
  reducers: {
    login(state, { payload }) {
      return {
        ...state,
        userInfo: payload
      };
    }
  }
};
