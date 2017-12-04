import { combineReducers } from "redux";

// to do like this,the reducer's name must be the same with certain State's prop name.
import { count } from "./reducers";
const reducer = combineReducers({
	// 这是整个 state 树中的 属性
	counter:count,
});

export default reducer;