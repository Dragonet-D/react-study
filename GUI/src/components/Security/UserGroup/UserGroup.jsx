import React from 'react';
import { withStyles } from '@material-ui/core';
import { I18n } from 'react-i18nify';
import { Button, ConfirmPage } from 'components/common';
import PanelLeft from './PanelLeft';
import PanelRight from './PanelRight';

const styles = theme => ({
  root: {
    height: 'calc(100% - 47px)',
    width: '100%',
    display: 'flex',
    borderRadius: '4px',
    marginTop: '6px'
  },
  containerLeft: {
    overflow: 'auto',
    // height: '100%',
    backgroundColor: theme.palette.background.paper,
    borderRadius: '4px',
    marginRight: '6px',
    color: theme.palette.text.primary,
    border: `1px solid ${theme.palette.primary.light}`,
    padding: theme.spacing(2)
  },
  containerRight: {
    // height: '100%',
    width: '80%',
    backgroundColor: theme.palette.background.paper,
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    color: theme.palette.text.primary,
    overflow: 'hidden',
    border: `1px solid ${theme.palette.primary.light}`,
    overflowY: 'auto'
  }
});

class UserGroupManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdd: false,
      userGroupId: '',
      groupList: '',
      userGroupTree: [],
      isAdmin: '',
      isShowDeleteBtn: false,
      deleteConfirmOpen: false,
      activeIndex: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    const { groupList, id, userGroupTree, userGroupId, isAdmin, isAdd } = this.state;
    if (nextProps.groupList !== groupList) {
      this.setState({
        groupList: nextProps.groupList
      });
    }
    if (nextProps.userGroupId !== id) {
      this.setState({
        userGroupId: nextProps.userGroupId
      });
    }
    if (nextProps.userGroupTree !== userGroupTree) {
      this.setState({
        userGroupTree: nextProps.userGroupTree
      });
    }
    if (nextProps.currentGroupId !== userGroupId) {
      this.setState({
        userGroupId: nextProps.currentGroupId
      });
    }
    if (nextProps.isAdmin !== isAdmin) {
      this.setState({
        isAdmin: nextProps.isAdmin
      });
    }
    if (nextProps.isAdd !== isAdd) {
      this.setState({
        isAdd: nextProps.isAdd
      });
    }
  }

  componentDidMount() {
    const { dispatch, userId } = this.props;
    dispatch({
      type: 'securityUserGroup/getListGroup',
      payload: {
        userId
      }
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'securityUserGroup/updateUserGroupId',
      payload: {}
    });
    dispatch({
      type: 'securityUserGroup/clearAll'
    });
  }

  handleIsAdd = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'securityUserGroup/changeAddPageStatus',
      payload: {
        data: true
      }
    });
  };

  handleCancel = () => {
    const { dispatch } = this.props;
    // const { userGroupId } = this.state;
    // if (userGroupId) {
    //   const obj = {
    //     userId,
    //     groupId: userGroupId
    //   };
    //   dispatch({
    //     type: 'securityUserGroup/getGroupDetail',
    //     payload: {
    //       obj
    //     }
    //   });
    // }
    dispatch({
      type: 'securityUserGroup/changeAddPageStatus',
      payload: {
        data: false
      }
    });
  };

  handleSave = newGroup => {
    const { dispatch, userId } = this.props;
    dispatch({
      type: 'securityUserGroup/createUserGroup',
      payload: { newGroup, userid: userId }
    });
  };

  backToSelectPage = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'securityUserGroup/updateUserGroupId',
      payload: {}
    });
    dispatch({
      type: 'securityUserGroup/changeAddPageStatus',
      payload: {
        data: false
      }
    });
  };

  btnDelete = () => {
    const { userGroupId } = this.state;
    const { dispatch, cuttentGroupName, userId } = this.props;
    const groupIdList = [];
    groupIdList.push(userGroupId);

    const groupNames = [];
    groupNames.push(cuttentGroupName);
    const obj = { groupIds: groupIdList, groupNames };
    dispatch({
      type: 'securityUserGroup/deleteUserGroup',
      payload: { currentId: userGroupId, userid: userId, obj }
    });
    this.handleDisconnectConfirmPageClose();
  };

  // when click disconnect user button, it will open comfirm page;
  handleDisconnectComfirm = () => {
    this.setState({
      deleteConfirmOpen: true,
      confirmMessageTitle: 'Delete User Group',
      confirmMessage: 'You are trying to delete the user group, please confirm.'
    });
  };

  handleDisconnectConfirmPageClose = () => {
    this.setState({
      deleteConfirmOpen: false
    });
  };

  changeCurrentGroupId = id => {
    this.setState({
      userGroupId: id
    });
  };

  isCurrentIdhasChild = list => {
    const { userGroupId } = this.state;
    if (!list) return;
    list.forEach(ele => {
      if (ele.groupId === userGroupId && ele.children && ele.children.length > 0) {
        this.state.isShowDeleteBtn = false;
      } else if (ele.groupId !== userGroupId && ele.children && ele.children.length > 0) {
        this.isCurrentIdhasChild(ele.children);
      } else if (ele.groupId === userGroupId && !ele.children) {
        this.state.isShowDeleteBtn = true;
      }
    });
  };

  setActiveIndex = index => {
    const { setIsTreeList } = this.props;
    if (index === 0) {
      setIsTreeList(true);
    } else {
      setIsTreeList(false);
    }
    this.setState({
      activeIndex: index
    });
  };

  handleBack = () => {
    this.setActiveIndex(0);
  };

  render() {
    const {
      classes,
      userId,
      groupList,
      treeList,
      domainList,
      allUsers,
      dispatch,
      allChannels,
      groupDetail,
      currentGroupId,
      checkedUsers,
      modelsList,
      setGroupId,
      mode,
      currentGroup
    } = this.props;
    const {
      isAdd,
      userGroupId,
      isAdmin,
      isShowDeleteBtn,
      confirmMessage,
      confirmMessageTitle,
      deleteConfirmOpen,
      activeIndex
    } = this.state;
    this.isCurrentIdhasChild(treeList);
    return (
      <div className={classes.root}>
        <div
          className={classes.containerLeft}
          style={{ width: mode && activeIndex === 0 ? '100%' : '20%' }}
        >
          <PanelLeft
            mode={mode}
            userId={userId}
            treeList={treeList}
            dispatch={dispatch}
            handleIsAdd={this.handleIsAdd}
            setActiveIndex={this.setActiveIndex}
            setGroupId={setGroupId}
            currentGroup={currentGroup}
          />
        </div>
        <div
          className={classes.containerRight}
          style={{ display: mode && activeIndex === 0 ? 'none' : 'block' }}
        >
          {mode && (
            <Button
              size="small"
              color="primary"
              onClick={this.handleBack}
              style={{ float: 'right' }}
            >
              {I18n.t('global.button.close')}
            </Button>
          )}
          <PanelRight
            mode={mode}
            userId={userId}
            groupList={groupList}
            backToSelectPage={this.backToSelectPage}
            isAdmin={isAdmin}
            userGroupId={userGroupId}
            domainList={domainList}
            allUsers={allUsers || []}
            allChannels={allChannels}
            groupDetail={groupDetail}
            dispatch={dispatch}
            handleDisconnectComfirm={this.handleDisconnectComfirm}
            handleCancel={this.handleCancel}
            isAdd={isAdd}
            handleSave={this.handleSave}
            changeCurrentGroupId={this.changeCurrentGroupId}
            currentGroupId={currentGroupId}
            checkedUsers={checkedUsers}
            modelsList={modelsList}
            isShowDeleteBtn={isShowDeleteBtn}
            {...this.props}
          />
        </div>

        <ConfirmPage
          message={confirmMessage}
          messageTitle={confirmMessageTitle}
          isConfirmPageOpen={deleteConfirmOpen}
          hanldeConfirmMessage={this.btnDelete}
          handleConfirmPageClose={this.handleDisconnectConfirmPageClose}
        />
      </div>
    );
  }
}

export default withStyles(styles)(UserGroupManagement);
