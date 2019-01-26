import {createStore} from "redux";

function counter(state = {value: 0}, action) {
  let {type} = action;
  switch (type) {
    case "INCREMENT":
      return Object.assign({}, state, {
        value: state.value + 6
      });
    default:
      return state;
  }
}


let store = createStore(counter);
// let store = createStore(counter, {}); 第二个参数可以作为initialState

document.body.onclick = () => {
  store.dispatch({type: 'INCREMENT', value: 6})
};

store.subscribe(() => {

});
