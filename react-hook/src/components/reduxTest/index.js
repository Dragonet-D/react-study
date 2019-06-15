import React, {Fragment} from "react";
import {connect} from "react-redux";
import {add, minus, asyncAdd} from "./../../store/counterReducer";

function ReduxTest(props) {
  const {num} = props;

  return (
      <Fragment>
        {num}
        <div>
          <button onClick={() => props.add()}>-</button>
          <button onClick={() => props.minus()}>+</button>
          <button onClick={() => props.asyncAdd()}>asyncAdd</button>
        </div>
      </Fragment>
  )
}

const mapStateToProps = state => {
  return {
    num: state.counter
  }
};
export default connect(mapStateToProps, {
  add, minus, asyncAdd
})(ReduxTest)