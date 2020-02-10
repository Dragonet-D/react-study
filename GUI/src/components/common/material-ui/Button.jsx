import React from 'react';
import Button from '@material-ui/core/Button';

function CustomerButton(props) {
  const { children, ...rest } = props;
  return (
    <Button
      variant="text"
      color="primary"
      style={{
        textTransform: 'none'
      }}
      {...rest}
    >
      {children}
    </Button>
  );
}

export default CustomerButton;
