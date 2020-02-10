import _ from 'lodash';

export const saveFile = (data, filename) => {
  //     var eleLink = document.createElement('a');
  // eleLink.download = src;
  // eleLink.style.display = 'none';
  // var blob = new Blob([src]);
  // eleLink.href = URL.createObjectURL(blob);
  // eleLink.href = src;
  // document.body.appendChild(eleLink);
  // eleLink.click();
  // document.body.removeChild(eleLink);
  const saveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
  saveLink.href = data;
  if (filename) {
    saveLink.download = filename;
  }
  const event = document.createEvent('MouseEvents');
  event.initMouseEvent(
    'click',
    true,
    false,
    window,
    0,
    0,
    0,
    0,
    0,
    false,
    false,
    false,
    false,
    0,
    null
  );
  saveLink.dispatchEvent(event);
};
export const isObjEqual = (obj1, obj2) => {
  return _.isEquals(obj1, obj2);
};
export const objIndexOf = (arr, obj) => {
  let index = -1;
  for (const k in arr) {
    if (_.isEquals(arr[k], obj)) {
      index = k;
      return index;
    }
  }
  return index;
};
