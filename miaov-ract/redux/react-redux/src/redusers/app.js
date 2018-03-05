function app(state = {
  data: {
    value: 'Hello React!'
  }
}, action) {
  switch (action.type) {
    case 'APP_UPDATA':
      return {
        data: state.data
      };
    case 'APP_UPDATA_CHANGE':
      // console.log(action);
      return {
        data: action.data
      };
    case 'APP_UPDATA_SUCCESS':
      console.log(action);
      return {
        data: action.data
      };
    default:
      return state;
  }
}

export default app;