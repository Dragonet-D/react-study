"use strict";

exports.__esModule = true;
exports.default = void 0;

var _leaflet = require("leaflet");

var splitClassName = function splitClassName(className) {
  if (className === void 0) {
    className = '';
  }

  return className.split(' ').filter(Boolean);
};

var _default = function _default(container, prevClassName, nextClassName) {
  if (container != null && nextClassName !== prevClassName) {
    if (prevClassName != null && prevClassName.length > 0) {
      splitClassName(prevClassName).forEach(function (cls) {
        _leaflet.DomUtil.removeClass(container, cls);
      });
    }

    if (nextClassName != null && nextClassName.length > 0) {
      splitClassName(nextClassName).forEach(function (cls) {
        _leaflet.DomUtil.addClass(container, cls);
      });
    }
  }
};

exports.default = _default;