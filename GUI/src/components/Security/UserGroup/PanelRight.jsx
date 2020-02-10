import React from 'react';
import { I18n } from 'react-i18nify';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core';
import { DeleteForever } from '@material-ui/icons';
import { Permission } from 'components/common';
import UserGroupDetail from './UserGroupDetail';
import AddGroup from './UserGroupAddGroup';

const useStyles = makeStyles(theme => {
  return {
    containerTitle: {
      display: 'flex',
      flexDirection: 'row-reverse'
    },
    containerRightTitle: {
      padding: '15px 15px 0 0'
    },
    tipsMessage: {
      color: theme.palette.text.primary,
      textAlign: 'center',
      marginTop: '20%',
      fontSize: '20px'
    },
    showDelete: {
      display: 'none',
      transition: 'display 0ms 300ms'
    },
    transitionHeight: {
      height: 44,
      transition: 'height 300ms 0ms'
    }
  };
});
function PanelRight(props) {
  const {
    mode,
    userId,
    groupList,
    backToSelectPage,
    isAdmin,
    userGroupId,
    domainList,
    allUsers,
    allChannels,
    groupDetail,
    isShowDeleteBtn,
    dispatch,
    handleDisconnectComfirm,
    handleCancel,
    isAdd,
    handleSave,
    changeCurrentGroupId,
    currentGroupId,
    checkedUsers,
    modelsList
  } = props;
  const classes = useStyles();
  return (
    <React.Fragment>
      {!mode && (
        <div
          className={classNames(classes.containerTitle, classes.containerRightTitle, {
            [classes.transitionHeight]: isShowDeleteBtn && userGroupId
          })}
          type="tool-bar"
        >
          <Permission materialKey="M4-7">
            <span
              className={classNames({
                [classes.showDelete]: !(isShowDeleteBtn && userGroupId)
              })}
              title={I18n.t('security.userGroup.tooltips.deleteGroup')}
            >
              <DeleteForever onClick={handleDisconnectComfirm} />
            </span>
          </Permission>
        </div>
      )}
      <div type="window-body">
        {userGroupId ? (
          isAdd ? (
            <AddGroup
              handleCancel={handleCancel}
              handleSave={newGroup => handleSave(newGroup)}
              groupList={groupList}
              userId={userId}
              userGroupId={userGroupId}
              isAdmin={isAdmin}
              changeCurrentGroupId={id => changeCurrentGroupId(id)}
              domainList={domainList}
              dispatch={dispatch}
            />
          ) : (
            <UserGroupDetail
              groupList={groupList}
              backToSelectPage={backToSelectPage}
              isAdmin={isAdmin}
              userGroupId={userGroupId}
              domainList={domainList}
              allUsers={allUsers}
              allChannels={allChannels}
              groupDetail={groupDetail}
              userId={userId}
              dispatch={dispatch}
              currentGroupId={currentGroupId}
              checkedUsers={checkedUsers}
              modelsList={modelsList}
              mode={mode}
              {...props}
            />
          )
        ) : isAdd ? (
          <AddGroup
            handleCancel={handleCancel}
            handleSave={newGroup => handleSave(newGroup)}
            groupList={groupList}
            userId={userId}
            userGroupId={userGroupId}
            isAdmin={isAdmin}
            userGroupId={userGroupId}
            domainList={domainList}
            dispatch={dispatch}
          />
        ) : (
          <div className={classes.tipsMessage}>
            {I18n.t('security.userGroup.content.pleaseSelectUserGroup')}
          </div>
        )}
      </div>
    </React.Fragment>
  );
}
export default PanelRight;
