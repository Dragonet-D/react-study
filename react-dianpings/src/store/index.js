import { createStore,applyMiddleware } from "redux";
// in productrion enviroment, you may need comment logger middleware
import Logger from "redux-logger";
import ReduxThunk from "redux-thunk";
import reducer from "../reducer"; 

const store = createStore(
	reducer,
	applyMiddleware(ReduxThunk,Logger),
);
// console.log(store.getState())

export default store;