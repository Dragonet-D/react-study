import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      tab: 'job'
    };
    this.getData(this.state.tab, this.state.page);
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log(nextProps);
    return true
  }

  getData(tab, page) {
    this.props.dispatch((dispatch) => {
      dispatch({
        type: 'APP_UPDATA'
      });
      axios.get(`https://cnodejs.org/api/v1/topics?tab=${tab}&page=${page}&limit=10`)
          .then((res) => {
            // console.log(res);
            dispatch({
              type: 'APP_UPDATA_SUCCESS',
              data: res.data
            })
          })
          .catch((error) => {
            console.log(error);
            dispatch({
              type: 'APP_UPDATA_ERROR',
              data: error
            })
          })
    });
  }

  getChange() {
    this.props.dispatch((dispatch) => {
      dispatch({
        type: 'APP_UPDATA_CHANGE',
        data: {
          value: 'Python'
        }
      })
    })
  }

  componentDidMount() {
    console.log(this.refs.header);
  }

  render() {
    let {data} = this.props;
    console.log(data);
    return (
        <div
            className="App"
        >
          <header
              className="App-header"
              ref="header"
          >
            <img src={logo} className="App-logo" alt="logo"/>
            <h1 className="App-title">{data.value}</h1>
          </header>
          <p
              className="App-intro"
              onClick={this.getChange.bind(this)}
          >
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
        </div>
    );
  }
}

export default connect(state => (state.app))(App);
