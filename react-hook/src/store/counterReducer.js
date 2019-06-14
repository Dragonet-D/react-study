// reducer: 状态修改的执行者
export default (state = 0, action) => {
  switch (action.type) {
    case "add":
      return state + 1;
    case "minus":
      return state + 1;
    default:
      return state;
  }
};

export function add() {
  return ({
    type: "add"
  })
}

export function minus() {
  return ({
    type: "minus"
  })
}

export function asyncAdd() {
  return (dispatch, state) => {
    console.log(state);
    // 模拟异步操作
    setTimeout(() => {
      dispatch({type: "add"})
    }, 1000);
  }
}