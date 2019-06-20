import React, { Component } from 'react';
import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';

const styles = Theme => ({
  underline: {
    '&:before': {
      borderBottom: `1px solid ${Theme.typography.caption.color}`
    },
    '&:after': {
      borderBottomColor: Theme.palette.secondary.main
    }
  },
  input: {
    color: Theme.palette.text.primary,
    '&:after': {
      borderBottomColor: Theme.palette.secondary.main
    }
  }
});
@withStyles(styles)
class Inputs extends Component {
  constructor(props) {
    super(props);
    this.defaultInputProps = {
      maxLength: 128,
      minLength: 0
    };
  }

  render() {
    const { inputProps } = this.props;
    let inputData = {};
    if (inputProps) {
      inputData = Object.assign({}, this.defaultInputProps, inputProps);
    } else {
      inputData = this.defaultInputProps;
    }
    return <Input autoComplete="off" {...this.props} inputProps={inputData} />;
  }
}

export default Inputs;
