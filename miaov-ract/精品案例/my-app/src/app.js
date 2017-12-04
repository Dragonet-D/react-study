import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import './common/style/goodsSort.css';
import goodsSortData from './common/data/goodsSortData';


class App extends React.Component {
  render() {

    return (
      <div id="wrap">
        <section id="section">
          <nav id="choose">
            你的选择是:
          </nav>
          <ul id="type">

          </ul>
        </section>
      </div>
    )
  }
}

ReactDOM.render(
  <App/>,
  document.querySelector('#root')
);