import React, { useState, useCallback } from 'react';
import { I18n } from 'react-i18nify';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { ToolTip, ConfirmPage } from 'components/common';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ReplyIcon from '@material-ui/icons/Reply';
import store from '@/index';
import msg from 'utils/messageCenter';
import { dataUpdatedHandle } from 'utils/helpers';
import FaceDialog from '../../FaceDialog';
import GroupList from './GroupList';
import AddGroup from './AddOrUpdateGroup';

const useStyles = makeStyles(() => {
  return {
    tab_btn: {
      padding: 0
    },
    dialog_width: {
      width: '700px',
      maxWidth: '700px',
      height: 500
    },
    title: {
      display: 'flex',
      alignItems: 'center'
    },
    add_group: {
      marginLeft: 'auto'
    }
  };
});

function GroupManagement(props) {
  const moduleName = 'faceEnrollment';
  const { dispatch } = store;
  const classes = useStyles();
  const { open, onClose, allTheAppsData, searchMode, groupsDataTable, userId } = props;
  const [value, setValue] = useState(0);
  const [groupItemData, setGroupItemData] = useState({});
  const [groupData, setGroupData] = useState({});
  const [isSpecialWatch, setIsSpecialWatch] = useState(false);
  const [deleteGroupStatus, setDeleteGroupStatus] = useState(false);
  const [handledGroupData, setHandledGroupData] = useState({});

  const isSaveDisabled =
    (_.isEmpty(groupItemData) && _.isEmpty(groupData.appIDs)) || _.isEmpty(groupData.name);
  const isSpecialWatchListHas = groupsDataTable.some(
    item => item.name === I18n.t('vap.face.specialWatchList.specialWatchList')
  );

  const handleChange = (index, target) => () => {
    setIsSpecialWatch(target === 'addSpecial');
    setValue(index);
  };

  const updateGroupList = useCallback(() => {
    if (searchMode === 'group') {
      // update persons list
      dispatch({
        type: `${moduleName}/handleChoseGroupData`,
        payload: {}
      });
      dispatch({
        type: `${moduleName}/getFrsGroups` // update the search group list
      });
    } else {
      // update persons list (search mode person)
      dispatch({
        type: `${moduleName}/handleSearchPersonInformation`,
        payload: {}
      });
    }
  }, [dispatch, searchMode]);

  const handleGroupInfo = useCallback(
    (target, data) => {
      if (value !== 0 && isSaveDisabled) return;
      switch (target) {
        case 'edit':
          setGroupItemData(data);
          setValue(2);
          setIsSpecialWatch(data.name === 'Special Watch List');
          break;
        case 'delete':
          setHandledGroupData(data);
          setDeleteGroupStatus(true);
          break;
        default:
          break;
      }
    },
    [isSaveDisabled, value]
  );

  const getData = useCallback(e => {
    setGroupData(e);
  }, []);

  const handleSave = useCallback(() => {
    switch (value) {
      case 1:
        dispatch({
          type: `${moduleName}/vapFrsAddGroups`,
          payload: {
            userId,
            ...groupData
          }
        })
          .then(res => {
            dataUpdatedHandle(res, I18n.t('vap.face.faceEnrollment.addGroup'), () => {
              updateGroupList();
              setValue(0);
              dispatch({
                type: `${moduleName}/getFrsGroupsTable`,
                payload: ''
              });
            });
          })
          .catch(e => {
            if (e && e.message) {
              msg.error(e.message, I18n.t('vap.face.faceEnrollment.addGroup'));
            }
          });
        break;
      case 2:
        dispatch({
          type: `${moduleName}/vapFrsUpdateGroups`,
          payload: {
            userId,
            id: groupItemData.id,
            groupInfo: groupData
          }
        })
          .then(res => {
            dataUpdatedHandle(res, I18n.t('vap.face.faceEnrollment.updateGroup'), () => {
              updateGroupList();
              setValue(0);
              dispatch({
                type: `${moduleName}/getFrsGroupsTable`,
                payload: ''
              });
            });
          })
          .catch(e => {
            if (e && e.message) {
              msg.error(e.message, I18n.t('vap.face.faceEnrollment.updateGroup'));
            }
          });
        break;
      default:
        break;
    }
  }, [dispatch, groupData, groupItemData.id, updateGroupList, userId, value]);

  function deleteGroupConfirm() {
    dispatch({
      type: `${moduleName}/vapFrsDeleteGroup`,
      payload: handledGroupData.id
    })
      .then(res => {
        dataUpdatedHandle(res, 'Delete Group', () => {
          updateGroupList();
          setDeleteGroupStatus(false);
          dispatch({
            type: `${moduleName}/getFrsGroupsTable`
          });
        });
      })
      .catch(e => {
        if (e && e.message) {
          msg.error(e.message, 'Delete Group');
        }
      });
  }

  function deleteGroupCancel() {
    setDeleteGroupStatus(false);
  }
  return (
    <>
      <ConfirmPage
        isConfirmPageOpen={deleteGroupStatus}
        message={`${I18n.t('vap.remindInformation.deleteGroupRemind')}`}
        messageTitle={I18n.t('vap.face.faceEnrollment.deleteGroup')}
        hanldeConfirmMessage={deleteGroupConfirm}
        handleConfirmPageClose={deleteGroupCancel}
      />
      <FaceDialog
        open={open}
        title={I18n.t('vap.button.groupManagement')}
        handleClose={onClose}
        dialogWidth={classes.dialog_width}
        handleSave={handleSave}
        isActionNeed={value !== 0}
        disableSave={isSaveDisabled}
      >
        <Typography component="div" hidden={value !== 0}>
          <div className={classes.title}>
            <Typography component="span" color="textSecondary">
              {I18n.t('vap.face.faceEnrollment.groupList')}
            </Typography>
            <ToolTip title={I18n.t('vap.face.faceEnrollment.addGroup')}>
              <IconButton className={classes.add_group} onClick={handleChange(1)}>
                <AddIcon />
              </IconButton>
            </ToolTip>
            {!isSpecialWatchListHas && (
              <ToolTip title={I18n.t('vap.face.faceEnrollment.addSpecialWatchListGroup')}>
                <IconButton onClick={handleChange(1, 'addSpecial')}>
                  <AddCircleIcon />
                </IconButton>
              </ToolTip>
            )}
          </div>
          <GroupList handleGroupInfo={handleGroupInfo} />
        </Typography>
        {value === 1 && (
          <>
            <div className={classes.title}>
              <IconButton onClick={handleChange(0)}>
                <ReplyIcon />
              </IconButton>
              <Typography component="span" color="textSecondary">
                {I18n.t('vap.face.faceEnrollment.addGroup')}
              </Typography>
            </div>
            <AddGroup
              isSpecialWatch={isSpecialWatch}
              getData={getData}
              dataSource={{}}
              allTheAppsData={allTheAppsData}
            />
          </>
        )}
        {value === 2 && (
          <>
            <div className={classes.title}>
              <IconButton onClick={handleChange(0)}>
                <ReplyIcon />
              </IconButton>
              <Typography component="span" color="textSecondary">
                {I18n.t('vap.face.faceEnrollment.editGroup')}
              </Typography>
            </div>
            <AddGroup
              isSpecialWatch={isSpecialWatch}
              getData={getData}
              dataSource={groupItemData}
              allTheAppsData={allTheAppsData}
            />
          </>
        )}
      </FaceDialog>
    </>
  );
}

GroupManagement.defaultProps = {
  onClose: () => {}
};

GroupManagement.propTypes = {
  onClose: PropTypes.func
};

export default GroupManagement;
