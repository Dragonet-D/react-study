import axios from 'axios';

// api
function getGoods(){
  return axios.get('/api/goods')
}

export default {
  namespace: "goods",
  state: {
    courses:{}, //课程
    tags:[] //分类
  },
  effects: {
    *getList(action, {call, put}){           
      const res = yield call(getGoods)
      yield put({ type: 'initGoods', payload: res.data.data })
    }
  },
  reducers: {
    initGoods(state,{payload}){
      const {tags, data: courses} = payload;
      return {...state, tags, courses}
    },
    addGood(state, action) {
      console.log(action);
      return [...state, { title: action.payload.title }];
    }
  }
};
