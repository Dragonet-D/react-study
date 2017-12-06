import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import './common/style/goodsSort.css';
import goodsSortData from './common/data/goodsSortData';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: []
    }
  };

  onSelected = (elt, order) => {
    let {selected} = this.state;
    let inThere = selected.some((elt) => elt.order === order);
    if (inThere) {
      selected = selected.map(item => {
        if (item.order === order) {
          item.item = elt
        }
        return item
      })
    } else {
      selected.push({item: elt, order})
    }
    selected.sort((a, b) => a.order - b.order)
    this.setState({
      selected
    });
  };

  render() {
    let {selected} = this.state;
    let selectedComp = selected.map((elt) => {
      return (
        <mark key={elt.order}>
          {elt.item}
          <a href="javascript:">x</a>
        </mark>
      )
    })
    return (
      <div id="wrap">
        <section id="section">
          <nav id="choose">
            你的选择是:
            {
              selectedComp
            }
          </nav>
          <ul id="type">
            {
              goodsSortData.map((elt, index) => {
                return (
                  <li key={elt.id}>
                    {elt.sort}
                    {
                      elt.data.map((item, index) => {
                        return (
                          <a
                            key={item.id}
                            onClick={() => {
                              this.onSelected(item.desc, elt.order)
                            }}
                            href="javascript:"
                          >{item.desc}</a>
                        )
                      })
                    }
                  </li>
                )
              })
            }
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