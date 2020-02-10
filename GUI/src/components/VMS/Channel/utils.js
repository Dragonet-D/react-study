import _ from 'lodash';

// check item(obj) if exist in current arr or not
export function objIndexOf(arr, obj) {
  let index = -1;
  for (const k in arr) {
    if (_.isEqual(arr[k], obj)) {
      index = k;
      return index;
    }
  }
  return index;
}
