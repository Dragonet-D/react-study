import React, { Fragment, useState, useEffect } from 'react';
import { I18n } from 'react-i18nify';
import { TextField } from 'components/common';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import { connect } from 'dva';

let timer = null;

function GroupSearch(props) {
  const moduleName = 'VMSChannelGroup';
  const { dispatch } = props;
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    getGroupsList();
  }, []);

  function getGroupsList(id = '') {
    dispatch({
      type: `${moduleName}/getFrsGroups`,
      payload: id
    });
  }

  function handleSearchChange(e) {
    const { value } = e.target;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      getGroupsList(value);
    }, 400);
    setSearchValue(value);
  }

  return (
    <Fragment>
      <TextField
        placeholder={I18n.t('vap.face.VMSChannelGroup.groupName')}
        label={I18n.t('vap.label.searchGroup')}
        value={searchValue}
        fullWidth
        onChange={handleSearchChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          )
        }}
      />
    </Fragment>
  );
}

export default connect(({ VMSChannelGroup, global }) => ({
  global,
  VMSChannelGroup
}))(GroupSearch);
