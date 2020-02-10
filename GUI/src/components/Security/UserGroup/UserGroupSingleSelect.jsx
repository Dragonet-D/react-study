import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, FormControl, MenuItem, ListItemText, FormHelperText } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import _ from 'lodash';

const useStyles = makeStyles(() => ({
  select_wrap: {
    width: '100%'
  },
  item_text: {
    width: '100px',
    margin: 0
  },
  item_text_content: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: '90%',
    display: 'block'
  },
  select: {
    padding: '4px 0 4px'
  },
  select_disabled: {
    padding: '7px 0 6px'
  }
}));

const defaultMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 250
    }
  }
};

function SingleSelect(props) {
  const {
    onSelect,
    selectOptions,
    value,
    disabled,
    MenuProps,
    error,
    errorMessage,
    className,
    dataIndex,
    keyValue,
    required
  } = props;
  const classes = useStyles();

  function handleChange(e) {
    const { value } = e.target;
    onSelect(value);
  }
  const isDisabled = (disabled && !value) || (!disabled && !value);
  return (
    <FormControl
      className={`${classes.select_wrap} ${className}`}
      disabled={disabled}
      error={error}
      required={required}
    >
      <Select
        MenuProps={Object.assign({}, defaultMenuProps, MenuProps)}
        value={value}
        inputProps={{
          classes: {
            root: isDisabled ? classes.select_disabled : classes.select
          }
        }}
        onChange={handleChange}
      >
        {selectOptions
          .filter(item => item)
          .map(item =>
            keyValue ? (
              <MenuItem key={_.get(item, dataIndex.key)} value={_.get(item, dataIndex.value)}>
                <ListItemText primary={_.get(item, dataIndex.name)} className={classes.item_text} />
              </MenuItem>
            ) : (
              <MenuItem key={item} value={item}>
                <ListItemText primary={item} className={classes.item_text} />
              </MenuItem>
            )
          )}
      </Select>
      {error && errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}
    </FormControl>
  );
}

SingleSelect.defaultProps = {
  selectOptions: [],
  value: 'Default Title',
  disabled: false,
  MenuProps: {},
  error: false,
  errorMessage: '',
  className: '',
  dataIndex: {},
  keyValue: false,
  required: false
};
SingleSelect.propTypes = {
  selectOptions: PropTypes.array,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSelect: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  MenuProps: PropTypes.object,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  className: PropTypes.string,
  dataIndex: PropTypes.object,
  keyValue: PropTypes.bool,
  required: PropTypes.bool
};

export default SingleSelect;
