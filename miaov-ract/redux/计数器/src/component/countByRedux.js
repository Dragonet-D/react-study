import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

let $addCounter = $('.counterBox .addCounter'),
    $counterPanel = $('.counterBox .counterPanel'),
    $hasAll = $('.allSel .val'),
    $maximum = $('.maximum .val'),
    $allCount = $('.allCount .val');


function counter(state, action) {
  let {type, id} = action;
  switch (type) {
    case 'ADD_COUNTER':
      return [...state, {
        id: new Date().getTime(),
        value: 0
      }];
    case 'INCREMENT':
      return state.map(elt => {
        if (elt.id === id) {
          elt.value++;
        }
        return elt;
      });
    case 'DECREMENT':
      return state.map(elt => {
        if (elt.id === id) {
          elt.value--;
        }
        return elt;
      });
    default:
      return state;
  }
}

let store = createStore(counter, [], applyMiddleware(thunk));

class Counter {
  constructor(store, {id, value}) {
    this.value = value;
    this.store = store;
    this.id = id;
    this.elt = $('<div class="counter"></div>');
    let incrementBtn = this.incrementBtn = $('<button class="add"></button>');
    let decrementBtn = this.decrementBtn = $('<button class="sub"></button>');
    let oddBtn = this.oddBtn = $('<button class="addIfOdd"></button>');
    let asyncBtn = this.asyncBtn = $('<button class="addAsync"></button>');
    let num = this.num = $(`<span>${this.value}</span>`);

    this.elt.append(decrementBtn, num, incrementBtn, oddBtn, asyncBtn);

    this.decrement = this.decrement.bind(this);
    this.increment = this.increment.bind(this);
    this.addIfOdd = this.addIfOdd.bind(this);
    this.asyncAdd = this.asyncAdd.bind(this);

    decrementBtn.click(this.decrement);
    incrementBtn.click(this.increment);
    oddBtn.click(this.addIfOdd);
    asyncBtn.click(this.asyncAdd);
  }

  decrement() {
    if (this.value === 0) return;
    boundDecrement(this.id);
  }

  increment() {
    boundIncrement(this.id);
  }

  addIfOdd() {
    boundAddIfOdd(this.id, this.value);
  }

  asyncAdd() {
    setTimeout(() => {
      boundIncrement(this.id);
    }, 1000);
  }
}

function increment(id) {
  return {type: 'INCREMENT', id}
}

function decrement(id) {
  return {type: 'DECREMENT', id}
}

const boundIncrement = (id) => store.dispatch(increment(id));
const boundDecrement = (id) => store.dispatch(decrement(id));
const boundAddIfOdd = (id) => store.dispatch(addIfOdd(id));
// 中间件
const addIfOdd = (id, value) => (dispach, getState) => {
  if (value % 2 === 0) return;
  // boundIncrement(id);
  dispach(increment(id));
}

function checkHasAll(counters) {
  let val = counters.every(elt => elt.value !== 0);
  $hasAll.html(val + '')
}

function calcMax(counters) {
  let val = counters.slice().sort((a, b) => {
    return b.value - a.value
  })[0].value;
  $maximum.html(val);
}

function countAll(counters) {
  let val = counters.reduce((accu, elt) => accu + elt.value, 0);
  $allCount.html(val);
}

$addCounter.click(ev => {
  store.dispatch({type: 'ADD_COUNTER'})
});

store.subscribe(() => {
  let state = store.getState();
  $counterPanel.html('');
  state.forEach(data => {
    $counterPanel.append(new Counter(store, data).elt)
  });
  console.log(state);
  checkHasAll(state);
  calcMax(state);
  countAll(state);
});