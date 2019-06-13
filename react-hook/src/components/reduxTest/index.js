import React, {Fragment} from "react";
import {connect} from "react-redux";

function ReduxTest(props) {
  const {dispatch, num} = props;

  function add() {
    dispatch({
      type: "add"
    })
  }

  function minus() {
    dispatch({
      type: "minus"
    })
  }

  return (
    <Fragment>
      {num}
      <div>
        <button onClick={add}>-</button>
        <button onClick={minus}>+</button>
      </div>
    </Fragment>
  )
}

const mapStateToProps = state => {
  return {
    num: state
  }
};
export default connect(mapStateToProps, {
  add: () => ({type: "add"}),
  minus: () => ({type: "minus"})
})(ReduxTest)