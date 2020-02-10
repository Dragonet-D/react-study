import _ from 'lodash';
// eslint-disable-next-line no-useless-escape
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export function isUrl(path) {
  return reg.test(path);
}

export function urlToList(url) {
  const urlList = url.split('/').filter(i => i);
  return urlList.map((urlItem, index) => {
    return `/${urlList.slice(0, index + 1).join('/')}`;
  });
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  return renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
      exact
    };
  });
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    let isAdd = false;
    // is contain
    isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    // remove repeat
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// get the alarm type class name
export function getSeverityClassName(data) {
  switch (data) {
    case 'Critical':
      return 'alarm_severity_critical alarm_severity_common';
    case 'Major':
      return 'alarm_severity_major alarm_severity_common';
    case 'Minor':
      return 'alarm_severity_minor alarm_severity_common';
    case 'Info':
      return 'alarm_severity_info alarm_severity_common';
    default:
      return '';
  }
}

export function addBase64Prefix(data) {
  return `data:image/png;base64,${data}`;
}

export function search(data, filterObj) {
  if (filterObj && !_.isEqual(filterObj, {})) {
    let arr = [];
    for (const k in filterObj) {
      arr = data.filter(item => {
        if (item[k].toLowerCase().indexOf(filterObj[k].toLowerCase()) >= 0) {
          return item;
        }
        return null;
      });
    }
    return arr;
  }
  return data;
}

// handle pagination in the front end
export function handlePaginationFront(data, pageSize, pageNo) {
  if (_.isArray(data)) {
    const { length } = data;
    return data.slice(pageNo * pageSize, pageSize > length ? length : pageSize + pageNo * pageSize);
  }
  return [];
}

// get base64 size
export function showBase64Size(baseStr) {
  const tag = 'base64,';
  baseStr = baseStr.substring(baseStr.indexOf(tag) + tag.length);
  const eqTagIndex = baseStr.indexOf('=');
  baseStr = eqTagIndex !== -1 ? baseStr.substring(0, eqTagIndex) : baseStr;
  const strLen = baseStr.length;
  return (strLen - (strLen / 8) * 2) / 1024;
}
