"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _reduce2 = _interopRequireDefault(require("lodash/reduce"));

var _isEqual2 = _interopRequireDefault(require("lodash/isEqual"));

var _leaflet = require("leaflet");

var _context = require("./context");

var _GridLayer2 = _interopRequireDefault(require("./GridLayer"));

var _MapEvented = require("./MapEvented");

var WMSTileLayer =
/*#__PURE__*/
function (_GridLayer) {
  (0, _inheritsLoose2.default)(WMSTileLayer, _GridLayer);

  function WMSTileLayer() {
    return _GridLayer.apply(this, arguments) || this;
  }

  var _proto = WMSTileLayer.prototype;

  _proto.createLeafletElement = function createLeafletElement(props) {
    var url = props.url,
        params = (0, _objectWithoutPropertiesLoose2.default)(props, ["url"]);
    return new _leaflet.TileLayer.WMS(url, this.getOptions(params));
  };

  _proto.updateLeafletElement = function updateLeafletElement(fromProps, toProps) {
    _GridLayer.prototype.updateLeafletElement.call(this, fromProps, toProps);

    var prevUrl = fromProps.url,
        _po = fromProps.opacity,
        _pz = fromProps.zIndex,
        prevParams = (0, _objectWithoutPropertiesLoose2.default)(fromProps, ["url", "opacity", "zIndex"]);
    var url = toProps.url,
        _o = toProps.opacity,
        _z = toProps.zIndex,
        params = (0, _objectWithoutPropertiesLoose2.default)(toProps, ["url", "opacity", "zIndex"]);

    if (url !== prevUrl) {
      this.leafletElement.setUrl(url);
    }

    if (!(0, _isEqual2.default)(params, prevParams)) {
      this.leafletElement.setParams(params);
    }
  };

  _proto.getOptions = function getOptions(params) {
    return (0, _reduce2.default)(_GridLayer.prototype.getOptions.call(this, params), function (options, value, key) {
      if (!_MapEvented.EVENTS_RE.test(key)) {
        options[key] = value;
      }

      return options;
    }, {});
  };

  return WMSTileLayer;
}(_GridLayer2.default);

var _default = (0, _context.withLeaflet)(WMSTileLayer);

exports.default = _default;