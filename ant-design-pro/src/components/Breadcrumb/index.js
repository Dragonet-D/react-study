import React, {Component} from 'react';
import {Link} from 'dva/router';
import {Breadcrumb} from 'antd';
import {getMenuData} from '../../common/menu';

const routerData = getMenuData();
const routess = routerData.map((item) => {
  const path = item.path;
  const name = item.name;
  return [{path, name}, ...item.children.map((i) => {
    const paths = i.path;
    const names = i.name;
    return {path: paths, name: names};
  })];
});
console.log(routess);
const aa = [];
for (const value of routess) {
  aa.push(...value);
}
console.log(aa);

function itemRender(route, params, routes, paths) {
  // console.log(route);
  // console.log(params);
  // console.log(routes);
  // console.log(paths);
  const last = routes.indexOf(route) === routes.length - 1;
  return last ? <span>{route.name}</span> : <Link to={paths.join('/')}>{route.name}</Link>;
}

class Breadcrumbs extends Component {
  render() {
    return (<Breadcrumb itemRender={itemRender} routes={aa} separator=">"/>);
  }
}

export default Breadcrumbs;
