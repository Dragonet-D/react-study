import React from "react";
import { connect } from "react-redux";

function ReduxTest(props) {
  const { dispatch } = props;
  function add() {
    dispatch({
      type:"add"
    })
  }

  function minus() {
    dispatch({
      type:"minus"
    })
  }
  return (
    <div>
      {
        props.num
      }
      <div>
        <button onClick={add}>-</button>
        <button onClick={minus}>+</button>
      </div>
    </div>
  )
}
const mapStateToProps = state => {
  return {
    num: state
  }
};
export default connect(mapStateToProps)(ReduxTest)