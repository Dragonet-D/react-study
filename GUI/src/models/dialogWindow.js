export default {
  namespace: 'dialogWindow',
  state: {
    position: [],
    zIndex: []
  },
  reducers: {
    addLeftPosition(state, { payload }) {
      return {
        ...state,
        position: [...state.position, payload.number]
      };
    },
    reduceLeftPosition(state, { payload }) {
      const result = state.position.filter(item => item !== payload.number);
      return {
        ...state,
        position: result
      };
    },
    restoreLeftPosition(state) {
      return {
        position: [],
        zIndex: state.zIndex
      };
    },
    addWindowZindex(state, { payload }) {
      return {
        ...state,
        zIndex: [...state.zIndex, payload.zIndex]
      };
    },
    updateWindowZindex(state, { payload }) {
      const result = state.zIndex.map(item => {
        if (item.id === payload.id) {
          return {
            id: item.id,
            value: 1110
          };
        } else {
          return {
            id: item.id,
            value: 1100
          };
        }
      });
      return {
        ...state,
        zIndex: result
      };
    },
    emptyWindowZindex(state) {
      return {
        ...state,
        zIndex: []
      };
    }
  }
};
