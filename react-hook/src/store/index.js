import {
  createStore,
  applyMiddleware,
  combineReducers
} from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import counter from "./counterReducer";
import user from "./user";


export default createStore(
    combineReducers({counter, user}),
    applyMiddleware(
        logger,
        thunk
    )
);