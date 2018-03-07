import {testApi} from '../services/api';

export default {
  namespace: 'test',

  state: {
    data: [],
  },

  effects: {
    * fetch(_, {call, put}) {
      const response = yield call(testApi);
      // console.log(response);
      yield put({
        type: 'save',
        payload: response.test,
      });
    },
    * testpayload({payload}, {put}) {
      // console.log(payload);
      yield put({
        type: 'save',
        payload,
      });
    },
  },

  reducers: {
    save(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {
        data: [],
      };
    },
  },
};
