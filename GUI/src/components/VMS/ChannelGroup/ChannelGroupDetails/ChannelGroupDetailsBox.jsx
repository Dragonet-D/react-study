import React, { useState, useCallback } from 'react';
import { connect } from 'dva';
import { makeStyles } from '@material-ui/core/styles';
import { I18n } from 'react-i18nify';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import {
  ChannelGroupInfo,
  ChannelGroupAssignTable,
  ChannelGroupCreateGroup
} from 'components/VMS/ChannelGroup';
import { dataUpdatedHandle } from 'utils/helpers';
import { ConfirmPage } from 'components/common';
import Typography from '@material-ui/core/Typography';
import { PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
import styles from '../ChannelGroup.module.less';

const useStyles = makeStyles(theme => {
  return {
    detailsContainer: {
      height: '100%',
      width: '80%',
      backgroundColor: theme.palette.background.paper,
      borderRadius: '4px',
      display: 'flex',
      flexDirection: 'column',
      color: theme.palette.text.primary,
      overflow: 'hidden',
      border: `1px solid ${theme.palette.primary.light}`,
      overflowY: 'auto'
    },
    boxTitle: { fontSize: '0.8vw' },
    detailsBox: { height: '93%', marginLeft: '15px', marginRight: '15px', position: 'relative' }
  };
});

function ChannelGroupDetailsBox(props) {
  const classes = useStyles();
  const {
    dispatch,
    global,
    VMSChannelGroup,
    handleAddPageStatus,
    handleClearDetails
  } = props;
  const { addPageStatus, namespace, groupDetails } = VMSChannelGroup;
  const { userId } = global;
  const moduleName = namespace;
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMsg, setConfirmMsg] = useState('');
  const [confirmType, setConfirmType] = useState('');

  function getChannelTree(obj = {}) {
    dispatch({
      type: `${moduleName}/getChannelTree`,
      payload: {
        userId,
        ...obj
      }
    });
  }
  function handleCreateNewGroup(obj = {}) {
    dispatch({
      type: `${moduleName}/createNewGroup`,
      payload: {
        createdId: userId,
        descriptionFields: {
          'Created Id': userId,
          'Group Description': obj.groupDesc,
          'Group Name': obj.groupName,
          'Parent Group Name': groupDetails.groupName
        },
        ...obj
      }
    }).then(res => {
      dataUpdatedHandle(res, I18n.t('uvms.channelGroup.detailsBox.createNewGroupTitle'), () => {
        handleAddPageStatus(false);
        handleClearDetails();
        getChannelTree();
      });
    });
  }
  function handleUpdateGroup(obj = {}, callBack) {
    dispatch({
      type: `${moduleName}/updateGroup`,
      payload: {
        userId,
        createdId: userId,
        descriptionFields: {
          'Created Id': userId,
          'Group Description': obj.groupDesc,
          'Group Name': obj.groupName,
          'Status Name': obj.status
        },
        ...obj
      }
    }).then(res => {
      dataUpdatedHandle(res, I18n.t('uvms.channelGroup.detailsBox.updateGroupTitle'), () => {
        callBack(false);
        getChannelTree();
        getChannelListFunc();
      });
    });
  }
  const getChannelListFunc = useCallback(
    (obj = {}) => {
      dispatch({
        type: `${moduleName}/getChannelList`,
        payload: {
          userId,
          pageNo: PAGE_NUMBER,
          pageSize: PAGE_SIZE,
          ...obj
        }
      });
    },
    [dispatch, moduleName, userId]
  );
  function handleDeletegroup(obj = {}) {
    dispatch({
      type: `${moduleName}/deleteGroup`,
      payload: {
        userId,
        groupId: groupDetails.groupId,
        parentGroupName: groupDetails.parentGroupName,
        groupName: groupDetails.groupName,
        ...obj
      }
    }).then(res => {
      dataUpdatedHandle(res, I18n.t('uvms.channelGroup.detailsBox.deleteGroup'), () => {
        getChannelTree();
        handleClearDetails(false);
      });
    });
  }
  function handleConfirmStatus() {
    setConfirmTitle(I18n.t('uvms.channelGroup.confirm.deleteTitle'));
    setConfirmMsg(I18n.t('uvms.channelGroup.confirm.deleteMsg'));
    setConfirmType('delete');
    setConfirmDialog(true);
  }
  // confirm page action setting
  function confirmActions() {
    switch (confirmType) {
      case 'delete':
        handleDeletegroup();
        setConfirmDialog(false);
        setConfirmType('');
        break;
      default:
        break;
    }
  }
  return (
    <div className={classes.detailsContainer}>
      {confirmDialog && (
        <ConfirmPage
          messageTitle={confirmTitle}
          message={confirmMsg}
          isConfirmPageOpen={confirmDialog}
          hanldeConfirmMessage={confirmActions}
          handleConfirmPageClose={() => setConfirmDialog(false)}
        />
      )}
      <div style={{ height: '100%' }}>
        {!addPageStatus && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: '15px'
            }}
          >
            <Typography component="h5">
              {I18n.t('uvms.channelGroup.detailsBox.headTitle')}
            </Typography>
            <IconButton className={styles.toolbar_button} onClick={handleConfirmStatus}>
              <Delete />
            </IconButton>
          </div>
        )}

        <div className={classes.detailsBox}>
          {!addPageStatus && (
            <ChannelGroupInfo
              groupDetails={groupDetails}
              addPageStatus={addPageStatus}
              handleUpdateGroup={handleUpdateGroup}
              userId={userId}
            />
          )}
          {!addPageStatus && <ChannelGroupAssignTable />}
          {addPageStatus && (
            <ChannelGroupCreateGroup
              groupDetails={groupDetails}
              handleAddPageStatus={handleAddPageStatus}
              handleCreateNewGroup={handleCreateNewGroup}
              // loading={loading.effects[`${moduleName}/createNewGroup`]}
            />
          )}
        </div>
      </div>
    </div>
  );
}

ChannelGroupDetailsBox.defaultProps = {
  handleAddPageStatus: () => {},
  handleClearDetails: () => {}
};

ChannelGroupDetailsBox.propTypes = {
  handleAddPageStatus: PropTypes.func,
  handleClearDetails: PropTypes.func
};

export default connect(({ global, VMSChannelGroup }) => ({
  global,
  VMSChannelGroup
}))(ChannelGroupDetailsBox);
