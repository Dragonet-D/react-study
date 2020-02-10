import React from 'react';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';

const TextFields = props => {
  const defaultInputProps = {
    maxLength: 140,
    minLength: 0
  };
  const { inputProps, ...rest } = props;
  let inputData = {};
  if (inputProps) {
    inputData = Object.assign({}, defaultInputProps, inputProps);
  } else {
    inputData = defaultInputProps;
  }
  return <TextField margin="dense" autoComplete="off" inputProps={inputData} {...rest} />;
};

TextFields.defaultProps = {
  label: '',
  onChange: () => {}
};

TextFields.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func
};

export default TextFields;
