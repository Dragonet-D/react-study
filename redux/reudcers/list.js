function list (state = {
  loading: true,
  data: [],
}, action) {
  switch(action.type) {
    case 'LIST_UPDATA_SUCC':
      return {
        loading: false,
        data: action.data.data,
      }
    case 'LIST_UPDATA_ERR':
      return {
        loading: false,
        data: 'no data',
      }
    default:
      return state;
  }
}
export default list;