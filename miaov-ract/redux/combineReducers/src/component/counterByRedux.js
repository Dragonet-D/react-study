import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';

let $addCounter = $('.counterBox .addCounter'),
    $counterPanel = $('.counterBox .counterPanel'),
    $hasAll = $('.allSel .val'),
    $maximum = $('.maximum .val'),
    $allCount = $('.allCount .val');

let initState = {
  A: [],
  B: []
};


function counterA(state, action) {
  let {type, id, panelName} = action;

  switch (type) {
    case 'ADD_COUNTER':
      if (panelName === 'A') {
        return Object.assign({}, state, {
          A: [...state.A, {
            id: new Date().getTime(),
            value: 0
          }]
        });
      } else {
        return Object.assign({}, state, {
          B: [...state.B, {
            id: new Date().getTime(),
            value: 0
          }]
        })
      }

    case 'INCREMENT':
      return Object.assign({}, {
        A: state.A.map(elt => {
          if (elt.id === id) {
            elt.value++;
          }
          return elt;
        }),
        B: state.B.map(elt => {
          if (elt.id === id) {
            elt.value++;
          }
          return elt;
        }),
      })
          ;
    case 'DECREMENT':
      return state[panelName].map(elt => {
        if (elt.id === id) {
          elt.value--;
        }
        return elt;
      });

    default:
      return state;
  }
}

function counterB(state, action) {
  let {type, id, panelName} = action;

  switch (type) {
    case 'ADD_COUNTER':
      if (panelName === 'A') {
        return Object.assign({}, state, {
          A: [...state.A, {
            id: new Date().getTime(),
            value: 0
          }]
        });
      } else {
        return Object.assign({}, state, {
          B: [...state.B, {
            id: new Date().getTime(),
            value: 0
          }]
        })
      }

    case 'INCREMENT':
      return Object.assign({}, {
        A: state.A.map(elt => {
          if (elt.id === id) {
            elt.value++;
          }
          return elt;
        }),
        B: state.B.map(elt => {
          if (elt.id === id) {
            elt.value++;
          }
          return elt;
        }),
      })
          ;
    case 'DECREMENT':
      return state[panelName].map(elt => {
        if (elt.id === id) {
          elt.value--;
        }
        return elt;
      });

    default:
      return state;
  }
}

function counters(state, action) {
  return {
    A: counterA(state.counterA, action),
    B: counterB(state.counterB, action)
  };
}

counters = combineReducers({
  A: counterA, B: counterB
});


let store = createStore(counters, initState, applyMiddleware(thunk));

class Counter {

  constructor(store, {id, value}) {
    this.value = value;
    this.store = store;
    this.id = id;
    this.elt = $('<div class="counter"></div>');

    let incrementBtn = this.incrementBtn = $('<button class="add"></button>');
    let decrementBtn = this.decrementBtn = $('<button class="sub"></button>');
    let oddBtn = this.oddBtn = $(' <button class="addIfOdd"></button> ');
    let asyncBtn = this.asyncBtn = $(' <button class="addAsync"></button> ');
    let num = this.num = $(`<span>${this.value}</span>`);

    this.elt.append(decrementBtn, num, incrementBtn, oddBtn, asyncBtn);

    this.decrement = this.decrement.bind(this);
    this.increment = this.increment.bind(this);
    this.addIfOdd = this.addIfOdd.bind(this);
    this.asyncAdd = this.asyncAdd.bind(this);

    incrementBtn.click(this.increment);
    decrementBtn.click(this.decrement);
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
    boundAddIfOdd(this.id, this.value)
  }

  asyncAdd() {
    boundAsyncAdd(this.id);
  }

}

function increment(id) {
  return {type: 'INCREMENT', id}
}

function decrement(id) {
  return {type: 'DECREMENT', id}
}

const addIfOdd = (id, value) => (dispatch, getState) => {
  if (value % 2 === 0) return;
  boundIncrement(id);
}

const asyncAdd = id => () => {
  setTimeout(() => {
    boundIncrement(id);
  }, 1000);
}


const boundIncrement = (id) => store.dispatch(increment(id));
const boundDecrement = (id) => store.dispatch(decrement(id));
const boundAddIfOdd = (id) => store.dispatch(addIfOdd(id));
const boundAsyncAdd = (id) => store.dispatch(asyncAdd(id));


$($addCounter[0]).click(ev => {
  store.dispatch({type: 'ADD_COUNTER', panelName: 'A'});
});
$($addCounter[1]).click(ev => {
  store.dispatch({type: 'ADD_COUNTER', panelName: 'B'});
});


store.subscribe(() => {
  let state = store.getState();
  $counterPanel.html('');

  initPanel(state.A, 0);
  initPanel(state.B, 1);

});

function initPanel(state, num) {
  if (state.length === 0) return;
  state.forEach(data => {
    $($counterPanel[num]).append(new Counter(store, data).elt)
  });


  $($hasAll[num]).html(state.every(elt => elt.value !== 0) + '');

  $($maximum[num]).html(state.slice().sort((a, b) => b.value - a.value)[0].value);

  $($allCount[num]).html(state.reduce((accu, elt) => accu + elt.value, 0));
}
