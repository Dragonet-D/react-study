import React, { Component } from 'react';
import _ from 'lodash';
import { Input } from 'components/common';

class ToDoInput extends Component {
  constructor(props) {
    super(props);
    this.getValue = _.debounce(this.handleChange, 300);
  }

  handleChange = e => {
    console.log(e.target);
  };

  render() {
    return <Input onChange={this.handleChange} />;
  }
}

export default ToDoInput;
