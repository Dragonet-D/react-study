/*
import {createStore} from 'redux';

function counter(state = 0, action) {
  console.log(state);
  console.log(action);
  let {type} = action;
  switch (type) {
    case 'INCREMENT':
      return ++state;
    default:
      return state;
  }
}

let store = createStore(counter);

$(document).click((ev) => {
  store.dispatch({type: 'INCREMENT', value: 6});
});

store.subscribe(() => {
  let state = store.getState();
  console.log(state);
});*/
import {createStore} from 'redux';

//reducer 接收两个参数 state, action
// 纯函数, 1,确定的输入得到确定的输出; 2, 不应该有副作用
  function counter(state = {value: 0}, action) {
  let {type} = action;

  switch (type) {
    case 'INCREMENT':
      // return ++state;
      return Object.assign({}, state, {
        value: state.value + 6
      });
    default:
      return state;
  }
}

let store = createStore(counter);

// 点击发布
$(document).click(ev => {
  // 发布action  dispatch 更新state
  store.dispatch({type: 'INCREMENT'});
  // action 对象一个action至少有一个type字段
  // store.dispatch({type: 'INCREMENT', value: 6});
});

let curt = store.getState();

store.subscribe(() => {

  let pre = curt;

  curt = store.getState();
  console.log(pre, curt, pre === curt);
});
