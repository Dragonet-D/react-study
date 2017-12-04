import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import './common/style/goodsSort.css';
import goodsSortData from './common/data/goodsSortData';

ReactDOM.render(
  <div id="wrap">
    <section id="section">
      <nav id="choose">
        你的选择是:
      </nav>
      <ul id="type">

      </ul>
    </section>
  </div>,
  document.querySelector('#root')
);