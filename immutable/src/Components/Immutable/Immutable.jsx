import React, {Component} from "react";
import Immutable from "immutable";

export default class ImmutableCom extends Component {
  componentDidMount() {
    const map1 = Immutable.Map({a: 1, b: 2});
    const map2 = Immutable.Map({a: 1, b: 2});
    console.log(map1 === map2);
    console.log(Immutable.is(map1, map2));
  }

  render() {
    return (
      <div>
        123
      </div>
    )
  }
}
