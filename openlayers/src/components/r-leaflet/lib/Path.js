"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _pick2 = _interopRequireDefault(require("lodash/pick"));

var _isEqual2 = _interopRequireDefault(require("lodash/isEqual"));

var _MapLayer2 = _interopRequireDefault(require("./MapLayer"));

var OPTIONS = ['stroke', 'color', 'weight', 'opacity', 'lineCap', 'lineJoin', 'dashArray', 'dashOffset', 'fill', 'fillColor', 'fillOpacity', 'fillRule', 'bubblingMouseEvents', 'renderer', 'className', // Interactive Layer
'interactive', // Layer
'pane', 'attribution'];

var Path =
/*#__PURE__*/
function (_MapLayer) {
  (0, _inheritsLoose2.default)(Path, _MapLayer);

  function Path(props) {
    var _this;

    _this = _MapLayer.call(this, props) || this;
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "leafletElement", void 0);
    _this.leafletElement = _this.createLeafletElement(props);

    if (_this.contextValue == null) {
      _this.contextValue = (0, _extends2.default)({}, props.leaflet, {
        popupContainer: _this.leafletElement
      });
    }

    return _this;
  }

  var _proto = Path.prototype;

  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    _MapLayer.prototype.componentDidUpdate.call(this, prevProps);

    this.setStyleIfChanged(prevProps, this.props);
  };

  _proto.getPathOptions = function getPathOptions(props) {
    return (0, _pick2.default)(props, OPTIONS);
  };

  _proto.setStyle = function setStyle(options) {
    if (options === void 0) {
      options = {};
    }

    this.leafletElement.setStyle(options);
  };

  _proto.setStyleIfChanged = function setStyleIfChanged(fromProps, toProps) {
    var nextStyle = this.getPathOptions(toProps);

    if (!(0, _isEqual2.default)(nextStyle, this.getPathOptions(fromProps))) {
      this.setStyle(nextStyle);
    }
  };

  return Path;
}(_MapLayer2.default);

exports.default = Path;