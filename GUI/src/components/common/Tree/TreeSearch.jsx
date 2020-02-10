/*
 * @Description: Tree Search
 * @Author: Kevin
 * @Email: baishi.wang@ncs.com.sg
 * @Date: 2019-07-21 14:40:29
 * @LastEditTime: 2019-08-26 17:25:26
 * @LastEditors: Kevin
 */

import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  searchArea: {
    marginBottom: theme.spacing(1),
    width: '90%'
  }
}));

export default function TreeSearch(props) {
  const { onSearchTree, searchFields } = props;
  const placeholderText = searchFields.map(item => item.title).join(', ');
  const classes = useStyles();
  return (
    <React.Fragment>
      <TextField
        onKeyDown={handleSearchEnterKeyDownEvent}
        className={classes.searchArea}
        placeholder={placeholderText}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          )
        }}
      />
    </React.Fragment>
  );

  function handleSearchEnterKeyDownEvent(event) {
    const { value } = event.target;
    const valueTrim = value.trim();
    const e = event || window.event;
    if (e && e.keyCode === 13) {
      if (onSearchTree) {
        onSearchTree(valueTrim);
      }
    }
  }
}

TreeSearch.defaultProps = {
  onSearchTree: () => {},
  searchFields: [
    {
      title: '',
      index: ''
    }
  ]
};

TreeSearch.propTypes = {
  onSearchTree: PropTypes.func,
  searchFields: PropTypes.array
};
