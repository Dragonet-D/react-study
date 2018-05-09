import React, { Component } from 'react';
import { connect } from 'react-redux';

@connect(state => state.list)
export default class App extends Component {
  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
  }
  getData = () => {
    this.props.dispatch(function(dispatch) {
      axios.get().then((res) => {
        dispatch({
          type: 'LIST_UPDATA_SUCC',
          data: res.data,
        })
      })
    })
  }
  render() {
    return (
      <div>123</div>
    )
  }
}
