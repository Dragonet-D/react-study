"use strict";

import { DomUtil } from 'leaflet';

var splitClassName = function splitClassName(className) {
  if (className === void 0) {
    className = '';
  }

  return className.split(' ').filter(Boolean);
};

export default (function (container, prevClassName, nextClassName) {
  if (container != null && nextClassName !== prevClassName) {
    if (prevClassName != null && prevClassName.length > 0) {
      splitClassName(prevClassName).forEach(function (cls) {
        DomUtil.removeClass(container, cls);
      });
    }

    if (nextClassName != null && nextClassName.length > 0) {
      splitClassName(nextClassName).forEach(function (cls) {
        DomUtil.addClass(container, cls);
      });
    }
  }
});