import React from 'react';
import Input from '@material-ui/core/Input';

const Inputs = props => {
  const defaultInputProps = {
    maxLength: 50,
    minLength: 0
  };
  const { inputProps, ...rest } = props;
  let inputData = {};
  if (inputProps) {
    inputData = Object.assign({}, defaultInputProps, inputProps);
  } else {
    inputData = defaultInputProps;
  }
  return <Input autoComplete="off" inputProps={inputData} {...rest} />;
};

export default Inputs;
