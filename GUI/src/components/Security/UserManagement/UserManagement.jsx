import React from 'react';
import _ from 'lodash';
import { I18n } from 'react-i18nify';
import Paper from '@material-ui/core/Paper';
import { PersonAdd, Delete } from '@material-ui/icons';
import { TableToolbar, Permission, ConfirmPage } from 'components/common';
import { Tooltip, IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import msg from 'utils/messageCenter';
import { getUserId } from 'utils/getUserInformation';
import checkUserPermission from 'utils/checkUserPermission';
import * as constant from 'commons/constants/commonConstant';
import { isSuccess } from 'utils/helpers';
import UserRolesDialog from './UserManagementAssignRole';
import UpdateOrCreatePage from './UserManagementUpdateOrCreate';
import UserDetails from './UserManagementDetails';
import UserTable from './UserManagementTable';

const styles = theme => ({
  root: {
    width: '100%',
    height: 'auto',
    display: 'flex',
    padding: '10px',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row-reverse',
    backgroundColor: 'unset'
  },
  rootBgColor: {
    backgroundColor: theme.palette.action.hover
  }
});

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selected: [],
      indeterminate: false,
      openDialog: false,
      operationType: null,
      updateUser: {},
      searchUser: '',
      deleteConfirmOpen: false,
      delUsers: [],
      confirmMessage: '',
      confirmMessageTitle: '',

      openUserRolesDialog: false,
      selectedRoles: [],
      userRoles: [],
      // radio role
      selectedRadioRoles: [],

      isOpenUserDetailDialog: false,
      currentUserDetails: {},
      createUser: {},
      flagPageClean: false,
      flagSearchClean: false,
      flagIDAdd: false,
      isClean: false
    };
    this.filterObj = {};
  }

  componentDidMount() {
    this.handleGetDataByPage();
  }

  componentWillReceiveProps(nextProps) {
    const { users } = this.props;
    const { flagIDAdd } = this.state;
    if (!_.isEqual(nextProps.users, users)) {
      if (flagIDAdd) {
        this.setState({ flagIDAdd: false, flagSearchClean: true });
      }
      this.setState({
        flagPageClean: true
      });
    }
    this.initData(nextProps);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state);
  }

  recordSelectedRoles = [];

  initData = props => {
    const users = this.props;
    const initSelectRoles = props.userRoles
      .filter(item => item.status === 'A')
      .map(item => item.roleId);

    this.recordSelectedRoles = [];

    this.setState({
      userRoles: props.userRoles,
      selectedRoles: initSelectRoles,
      selectedRadioRoles: initSelectRoles[0]
    });
    if (props.users !== users) {
      this.setState({
        data: props.users.items
      });
    }
  };

  /* ------------------------------about user table----------------------------------------- */

  // selected single checkbox
  handleCheckboxClick = (item, event) => {
    const { selected } = this.state;
    const { checked } = event.target;
    const chechboxValue = item.userUuid;
    const newSelected = selected.slice();
    const valueIndex = newSelected.indexOf(chechboxValue);

    if (checked && valueIndex === -1) {
      newSelected.push(chechboxValue);
    }
    if (!checked && valueIndex !== -1) {
      newSelected.splice(valueIndex, 1);
    }

    this.setState({
      selected: newSelected
    });
  };

  // selected all checkbox
  handleSelectAllClick = event => {
    const { data, selected } = this.state;
    const allChecked = event.target.checked;
    const ids = data.map(item => item.userUuid);
    if (allChecked) {
      const curAll = selected.concat(ids);
      const res = Array.from(new Set(curAll));
      this.setState({
        selected: res
      });
    } else {
      const pre = _.clone(selected, true);
      for (const i in ids) {
        pre.splice(pre.indexOf(ids[i]), 1);
      }
      this.setState({
        selected: pre
      });
    }
  };

  resetSelected = () => {
    this.setState({
      selected: []
    });
  };

  // user whether selected
  isSelected = id => {
    const { selected } = this.state;
    return selected.indexOf(id) !== -1;
  };

  /* ------------------------------about update and create user---------------------------------------- */

  // close update or create dialog
  handleDialogClose = () => {
    this.setState({
      openDialog: false,
      createUser: {}
    });
  };

  // open update page
  openUpdateUserPage = (type, user) => {
    this.setState({
      updateUser: user,
      operationType: type,
      openDialog: true
    });
  };

  // open create page
  openCreateUserPage = type => {
    this.setState({
      operationType: type,
      openDialog: true
    });
  };

  // submit creat or update user info
  handleUserSubmit = (type, user) => {
    const { dispatch } = this.props;
    if (type === 'update') {
      user.lastUpdatedId = getUserId();
      user.filterObj = this.filterObj;
      dispatch({
        type: 'securityUserManagement/updateUser',
        payload: {
          user
        }
      }).then(result => {
        if (isSuccess(result)) {
          this.handleDialogClose();
        }
      });
    } else if (type === 'create') {
      user.userName = user.userId;
      user.createdId = getUserId();
      dispatch({
        type: 'securityUserManagement/createUser',
        payload: {
          user
        }
      }).then(result => {
        if (isSuccess(result)) {
          this.handleDialogClose();
          this.setState({
            isClean: true
          });
        }
      });
      // JIRA IVHFATOSAT-330
      // -start- add by ANKE (when submit error the user data still need to be in the create form)
      this.setState({
        createUser: user,
        flagIDAdd: true,
        flagSearchClean: false
      });
      // -end-
    }
    this.setState({ flagPageClean: false });
  };

  /* ------------------------------about delete user---------------------------------------- */
  // when click delete user button, it will open comfirm page;
  handleDeleteUser = ids => {
    this.setState({
      deleteConfirmOpen: true,
      confirmMessageTitle: I18n.t('security.userManagement.title.deleteUser'),
      confirmMessage: I18n.t('security.userManagement.dialogMessage.deleteMessage'),
      delUsers: ids
    });
  };

  // comfirm del user dialog, and click comfirm button, it will excute operation
  confirmMessageTitle = () => {
    const { dispatch } = this.props;
    const { data: users, delUsers } = this.state;
    const resultOfDelUsers = this.mapDelUserUuidsToDelUsers(users, delUsers);
    dispatch({
      type: 'securityUserManagement/deleteUsers',
      payload: {
        users: {
          ids: delUsers.join(','),
          data: resultOfDelUsers,
          filterObj: this.filterObj
        }
      }
    });
    this.setState({
      selected: [],
      flagPageClean: false
    });
    this.handleDelUserConfirmPageClose();
  };

  mapDelUserUuidsToDelUsers(users, delUsers) {
    const temp = [];
    users.forEach(u => {
      delUsers.forEach(r => {
        if (u.userUuid === r) {
          temp.push(u);
        }
      });
    });
    return temp;
  }

  // cancle delete user operation
  handleDelUserConfirmPageClose = () => {
    this.setState({
      deleteConfirmOpen: false
    });
  };

  /* ------------------------------about search user---------------------------------------- */
  handleSearchUserChange = event => {
    this.setState({ searchUser: event.target.value });
  };

  /* ------------------------------about user roles---------------------------------------- */

  // open user roles dialog
  handleOpenUserRolesDialog = id => {
    const { dispatch, userId } = this.props;
    dispatch({
      type: 'securityUserManagement/getUserRoles',
      payload: {
        userId,
        id
      }
    });
    this.setState({
      openUserRolesDialog: true
    });
  };

  // close user roles dialog
  handleCloseUserRolesDialog = () => {
    this.setState({
      openUserRolesDialog: false,
      selectedRadioRoles: []
    });
  };

  // selected single checkbox operation
  handleRoleSelected = event => {
    const { selectedRoles } = this.state;
    const checkboxValue = event.target.value;
    const newSelected = selectedRoles.slice();
    const valueIndex = newSelected.indexOf(checkboxValue);

    if (valueIndex !== -1) {
      newSelected.splice(valueIndex, 1);
      this.recordSelectedRoles = newSelected.slice();
    } else {
      newSelected.push(checkboxValue);
      this.recordSelectedRoles = newSelected.slice();
    }
    this.setState({
      selectedRadioRoles: checkboxValue
    });
  };

  // selected all checkbox operation or not
  handleRoleAllSelected = event => {
    const { userRoles } = this.state;
    const allChecked = event.target.checked;
    const newData = userRoles.slice();
    const newData2 = userRoles.slice();
    if (allChecked) {
      this.setState({
        selectedRoles: newData.map(item => item.roleId)
      });

      // record change
      this.recordSelectedRoles = newData2
        .filter(item => item.status !== 'Y')
        .map(item => item.roleId);
    } else {
      this.setState({
        selectedRoles: []
      });

      // record change
      this.recordSelectedRoles = newData2
        .filter(item => item.status === 'Y')
        .map(item => item.roleId);
    }
  };

  // user role whether to be selected
  isSelectedRole = id => {
    const { selectedRoles } = this.state;
    return selectedRoles.indexOf(id) !== -1;
  };

  // save user roles
  handleSaveUserRoles = () => {
    const { userRoles } = this.state;
    const { dispatch } = this.props;
    const newUserRoles = userRoles.slice();
    const recordSelectedRolesRe = this.recordSelectedRoles;
    const filterRoles = [];
    for (const temp of newUserRoles) {
      for (const id of recordSelectedRolesRe) {
        if (temp.roleId === id) {
          filterRoles.push(temp);
        }
      }
    }
    const resultRoles = filterRoles.map(item => ({
      userId: item.userId,
      roleId: item.roleId,
      status: item.status === 'A' ? 'I' : 'A', // if Array isn't null, then modified status of item to the opposite value!
      createdId: getUserId(),
      roleName: item.roleName,
      roleStatus: item.roleStatus,
      roleDesc: item.roleDesc
    }));

    if (resultRoles && resultRoles.length > 0) {
      dispatch({
        type: 'securityUserManagement/assignRoleToUser',
        payload: {
          roleId: resultRoles
        }
      });
      this.setState({
        openUserRolesDialog: false,
        selectedRadioRoles: []
      });
    } else {
      msg.warn(constant.VALIDMSG_NOTCHANGE, 'Assign User Role');
    }
  };

  handleOpenDetailDialog = item => {
    this.setState({
      isOpenUserDetailDialog: true,
      currentUserDetails: item
    });
  };

  closeUserDetailDialog = () => {
    this.setState({
      isOpenUserDetailDialog: false,
      currentUserDetails: {}
    });
  };

  changeUserIdtoLowerCase = newUser => {
    const newCreateUser = Object.assign({}, newUser);
    newCreateUser.userId = newUser.userId.toLowerCase();
    this.setState({
      createUser: newCreateUser
    });
  };

  handleGetDataByPage = (pageNo = 0, pageSize = 5, filterObj) => {
    const { dispatch, userId } = this.props;
    if (!!filterObj && filterObj !== {}) {
      this.filterObj = filterObj;
    }
    const obj = Object.assign({}, this.filterObj);
    obj.searchUserId = userId;
    obj.pageNo = pageNo;
    obj.pageSize = pageSize;
    dispatch({
      type: 'securityUserManagement/getUserListData',
      payload: {
        obj
      }
    });
  };

  searchClearClean = () => {
    this.setState({
      isClean: false
    });
  };

  render() {
    const {
      selected,
      flagPageClean,
      flagSearchClean,
      searchUser,
      openDialog,
      operationType,
      createUser,
      updateUser,
      confirmMessage,
      confirmMessageTitle,
      deleteConfirmOpen,
      openUserRolesDialog,
      selectedRoles,
      selectedRadioRoles,
      currentUserDetails,
      isOpenUserDetailDialog,
      isClean
    } = this.state;
    const { users, userRoles } = this.props;
    const { classes, ...rest } = this.props;
    const checkPermission = checkUserPermission('M4-4');
    return (
      <Paper elevation={0}>
        <div className={classNames(classes.root, { [classes.rootBgColor]: selected.length > 0 })}>
          <div>
            {selected.length > 0 ? (
              <Permission materialKey="M4-118">
                <Tooltip title={I18n.t('security.userManagement.toolTips.delete')}>
                  <IconButton
                    aria-label="Batch Delete"
                    onClick={this.handleDeleteUser.bind(null, selected)}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Permission>
            ) : (
              <Permission materialKey="M4-1">
                <Tooltip title={I18n.t('security.userManagement.toolTips.create')}>
                  <IconButton
                    aria-label="Create User"
                    onClick={() => this.openCreateUserPage('create')}
                  >
                    <PersonAdd />
                  </IconButton>
                </Tooltip>
              </Permission>
            )}
          </div>

          <div>
            <TableToolbar
              disabled={!checkPermission}
              checkedIds={selected}
              handleGetDataByPage={obj => this.handleGetDataByPage(0, 5, obj)}
              flagSearchClean={flagSearchClean}
              fieldList={[
                ['UserID', 'userId', 'iptType'],
                ['FullName', 'userFullName', 'iptType'],
                ['Email', 'userEmail', 'iptType']
              ]}
              clean={isClean}
              searchClearClean={this.searchClearClean}
            />
          </div>
        </div>

        <UserTable
          {...rest}
          data={users}
          selected={selected}
          handleCheckboxClick={this.handleCheckboxClick}
          handleSelectAllClick={this.handleSelectAllClick}
          handleOpenUserRolesDialog={id => this.handleOpenUserRolesDialog(id)}
          isSelected={this.isSelected}
          openUpdateUserPage={(type, user) => this.openUpdateUserPage(type, user)}
          handleDeleteUser={users => this.handleDeleteUser(users)}
          handleGetUsers={this.handleGetDataByPage}
          resetSelected={this.resetSelected}
          searchUser={searchUser}
          userId={getUserId()}
          handleOpenDetailDialog={this.handleOpenDetailDialog}
          flagPageClean={flagPageClean}
        />
        <UpdateOrCreatePage
          openDialog={openDialog}
          operationType={operationType}
          handleDialogClose={this.handleDialogClose}
          handleUserSubmit={this.handleUserSubmit}
          user={operationType === 'create' ? createUser : updateUser}
          changeUserIdtoLowerCase={this.changeUserIdtoLowerCase}
        />
        <ConfirmPage
          message={confirmMessage}
          messageTitle={confirmMessageTitle}
          isConfirmPageOpen={deleteConfirmOpen}
          hanldeConfirmMessage={this.confirmMessageTitle}
          handleConfirmPageClose={this.handleDelUserConfirmPageClose}
        />
        {openUserRolesDialog && (
          <UserRolesDialog
            openUserRolesDialog={openUserRolesDialog}
            handleSaveUserRoles={this.handleSaveUserRoles}
            handleCloseUserRolesDialog={this.handleCloseUserRolesDialog}
            handleRoleSelected={this.handleRoleSelected}
            handleRoleAllSelected={this.handleRoleAllSelected}
            isSelectedRole={this.isSelectedRole}
            selectedRoles={selectedRoles}
            userRoles={userRoles}
            selectedRadioRoles={selectedRadioRoles}
          />
        )}
        <UserDetails
          data={currentUserDetails}
          isOpenUserDetailDialog={isOpenUserDetailDialog}
          closeUserDetailDialog={this.closeUserDetailDialog}
        />
      </Paper>
    );
  }
}

export default withStyles(styles)(User);
