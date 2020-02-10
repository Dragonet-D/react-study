import React, { useState, useEffect, useCallback } from 'react';
import Typography from '@material-ui/core/Typography';
import { I18n } from 'react-i18nify';
import { TextField, ToolTip, NoData, ScrollBar } from 'components/common';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'dva';
import { groupSearchByName } from '../utils';

const useStyles = makeStyles(theme => {
  return {
    list_wrapper: {
      position: 'relative',
      height: 'calc(100% - 80px)',
      minHeight: 'calc(100% - 80px)',
      overflow: 'hidden'
    },
    item_active: {
      backgroundColor: theme.palette.background.default
    },
    item: {
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: theme.palette.background.default
      }
    },
    item_text: {
      width: '99.99%',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    noData: {
      padding: theme.spacing(1),
      textAlign: 'center'
    }
  };
});

let timer = null;

function GroupSearch(props) {
  const moduleName = 'faceEnrollment';
  const classes = useStyles();
  const { faceEnrollment, dispatch } = props;
  const { groupsData } = faceEnrollment;
  const [activeItemIndex, setActiveItemIndex] = useState(-1);
  const [searchValue, setSearchValue] = useState('');
  const [groupsDataSource, setGroupsDataSource] = useState([]);

  const getGroupsList = useCallback(
    (id = '') => {
      dispatch({
        type: `${moduleName}/getFrsGroups`,
        payload: id
      });
    },
    [dispatch]
  );

  useEffect(() => {
    setActiveItemIndex(-1);
    setGroupsDataSource(groupsData);
  }, [groupsData]);

  useEffect(() => {
    getGroupsList();
  }, [getGroupsList]);

  const handleItemClick = (index, item) => () => {
    dispatch({
      type: `${moduleName}/handleSearchPersonInformation`,
      payload: {
        pageNo: 0
      }
    });
    if (activeItemIndex === index) {
      setActiveItemIndex(-1);
      dispatch({
        type: `${moduleName}/handleChoseGroupData`,
        payload: {}
      });
    } else {
      setActiveItemIndex(index);
      dispatch({
        type: `${moduleName}/handleChoseGroupData`,
        payload: item
      });
    }
  };

  function handleSearchChange(e) {
    const { value } = e.target;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      setGroupsDataSource(groupSearchByName(groupsData, value));
    }, 400);
    setSearchValue(value);
  }

  return (
    <>
      <Typography component="h5">{I18n.t('vap.face.faceEnrollment.group')}</Typography>
      <TextField
        placeholder={I18n.t('vap.face.faceEnrollment.groupName')}
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
      <div className={classes.list_wrapper}>
        {groupsDataSource.length > 0 ? (
          <ScrollBar>
            <List>
              {groupsDataSource.map((item, index) => (
                <ToolTip title={item.name} key={item.id}>
                  <ListItem
                    className={`${activeItemIndex === index && classes.item_active} ${
                      classes.item
                    }`}
                    onClick={handleItemClick(index, item)}
                  >
                    <div className={classes.item_text}>{item.name}</div>
                  </ListItem>
                </ToolTip>
              ))}
            </List>
          </ScrollBar>
        ) : (
          <NoData />
        )}
      </div>
    </>
  );
}

export default connect(({ faceEnrollment, global }) => ({
  global,
  faceEnrollment
}))(GroupSearch);
