import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import { I18n } from 'react-i18nify';
import C from 'classnames';
import _ from 'lodash';
import Chip from './Chip';
import ToolTip from './ToolTip';

const styles = theme => {
  const headerHeight = '40px';
  return {
    form_control: {
      width: '100%',
      margin: '8px 0 8px 0'
    },
    select_render: {
      display: 'flex',
      flexWrap: 'wrap'
    },
    list_item_text: {
      textAlign: 'center',
      height: '100%'
    },
    list_header: {
      display: 'flex',
      height: headerHeight
    },
    header_wrapper: {
      padding: 0,
      height: headerHeight
    },
    active_color: {
      color: theme.palette.secondary.dark
    },
    condition: {
      '&:hover': {
        color: theme.palette.secondary.dark
      }
    },
    quick_select: {
      lineHeight: headerHeight
    },
    item_text: {
      width: '100px'
    },
    item_text_content: {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      display: 'block'
    },
    select_content: {
      maxWidth: '500px',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      display: 'block'
    },
    no_data: {
      height: headerHeight,
      lineHeight: headerHeight
    },
    chip: {
      height: '20px'
    }
  };
};

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 250
    }
  }
};

function MultipleSelect(props) {
  const {
    onSelect,
    value,
    disabled,
    selectOptions,
    label,
    identify,
    classes,
    noDataDesc,
    style,
    error,
    errorMessage,
    className,
    keyValue,
    dataIndex
  } = props;
  const [activeIndex, setActiveIndex] = useState(-1);
  const [actions] = useState([
    I18n.t('component.common.selectAll'),
    ' - ',
    I18n.t('component.common.clear')
  ]);
  useEffect(() => {
    setActiveIndex(-1);
  }, [selectOptions, value]);

  // select change
  function handleChange(event) {
    const { value } = event.target;
    setActiveIndex(-1);
    onSelect(value);
  }

  // delete
  const handleDelete = e => event => {
    const clone = value.slice();
    if (disabled) {
      return;
    }
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    clone.splice(clone.indexOf(e), 1);
    onSelect(clone);
  };

  // the header condition change
  function conditionChange(e, index, event) {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    if (index === 1) return;
    switch (e) {
      case actions[0]:
        if (activeIndex === 0) return;
        onSelect(keyValue ? selectOptions.map(item => item[dataIndex.value]) : selectOptions);
        setActiveIndex(index);
        break;
      case actions[2]:
        if (!value.length) return;
        onSelect([]);
        setActiveIndex(-1);
        break;
      default:
        break;
    }
  }

  // for stopping propagation
  function conditionWrapperClick(event) {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
  }

  function handleActiveIndex(index) {
    const isActive =
      index === activeIndex || (selectOptions.length === value.length && index === 0);
    return `${isActive ? classes.active_color : ''} ${index === 1 ? '' : classes.condition} ${
      classes.quick_select
    }`;
  }
  return (
    <FormControl
      className={C(classes.form_control, className)}
      disabled={disabled}
      style={style}
      error={error}
    >
      <InputLabel htmlFor={`multiple_select_${identify}`}>{label}</InputLabel>
      <Select
        MenuProps={MenuProps}
        multiple
        value={Array.isArray(value) ? value : []}
        onChange={handleChange}
        input={<Input id={`multiple_select_${identify}`} />}
        renderValue={selected => {
          return (
            <div className={classes.select_render}>
              {Array.isArray(selected) &&
                selected.map(value => {
                  if (keyValue) {
                    const currentItem =
                      selectOptions[_.findIndex(selectOptions, [dataIndex.value, value])];
                    const currentKey = _.get(currentItem, dataIndex.key);
                    const currentValue = _.get(currentItem, dataIndex.value);
                    const currentName = _.get(currentItem, dataIndex.name);
                    return (
                      <Chip
                        className={classes.chip}
                        key={currentKey}
                        label={
                          <ToolTip title={currentName}>
                            <span className={classes.select_content}>{currentName}</span>
                          </ToolTip>
                        }
                        onDelete={handleDelete(currentValue)}
                      />
                    );
                  } else {
                    return (
                      <Chip
                        className={classes.chip}
                        key={value}
                        label={
                          <ToolTip title={value}>
                            <span className={classes.select_content}>{value}</span>
                          </ToolTip>
                        }
                        onDelete={handleDelete(value)}
                      />
                    );
                  }
                })}
            </div>
          );
        }}
      >
        <MenuItem onClick={conditionWrapperClick} className={classes.header_wrapper}>
          <ListItemText className={classes.list_item_text} onClick={conditionWrapperClick}>
            {selectOptions.length ? (
              <div className={classes.list_header}>
                {actions.map((item, index) => {
                  return (
                    <div
                      style={{
                        flex: index !== 1 ? 1 : 0,
                        textAlign: index === 0 ? 'right' : 'left',
                        margin: '0 2px'
                      }}
                      key={item}
                      onClick={conditionChange.bind(this, item, index)}
                      className={handleActiveIndex(index)}
                    >
                      {item}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div onClick={conditionWrapperClick} className={classes.no_data}>
                {noDataDesc}
              </div>
            )}
          </ListItemText>
        </MenuItem>
        {selectOptions.map((item, index) => {
          const itemKey = keyValue ? _.get(item, dataIndex.key) : item;
          const itemValue = keyValue ? _.get(item, dataIndex.value) : item;
          const itemName = keyValue ? _.get(item, dataIndex.name) : item;
          return (
            <MenuItem key={itemKey || String(index)} value={itemValue} title={itemName}>
              <Checkbox checked={Array.isArray(value) && value.includes(itemValue)} />
              <ListItemText
                primary={<span className={classes.item_text_content}>{itemName}</span>}
                className={classes.item_text}
              />
            </MenuItem>
          );
        })}
      </Select>
      {error && errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}
    </FormControl>
  );
}

MultipleSelect.defaultProps = {
  label: 'Select Some',
  selectOptions: [],
  value: [],
  identify: Math.random(),
  disabled: false,
  noDataDesc: 'No Data',
  style: {},
  keyValue: false
};
MultipleSelect.propTypes = {
  label: PropTypes.string,
  selectOptions: PropTypes.array,
  value: PropTypes.array,
  onSelect: PropTypes.func.isRequired,
  identify: PropTypes.any,
  disabled: PropTypes.bool,
  noDataDesc: PropTypes.string,
  style: PropTypes.object,
  keyValue: PropTypes.bool
};

export default withStyles(styles)(MultipleSelect);
