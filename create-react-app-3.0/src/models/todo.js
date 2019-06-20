export default {
  namespace: 'todo',
  state: {
    dataList: []
  },

  reducers: {
    addToDo(state, { payload }) {
      return {
        ...state,
        dataList: payload.dataList
      };
    }
  }
};
