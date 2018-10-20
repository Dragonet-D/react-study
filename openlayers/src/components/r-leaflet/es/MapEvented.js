"use strict";

import _extends from "@babel/runtime/helpers/extends";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _forEach from "lodash-es/forEach";
import { Component } from 'react';
export var EVENTS_RE = /^on(.+)$/i;

var MapEvented =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(MapEvented, _Component);

  function MapEvented(props) {
    var _this;

    _this = _Component.call(this, props) || this;

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_leafletEvents", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "leafletElement", void 0);

    _this._leafletEvents = _this.extractLeafletEvents(props);
    return _this;
  }

  var _proto = MapEvented.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this.bindLeafletEvents(this._leafletEvents);
  };

  _proto.componentDidUpdate = function componentDidUpdate(_prevProps) {
    this._leafletEvents = this.bindLeafletEvents(this.extractLeafletEvents(this.props), this._leafletEvents);
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    var el = this.leafletElement;
    if (!el) return;

    _forEach(this._leafletEvents, function (cb, ev) {
      el.off(ev, cb);
    });
  };

  _proto.extractLeafletEvents = function extractLeafletEvents(props) {
    return Object.keys(props).reduce(function (res, prop) {
      if (EVENTS_RE.test(prop)) {
        if (props[prop] != null) {
          var _key = prop.replace(EVENTS_RE, function (match, p) {
            return p.toLowerCase();
          });

          res[_key] = props[prop];
        }
      }

      return res;
    }, {});
  };

  _proto.bindLeafletEvents = function bindLeafletEvents(next, prev) {
    if (next === void 0) {
      next = {};
    }

    if (prev === void 0) {
      prev = {};
    }

    var el = this.leafletElement;
    if (el == null || el.on == null) return {};

    var diff = _extends({}, prev);

    _forEach(prev, function (cb, ev) {
      if (next[ev] == null || cb !== next[ev]) {
        delete diff[ev];
        el.off(ev, cb);
      }
    });

    _forEach(next, function (cb, ev) {
      if (prev[ev] == null || cb !== prev[ev]) {
        diff[ev] = cb;
        el.on(ev, cb);
      }
    });

    return diff;
  };

  _proto.fireLeafletEvent = function fireLeafletEvent(type, data) {
    var el = this.leafletElement;
    if (el) el.fire(type, data);
  };

  return MapEvented;
}(Component);

export { MapEvented as default };