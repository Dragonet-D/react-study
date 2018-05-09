import { combineReducers } from 'redux';
import list from './list';
import details from './details';
import user from './user';
let reducer = combineReducers({
  list,
  details,
  user
})