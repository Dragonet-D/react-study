import { login } from 'api/login';

export default {
  namespace: 'login',
  state: {
    userInfo: []
  },
  effects: {
    *loginRequest(_, { call, put }) {
      const result = call(login, 'aaaa', '1232');
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
