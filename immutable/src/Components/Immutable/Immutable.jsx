import React, {Component} from "react";
import {Map, is, fromJS} from "immutable";
import Cursor from "immutable-cursor";
import PropTypes from "prop-types";

export default class ImmutableCom extends Component {
  static defaultProps = {
    content: ""
  };
  static propTypes = {
    content: PropTypes.string
  };
  state = {};

  componentDidMount() {
    const map1 = Map({a: 1, b: 2});
    const map2 = Map({a: 1, b: 2});
    console.log(map1 === map2);
    console.log(is(map1, map2));
    let data = fromJS({a: {b: {c: 1}}});
    let cursor = Cursor.from(data, ["a", "b"], newData => {
      console.log(newData);
    });
    console.log(cursor.get("c"));
    cursor = cursor.update("c", x => x + 1);
    console.log(cursor.get("c"));
  }

  shouldComponentUpdate(nextProps = {}, nextState = {}, nextContext = {}) {
    const thisProps = this.props || {}, thisState = this.state || {};
    // React 中规定 state 和 props 只能是一个普通对象，所以比较时要比较对象的 key
    if (
      Object.keys(thisProps).length !== Object.keys(nextProps).length ||
      Object.keys(thisState).length !== Object.keys(nextState).length
    ) {
      return true;
    }
    for (const key in nextProps) {
      if (!is(thisProps[key], nextProps[key])) {
        return true;
      }
    }
    for (const key in nextState) {
      if (
        thisState[key] !== nextState[key] ||
        !is(thisState[key], nextState[key])
      ) {
        return true;
      }
    }
    return false;
  }

  render() {
    const {content} = this.props;
    console.log("render------------>");
    return (
      <div>
        {content}
      </div>
    )
  }
}
