import {
  createStore,
  applyMiddleware,
  combineReducers
} from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import counter from "./counterReducer";


export default createStore(
    combineReducers({counter}),
    applyMiddleware(
        logger,
        thunk
    )
);