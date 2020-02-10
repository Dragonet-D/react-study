/* eslint-disable indent */
import React, { Component, Fragment } from 'react';
import _ from 'lodash';
import { I18n } from 'react-i18nify';
import { withStyles } from '@material-ui/core/styles';
import { Tabs, Tab, MenuItem, FormControl, AppBar, Slide, Paper } from '@material-ui/core/';
import { ButtonSmall as Button } from 'components/common/material-ui/CellWithTooltip';
import * as constant from 'commons/constants/commonConstant';
import { Permission, TextField } from 'components/common';
import msg from 'utils/messageCenter';
import UserTab from './RightUserTab';
import ChannelTab from './RightChannelTab';
import ButtonToolbar from './UserGroupButtonToolbar';
import VaEnginesTab from './RightVaEnginesTab';

const styles = theme => ({
  textField: {
    marginLeft: '20px',
    marginRight: '20px',
    width: 300
  },
  menu: {
    width: 200
  },
  tabMargin: {
    marginTop: '20px'
  },
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500
  },
  toolbarBG: {
    backgroundColor: theme.palette.background.default
  },
  toolbarLeft: {
    flex: '0 0 auto',
    paddingLeft: '15px',
    width: '90%'
  },
  toolbarSpace: {
    flex: '1 1 100%'
  },
  toolbarTitle: {
    color: theme.palette.text.primary,
    fontSize: '16px'
  },
  tabsRoot: {},
  tabsIndicator: {},
  tabRoot: {
    color: `${theme.palette.text.primary} !important`,
    textTransform: 'initial',
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover': {
      color: theme.palette.action.hover,
      opacity: 1
    },
    '&$tabSelected': {
      color: theme.palette.action.active,
      fontWeight: theme.typography.fontWeightMedium
    },
    '&:focus': {
      color: theme.palette.action.active
    }
  },
  tabSelected: {},
  typography: {
    padding: theme.spacing(3)
  }
});
class GroupDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTable: 0,
      detail: {},
      oldDetail: {},
      checkedUsers: [],
      checkedUserId: [],
      isAssignUserId: [],
      allUsers: [],
      checkedChannelId: [],
      allChannels: [],
      groupId: '',
      domainName: '',
      invalid: {
        groupDescription: false,
        groupName: false
      },
      descriptionMessage: '',
      nameMessage: '',
      updateBtnVisibility: false,
      channelDeviceIds: [],
      channelPage: {
        page: 0,
        rowsPerPage: 5
      }
    };
    this.oldCheckedChannelIds = [];
    this.oldUserSelected = [];
    this.lastUserFilter = {};
    this.lastChannelLFilter = {};
    this.isResetPage = false;
  }

  handleChange = (event, value) => {
    const { dispatch, userId } = this.props;
    const { groupId, detail } = this.state;
    this.setState({
      currentTable: value
    });
    if (value === 0) {
      dispatch({
        type: 'securityUserGroup/getUserList',
        payload: {
          searchUserId: userId,
          // keyWord: key !== undefined ? key : '',
          groupId,
          pageNo: 0,
          pageSize: 5
        }
      });
    } else if (value === 'assignChannels') {
      const object = {
        pageNo: 0,
        pageSize: 5,
        groupId,
        uid: userId,
        groupName: detail.groupName,
        keyWord: ''
      };
      dispatch({
        type: 'securityUserGroup/getChannelList',
        payload: { object }
      });
    }
  };

  textFieldChange = name => event => {
    this.setState({
      updateBtnVisibility: true
    });
    const { detail } = this.state;
    const data = Object.assign({}, detail, {
      [name]: event.target.value
    });
    if (name === 'parentId') {
      this.setState({});
    }
    if (name === 'domainName') {
      this.setState({
        domainName: event.target.value
      });
    }
    if (event.target.value !== '' && name === 'groupDescription') {
      const { invalid } = this.state;
      invalid.groupDescription = false;
      this.setState({
        descriptionMessage: '',
        invalid
      });
    }
    if (event.target.value !== '' && name === 'groupName') {
      const { invalid } = this.state;
      invalid.groupName = false;
      this.setState({
        nameMessage: '',
        invalid
      });
    }
    this.setState({
      detail: data
    });
  };

  isSelected = (check, id) => {
    const { checkedUserId, checkedChannelId } = this.state;
    if (check === 'userCheck') {
      return checkedUserId.indexOf(id) !== -1;
    } else if (check === 'channelCheck') {
      return checkedChannelId.indexOf(id) !== -1;
    }
  };

  isAssigned = (check, id) => {
    const { isAssignUserId, checkedChannelId } = this.state;
    if (check === 'userCheck') {
      return isAssignUserId.indexOf(id) !== -1;
    } else if (check === 'channelCheck') {
      return checkedChannelId.indexOf(id) !== -1;
    }
  };

  handleCheckboxClick = (check, item) => {
    if (check === 'userCheck') {
      const { userUuid } = item;
      const { checkedUserId: newCheckedUserId } = this.state;
      const valueIndex = newCheckedUserId.indexOf(userUuid);
      if (valueIndex === -1) {
        newCheckedUserId.push(userUuid);
      }
      if (valueIndex !== -1) {
        newCheckedUserId.splice(valueIndex, 1);
      }
      this.setState({
        checkedUserId: newCheckedUserId
      });
    } else if (check === 'channelCheck') {
      const checkboxValue = {
        channelId: item.channelId,
        deviceId: item.deviceId
      };
      const { checkedChannelId, channelDeviceIds } = this.state;
      const newCheckedChannelId = checkedChannelId.slice();
      const valueIndex = newCheckedChannelId.indexOf(checkboxValue.channelId);
      const newChannelDeviceIds = channelDeviceIds.slice();
      let channelDeviceIndex = '';
      if (valueIndex === -1) {
        newCheckedChannelId.push(checkboxValue.channelId);
        newChannelDeviceIds.push(checkboxValue);
      }
      if (valueIndex !== -1) {
        newCheckedChannelId.splice(valueIndex, 1);
        newChannelDeviceIds.forEach((ele, index) => {
          if (ele.channelId === checkboxValue.channelId) channelDeviceIndex = index;
        });
        newChannelDeviceIds.splice(channelDeviceIndex, 1);
      }

      this.setState({
        checkedChannelId: newCheckedChannelId,
        channelDeviceIds: newChannelDeviceIds
      });
    }
  };

  handleSelectAllClick = (check, e) => {
    const { allUsers, isAssignUserId, allChannels } = this.state;
    if (check === 'userCheck') {
      const allChecked = e.target.checked;
      if (allChecked) {
        this.setState({
          checkedUserId: allUsers.map(item => {
            if (item) {
              return item.userUuid;
            }
            return item;
          })
        });
      } else {
        this.setState({
          checkedUserId: isAssignUserId.slice(0)
        });
      }
    } else if (check === 'channelCheck') {
      const allChecked = e.target.checked;
      if (allChecked) {
        this.setState({
          checkedChannelId: allChannels.map(item => item.channelId),
          channelDeviceIds: allChannels.map(item => {
            return { channelId: item.channelId, deviceId: item.deviceId };
          })
        });
      } else {
        this.setState({
          checkedChannelId: [],
          channelDeviceIds: []
        });
      }
    }
  };

  componentWillReceiveProps(nextprops) {
    const { checkedUsers, allUsers, allChannels } = this.state;
    const { dispatch, userId, currentGroupId, groupDetail } = this.props;
    if (nextprops.groupDetail !== groupDetail) {
      dispatch({
        type: 'securityUserGroup/getListGroup',
        payload: {
          userId
        }
      });
      this.setState({
        descriptionMessage: '',
        nameMessage: '',
        invalid: {
          groupDescription: false,
          groupName: false
        },
        groupId: nextprops.userGroupId,
        detail: nextprops.groupDetail,
        oldDetail: nextprops.groupDetail,
        domainName:
          nextprops.groupDetail && nextprops.groupDetail.domainName
            ? nextprops.groupDetail.domainName
            : ''
      });
    }
    if (nextprops.checkedUsers !== checkedUsers) {
      let selected = [];
      if (nextprops.checkedUsers) {
        selected = nextprops.checkedUsers.map(item => item.userUuid);
      }
      this.oldUserSelected = selected;
      this.setState({
        checkedUserId: selected.slice(),
        isAssignUserId: selected.slice(0),
        checkedUsers: nextprops.checkedUsers
      });
    }
    if (nextprops.allUsers && nextprops.allUsers !== allUsers) {
      this.setState({
        allUsers: nextprops.allUsers
      });
    }
    if (nextprops.allChannels && nextprops.allChannels !== allChannels) {
      const initNewChannelsId = nextprops.allChannels.filter(item => {
        return item.assignedUserGroup === 'Y';
      });
      const newChannelsId = initNewChannelsId.map(item => {
        return item.channelId;
      });
      const newChannelDeviceIds = initNewChannelsId.map(item => {
        return { channelId: item.channelId, deviceId: item.deviceId };
      });

      this.oldCheckedChannelIds = newChannelsId.slice();
      this.setState({
        allChannels: nextprops.allChannels,
        checkedChannelId: newChannelsId,
        channelDeviceIds: newChannelDeviceIds
      });
    }
    if (nextprops.currentGroupId !== currentGroupId) {
      this.nxtGid = nextprops.currentGroupId;
      this.init();
    }
  }

  handleGetUser = (pageNo, pageSize, filterObj) => {
    const { dispatch, userId, currentGroupId } = this.props;
    const groupId = this.nxtGid || currentGroupId;
    if (filterObj) {
      this.lastUserFilter = filterObj;
    }
    dispatch({
      type: 'securityUserGroup/getUserList',
      payload: {
        searchUserId: userId,
        groupId,
        pageNo,
        pageSize,
        ...this.lastUserFilter
      }
    }).then(() => {
      this.isResetPage = false;
    });
  };

  handleGetChannel = (pageNo, pageSize, filterObj) => {
    const { dispatch, userId, currentGroupId } = this.props;
    const groupId = this.nxtGid || currentGroupId;
    if (filterObj) {
      this.lastChannelLFilter = filterObj;
    }
    dispatch({
      type: 'securityUserGroup/getChannelList',
      payload: {
        userId,
        userGroupId: groupId,
        pageNo,
        pageSize,
        ...this.lastChannelLFilter
      }
    });
  };

  init() {
    const { dispatch, userId, currentGroupId } = this.props;
    const groupId = this.nxtGid || currentGroupId;
    dispatch({
      type: 'securityUserGroup/getGroupDetail',
      payload: {
        groupId,
        userId
      }
    });
    this.isResetPage = true;
    this.handleGetUser(0, 5);
    this.handleGetChannel(0, 5);
    this.setState({
      updateBtnVisibility: false,
      groupId
    });
  }

  // init(currentGroupId) {
  //   const { dispatch, userId } = this.props;
  //   const { detail } = this.state;
  //   const obj = {
  //     groupId: currentGroupId,
  //     userId
  //   };
  //   const userObj = {
  //     userId,
  //     groupId: currentGroupId,
  //     keyWord: '',
  //     removeMe: true
  //   };
  //   dispatch({
  //     type: 'securityUserGroup/getGroupDetail',
  //     payload: { obj }
  //   });
  //   dispatch({
  //     type: 'securityUserGroup/getUserList',
  //     payload: userObj
  //     // payload: {
  //     //   userId,
  //     //   groupId: currentGroupId,
  //     //   keyWord: '',
  //     //   removeMe: true
  //     // }
  //   });
  //   const object = {
  //     uid: userId,
  //     groupId: currentGroupId,
  //     pageNo: 0,
  //     pageSize: 5,
  //     keyWord: '',
  //     groupName: detail.groupName
  //   };
  //   dispatch({
  //     type: 'securityUserGroup/getChannelList',
  //     payload: { object }
  //   });
  //   this.setState({
  //     updateBtnVisibility: false
  //   });
  //   this.setState({
  //     groupId: currentGroupId
  //   });
  // }
  // Added for jira MMI-704 The user group not in selected when click its name in first time issue , by Kevin on 2019/06/20 16:53:47 - Start

  // the reason is that this component was mount at fist time, so componentWillReceive method will not be called.
  componentDidMount() {
    const { currentGroupId } = this.props;
    this.init(currentGroupId);
  }
  // Added for jira MMI-704 The user group not in selected when click its name in first time issue, - End

  pageDataChange(name, pNo, pSize, key, range) {
    const { dispatch, userId } = this.props;
    const { groupId, detail } = this.state;
    const { groupName } = detail;

    if (name === 'user') {
      const obj = {
        searchUserId: userId,
        // keyWord: key !== undefined ? key : '',
        groupId,
        pageNo: pNo,
        pageSize: pSize
        // removeMe: true,
        // groupName
      };
      dispatch({
        type: 'securityUserGroup/getUserList',
        payload: obj
        // payload: {
        //   userId,
        //   groupId,
        //   keyWord: key !== undefined ? key : '',
        //   // userId,
        //   // userFullName,
        //   removeMe: true,
        //   groupName
        // }
      });
    } else if (name === 'channel') {
      const descriptionFields = {
        'User Id': userId,
        'Filter Word': key,
        'Group Name': groupName
      };
      const object = {
        uid: userId,
        groupId,
        pageNo: pNo,
        pageSize: pSize,
        range,
        keyWord: key,
        groupName,
        descriptionFields
      };
      dispatch({
        type: 'securityUserGroup/getChannelList',
        payload: { object }
      });
    }
  }

  btnSave = () => {
    const { dispatch, userId, currentGroupId, allUsers, currentGroupName } = this.props;
    const {
      page,
      rowsPerPage,
      groupId,
      checkedUserId,
      detail,
      currentTable,
      checkedChannelId,
      channelDeviceIds,
      allChannels
    } = this.state;
    const users = {
      createdId: userId,
      lastUpdatedId: userId,
      // Fixed bug by Wang Shu Hao on Jun 26 2019 - Start
      // groupId: groupId,
      groupId: groupId || currentGroupId,
      // Fixed bug by Wang Shu Hao on Jun 26 2019 - End
      userList: checkedUserId
    };
    // get selected users' name list
    // Add for JIRA-IVHFATOSAT-452 bu Chen Yu Long on 19/07/2019 start----
    const selectedUserList = allUsers.filter(item => {
      return checkedUserId.includes(item.userUuid);
    });
    const selectedUserListArr = selectedUserList.filter(single => {
      return single !== undefined;
    });
    const assignUserList = selectedUserListArr.map(item => {
      return item.userFullName;
    });
    // Add for JIRA-IVHFATOSAT-452 bu Chen Yu Long on 19/07/2019 end----

    let channels = {
      createdId: userId,
      lastUpdatedId: userId,
      groupId,
      groupName: currentGroupName,
      channels: channelDeviceIds
    };

    detail.userId = userId;
    detail.groupId = groupId;

    const $checkedUserId = checkedUserId.slice();
    const descriptionFields = {
      'User Id': userId,
      'Assign Users': assignUserList,
      'Group Name': detail.groupName
    };
    if (currentTable === 0) {
      if (_.isEqual($checkedUserId, this.oldUserSelected)) {
        msg.warn(constant.VALIDMSG_NOTCHANGE, 'Assign User');
        return;
      }
      dispatch({
        type: 'securityUserGroup/assignUserToGroup',
        payload: {
          userId,
          groupId,
          keyWord: '',
          users,
          pageNo: page,
          pageSize: rowsPerPage,
          descriptionFields
        }
      }).then(res => {
        if (!res) return;
        if (res) {
          msg.success('Assign User Successfully', 'Assign User');
          this.handleGetUser(0, 5);
        } else {
          msg.error(res.message, 'Assign User');
        }
      });
    } else if (currentTable === 1) {
      const {
        channelPage: { page: chaPage, rowsPerPage: chaRowsPerPage }
      } = this.state;
      if (_.isEqual(checkedChannelId, this.oldCheckedChannelIds)) {
        msg.warn(constant.VALIDMSG_NOTCHANGE, 'Assign Channel');
        return;
      }

      const channelIds = channelDeviceIds.slice().map(t => t.channelId);
      const channelNames = allChannels
        .slice()
        .filter(t => channelIds.includes(t.channelId))
        .map(t => t.channelName);
      channels = { channelNames, ...channels };
      dispatch({
        type: 'securityUserGroup/assignChannelToGroup',
        payload: {
          channels,
          pageNo: chaPage,
          pageSize: chaRowsPerPage,
          id: groupId,
          userid: userId
        }
      }).then(res => {
        if (!res) return;
        if (res) {
          msg.success('Assign Channel Successfully', 'Assign Channel');
          this.handleGetChannel(0, 5);
        } else {
          msg.error(res.message, 'Assign Channel');
        }
      });
    }
  };

  usergroupInfoSave = () => {
    const { dispatch, userId, currentGroupId } = this.props;
    const { detail, invalid, groupId, domainName, oldDetail } = this.state;
    const groupDetail = {
      groupDescription: detail.groupDescription,
      // Fixed bug by Wang Shu Hao on Jun 26 2019 - Start
      // groupId: groupId,
      groupId: groupId || currentGroupId,
      // Fixed bug by Wang Shu Hao on Jun 26 2019 - End
      groupName: detail.groupName,
      parentId: detail.parentId ? detail.parentId : '',
      userId,
      domainName,
      levelId: detail.levelId
    };
    if (detail.groupDescription === '' || detail.groupName === '') {
      if (detail.groupDescription === '') {
        invalid.groupDescription = true;
        this.setState({
          invalid,
          descriptionMessage: constant.VALIDMSG_NOTNULL
        });
      }
      if (detail.groupName === '') {
        invalid.groupName = true;
        this.setState({
          invalid,
          nameMessage: constant.VALIDMSG_NOTNULL
        });
      }
    } else {
      if (
        detail.groupName === oldDetail.groupName &&
        detail.groupDescription === oldDetail.groupDescription &&
        detail.domainName === oldDetail.domainName
      ) {
        msg.warn(constant.VALIDMSG_NOTCHANGE, 'User Group');
        return false;
      }
      dispatch({
        type: 'securityUserGroup/updateUserGroup',
        payload: { detail: groupDetail, userid: userId, mk: 'M4-6' }
      });
      this.setState({
        updateBtnVisibility: false
      });
    }
  };

  clearCurrentId = () => {
    const { backToSelectPage } = this.props;
    this.setState({});
    backToSelectPage();
  };

  /* Added by lizzie */
  cancel = () => {
    const { invalid } = this.state;
    invalid.groupDescription = false;
    invalid.groupName = false;
    this.setState(state => ({
      detail: state.oldDetail,
      updateBtnVisibility: false,
      descriptionMessage: '',
      nameMessage: '',
      invalid
    }));
  };
  /* End by lizzie */

  handleChangeChannelPage = pageObj => {
    this.setState({
      channelPage: pageObj
    });
  };

  handleChangeIndex = currentTable => {
    this.setState({
      currentTable
    });
  };

  render() {
    const {
      classes,
      allUsers,
      isAdmin,
      domainList,
      dispatch,
      modelsList,
      mode,
      userData
    } = this.props;
    const {
      currentTable,
      detail,
      checkedUserId,
      isAssignUserId,
      allChannels,
      checkedChannelId,
      invalid,
      descriptionMessage,
      nameMessage,
      updateBtnVisibility,
      domainName
    } = this.state;
    const parentGroupName = detail.parentName ? detail.parentName : '--No Parent--';
    const checkedChannels = allChannels.filter(item => {
      return item.assignedUserGroup === 'Y';
    });
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          padding: '10px'
        }}
      >
        <Fragment>
          <FormControl>
            <TextField
              multiline
              label={I18n.t('security.userGroup.label.groupName')}
              className={classes.textField}
              onChange={this.textFieldChange('groupName')}
              margin="normal"
              value={detail.groupName !== undefined ? detail.groupName : ''}
              inputProps={{
                maxLength: '50'
              }}
              error={invalid.groupName}
              helperText={nameMessage}
              disabled={!!(detail.parentId === null || detail.parentId === '')}
            />
          </FormControl>
          <FormControl>
            <TextField
              error={invalid.groupDescription}
              helperText={descriptionMessage}
              label={I18n.t('security.userGroup.label.groupDescription')}
              multiline
              value={detail.groupDescription !== undefined ? detail.groupDescription : ''}
              onChange={this.textFieldChange('groupDescription')}
              className={classes.textField}
              margin="normal"
              inputProps={{
                maxLength: '200'
              }}
              disabled={!!(detail.parentId === null || detail.parentId === '')}
            />
          </FormControl>
          <FormControl>
            <TextField
              disabled
              label={I18n.t('security.userGroup.label.parentGroup')}
              value={parentGroupName}
              className={classes.textField}
              margin="normal"
              inputProps={{
                maxLength: '50'
              }}
            />
          </FormControl>
          <FormControl
            style={{
              display: detail.levelId === '1' ? 'inline-flex' : 'none'
            }}
          >
            <TextField
              disabled={isAdmin !== 'Y'}
              select
              label={I18n.t('security.userGroup.label.domainName')}
              className={classes.textField}
              value={domainName !== '' && domainName !== null ? domainName : '0'}
              onChange={this.textFieldChange('domainName')}
              SelectProps={{
                MenuProps: {
                  className: classes.menu
                }
              }}
              margin="normal"
            >
              {domainList.length > 0
                ? domainList.map(option => {
                    return (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    );
                  })
                : ''}
            </TextField>
          </FormControl>
        </Fragment>
        <div>
          <Permission materialKey="M4-6">
            <Button
              color="default"
              size="small"
              variant="contained"
              style={{
                marginLeft: '20px',
                marginTop: '10px',
                display: updateBtnVisibility ? 'inline' : 'none'
              }}
              onClick={() => this.usergroupInfoSave()}
            >
              {I18n.t('security.userGroup.button.update')}
            </Button>
          </Permission>
          <Permission materialKey="M4-6">
            <Button
              color="default"
              size="small"
              variant="contained"
              style={{
                marginLeft: '20px',
                marginTop: '10px',
                display: updateBtnVisibility ? 'inline' : 'none'
              }}
              onClick={() => this.cancel()}
            >
              {I18n.t('security.userGroup.button.cancel')}
            </Button>
          </Permission>
        </div>
        <AppBar
          position="static"
          color="default"
          style={{ backgroundColor: 'unset', marginTop: '20px' }}
        >
          <Tabs
            value={currentTable}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="inherit"
            classes={{
              root: classes.tabsRoot,
              indicator: classes.tabsIndicator
            }}
            style={{ borderBottom: '1px solid' }}
          >
            {!mode && (
              <Tab
                label={I18n.t('security.userGroup.tabs.assignUser')}
                disableRipple
                classes={{
                  root: classes.tabRoot,
                  selected: classes.tabSelected
                }}
                style={{ color: 'rgba(255,255,255,.90)' }}
              />
            )}
            <Tab
              label={I18n.t('security.userGroup.tabs.assignChannels')}
              disableRipple
              classes={{
                root: classes.tabRoot,
                selected: classes.tabSelected
              }}
              style={{ color: 'rgba(255,255,255,.90)' }}
            />
            <Tab
              label={I18n.t('security.userGroup.tabs.assignVA')}
              disableRipple
              classes={{
                root: classes.tabRoot,
                selected: classes.tabSelected
              }}
              style={{ color: 'rgba(255,255,255,.90)' }}
            />
          </Tabs>
        </AppBar>
        {!mode && (
          <Slide direction="left" in={currentTable === 0} mountOnEnter unmountOnExit>
            <Paper elevation={0}>
              <UserTab
                data={allUsers}
                handleGetData={this.handleGetUser}
                selected={checkedUserId}
                oldSelected={this.oldUserSelected}
                isAssignUserId={isAssignUserId}
                isAssigned={id => this.isAssigned('userCheck', id)}
                handleCheckboxClick={(item, event) =>
                  this.handleCheckboxClick('userCheck', item, event)
                }
                handleSelectAllClick={event => this.handleSelectAllClick('userCheck', event)}
                isSelected={id => this.isSelected('userCheck', id)}
                dispatch={dispatch}
                totalNum={(userData && userData.totalNum) || 0}
                resetPage={this.isResetPage}
              />
              <Permission materialKey="M4-59">
                <ButtonToolbar data={allUsers} handleSave={() => this.btnSave()} />
              </Permission>
            </Paper>
          </Slide>
        )}

        <Slide direction="right" in={currentTable === (!mode ? 1 : 0)} mountOnEnter unmountOnExit>
          <Paper elevation={0}>
            <ChannelTab
              data={!mode ? allChannels : checkedChannels}
              handleGetData={this.handleGetChannel}
              selected={checkedChannelId}
              handleCheckboxClick={checkboxValue =>
                this.handleCheckboxClick('channelCheck', checkboxValue)
              }
              handleSelectAllClick={event => this.handleSelectAllClick('channelCheck', event)}
              // isSelected={id => this.isSelected('channelCheck', id)}
              // detail={detail}
              // handleChangeChannelPage={this.handleChangeChannelPage}
              // dispatch={dispatch}
              modelsList={modelsList}
              mode={mode}
            />
            {!mode && detail.assignChannel ? (
              <Permission materialKey="M4-60">
                <ButtonToolbar data={allChannels} handleSave={() => this.btnSave()} />
              </Permission>
            ) : (
              ''
            )}
          </Paper>
        </Slide>
        <Slide direction="right" in={currentTable === (!mode ? 2 : 1)} mountOnEnter unmountOnExit>
          <Paper elevation={0}>
            {currentTable === (!mode ? 2 : 1) && <VaEnginesTab mode={mode} />}
          </Paper>
        </Slide>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(GroupDetail);
