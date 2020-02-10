import React, { Component } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import msg from 'utils/messageCenter';
import { I18n } from 'react-i18nify';
import * as constant from 'commons/constants/commonConstant';
import { TableToolbar, Permission, ConfirmPage } from 'components/common';
import { withStyles } from '@material-ui/core/styles';
import { Tooltip, IconButton, Paper } from '@material-ui/core';
import { LibraryAdd, Delete } from '@material-ui/icons';
import checkUserPermission from 'utils/checkUserPermission';
import { isSuccess } from 'utils/helpers';
import RoleTable from './RoleManagementTable';
import AddRole from './RoleManagementCreateOrUpdate';
import FeatureDialog from './RoleManagementAssignFeature';

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

class List extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      rolesData: [],
      featureList: [{ featureUuid: '' }],
      checkedIds: [],
      selectedFeatures: [],
      updateRole: {},
      newRole: { roleName: '', roleDesc: '' },
      operationType: null,
      openFeatureDialog: false,
      roleId: '',
      selectedFeaturesForSearch: [],
      isSearchFeature: false,
      featuresForSearch: [],
      comfirmMessage: '',
      comfirmMessageTitle: '',
      deleteComfirmOpen: false,
      isAdministerComfirmShow: false,
      isCheakedAdminister: false,
      selectedGroups: [],
      groupsNum: '',
      groupList: [],
      isVisibility: [],
      roleNames: [],
      flagPageClean: false,
      flagSearchClean: false,
      oldRole: { roleName: '', roleDesc: '' }
    };
  }

  componentWillReceiveProps(nextProps) {
    const { isVisibility, selectedGroups, flagIdAdd, isSearchFeature, featureList } = this.state;
    const { roleList } = this.props;
    if (nextProps.isVisibility !== isVisibility) {
      this.setState({
        isVisibility: nextProps.isVisibility
      });
    }
    if (nextProps.selectedGroups !== selectedGroups) {
      this.setState({
        selectedGroups: nextProps.selectedGroups
      });
    }
    if (nextProps.roleList !== roleList) {
      this.setState({
        rolesData: nextProps.roleList,
        flagPageClean: true
      });
      if (flagIdAdd) {
        this.setState({ flagSearchClean: true, flagIdAdd: false });
      }
    }
    this.setState(
      {
        featureList: nextProps.featureList
      },
      () => {
        if (isSearchFeature === false) {
          const selectedFeatures = featureList
            .filter(item => item.statusPlus === 'Y')
            .map(item => item.featureUuid);
          const selectedFeaturesForSearch = featureList.filter(item => item.statusPlus === 'Y');
          const featuresForSearch = featureList;
          this.setState({
            selectedFeatures,
            selectedFeaturesForSearch,
            featuresForSearch
          });
        } else {
          const { selectedFeaturesForSearch } = this.state;
          const selectedFeaturesForSearchNew = selectedFeaturesForSearch.map(
            item => item.featureUuid
          );
          const featureIds = featureList.map(item => item.featureUuid);
          const temp = [];
          for (const fid of featureIds) {
            for (const id of selectedFeaturesForSearchNew) {
              if (fid === id) {
                temp.push(id);
              }
            }
          }
          this.setState({
            selectedFeatures: temp
          });
        }
      }
    );
  }

  handleCheckboxClick = (item, event) => {
    const { checkedIds, roleNames, rolesData } = this.state;
    const { checked } = event.target;
    const chechboxValue = item.roleId;
    const newSelected = checkedIds.slice();
    const valueIndex = newSelected.indexOf(chechboxValue);
    const newRoleNames = roleNames;
    let clickName = '';
    rolesData.items.forEach(ele => {
      if (ele.roleId === chechboxValue) clickName = ele.roleName;
    });

    if (checked && valueIndex === -1) {
      newSelected.push(chechboxValue);
      newRoleNames.push(clickName);
    }
    if (!checked && valueIndex !== -1) {
      newSelected.splice(valueIndex, 1);
      newRoleNames.splice(newRoleNames.indexOf(clickName), 1);
    }
    this.setState({
      checkedIds: newSelected,
      roleNames: newRoleNames
    });
  };

  handleSelectAllClick = event => {
    const { rolesData, checkedIds } = this.state;
    const allChecked = event.target.checked;
    const newData = rolesData.items;
    const ids = newData.map(item => item.roleId);

    if (allChecked) {
      const curAll = checkedIds.concat(ids);
      const res = Array.from(new Set(curAll));
      this.setState({
        checkedIds: res,
        roleNames: newData.map(item => item.roleName) // check by yourself
      });
    } else {
      const pre = _.clone(checkedIds, true);
      for (const i in ids) {
        pre.splice(pre.indexOf(ids[i]), 1);
      }
      this.setState({
        checkedIds: pre,
        roleNames: [] // check by yourself
      });
    }
  };

  isSelected = id => {
    const { checkedIds } = this.state;
    return checkedIds.indexOf(id) !== -1;
  };

  isSelectedFeature = id => {
    const { selectedFeatures } = this.state;
    return selectedFeatures.indexOf(id) !== -1;
  };

  // open feature  dialog
  handleOpenFeatureDialog = roleId => {
    const { dispatch, userId } = this.props;
    this.clean();
    dispatch({
      type: 'securityRoleManagement/getFeatureData',
      payload: {
        roleId,
        userId
      }
    });
    this.setState({
      openFeatureDialog: true,
      roleId
    });
  };

  // close feature dialog
  handleCloseFeatureDialog = () => {
    this.setState({
      openFeatureDialog: false,
      isSearchFeature: false
    });
    this.clean();
  };

  // submit creating role info
  handleRoleSubmit = (type, name, desc, isAdmin) => {
    const { userId, dispatch } = this.props;
    const { updateRole, selectedGroups } = this.state;
    if (type === 'update') {
      const descriptionFields = {
        'Role Name': name,
        'Role Description': desc,
        'Last Updated Id': userId
      };

      const role = {
        roleName: name,
        roleDesc: desc,
        lastUpdatedId: userId,
        roleId: updateRole.roleId,
        isAdmin,
        groupIds: selectedGroups,
        descriptionFields
      };
      dispatch({
        type: 'securityRoleManagement/updateRole',
        payload: {
          role,
          filterObj: this.filterObj
        }
      }).then(result => {
        if (isSuccess(result)) {
          this.closeAddRoleDialog(false);
        }
      });
      this.setState({
        flagPageClean: false
      });
    } else if (type === 'create') {
      // Add for JIRA-IVHFATOSAT-459 by Chen Yu Long on 22/07/2019 start--
      const descriptionFields = {
        'Role Name': name,
        'Role Description': desc,
        'Created Id': userId
      };
      // Add for JIRA-IVHFATOSAT-459 by Chen Yu Long on 22/07/2019 end--
      const role = {
        roleName: name,
        roleDesc: desc,
        createdId: userId,
        roleId: '',
        isAdmin,
        groupIds: selectedGroups,
        descriptionFields
      };
      dispatch({
        type: 'securityRoleManagement/createRole',
        payload: { role }
      }).then(result => {
        if (isSuccess(result)) {
          this.closeAddRoleDialog(false);
        }
      });
      this.setState({
        flagPageClean: false,
        flagIdAdd: true,
        flagSearchClean: false
      });
    }
  };

  openCreateOrUpdatePage = (type, role) => {
    this.clean();
    this.cleanNewRole();
    this.setState({
      updateRole: Object.assign({}, role),
      operationType: type,
      oldRole: Object.assign({}, role),
      isCheakedAdminister: role.isAdmin === 'Y'
    });
    this.closeAddRoleDialog(true);
  };

  closeAddRoleDialog(data) {
    const { dispatch } = this.props;
    dispatch({
      type: 'securityRoleManagement/setAddRoleToSuccess',
      payload: { data }
    });
  }

  handleDelBatch() {
    const { dispatch, userId } = this.props;
    const { checkedIds, rolesData } = this.state;
    const rolesDataNew = rolesData.items.slice();
    const allRoleNames =
      !!rolesDataNew &&
      rolesDataNew
        .filter(t => {
          return checkedIds.includes(t.roleId);
        })
        .map(t => t.roleName);
    dispatch({
      type: 'securityRoleManagement/deleteRoles',
      payload: {
        LastUpDatedId: userId,
        roleIds: checkedIds,
        userId,
        allRoleNames: allRoleNames.join(','),
        filterObj: this.filterObj
      }
    });
    this.clean();
  }

  // features that has been changed when assign feature
  addParentId = (id, newSelected, recordSelectedFeatures, checked) => {
    const { featureList } = this.props;
    featureList.forEach(ele => {
      // Mofiy for jira MMI-605 by Wang Shu Hao on Jun 17 2019 -Start
      if (ele.featureUuid === id && !!ele.releationship) {
        const recordValueIndex = recordSelectedFeatures.indexOf(ele.releationship);
        const valueIndex = newSelected.indexOf(ele.releationship);
        if (checked && valueIndex === -1) {
          newSelected.push(ele.releationship);
          if (recordValueIndex === -1) {
            let statusPlusTemp = 'Y';
            featureList.forEach(item => {
              if (item.featureUuid === ele.releationship) {
                statusPlusTemp = item.statusPlus;
              }
            });
            if (statusPlusTemp === 'N') {
              this.recordSelectedFeatures.push(ele.releationship);
            }
          } else {
            this.recordSelectedFeatures.splice(recordValueIndex, 1);
          }
        }

        if (!checked && valueIndex !== -1) {
          newSelected.splice(valueIndex, 1);
        }
        if (!checked && recordValueIndex !== -1) {
          this.recordSelectedFeatures.splice(recordValueIndex, 1);
        }
        this.addParentId(ele.releationship, newSelected, this.recordSelectedFeatures, checked);
      }
      // Mofiy for jira MMI-605 by Wang Shu Hao on Jun 17 2019 -End
    });
  };

  // Added for JIRA MMI-566 by Wang Shu Hao on Jun 12 2019 -Start
  cancelParent = (id, newSelected) => {
    const { featureList } = this.props;
    featureList.forEach(item => {
      if (item.featureUuid === id && !!item.releationship) {
        let newSelectedFlag = true;
        let recordSelectedFeaturesFlag = true;
        let recordSelectedFeaturesIndex = -1;
        featureList.forEach(ele => {
          if (ele.featureUuid === item.releationship) {
            ele.children.forEach(childrenEle => {
              const valueIndex = newSelected.indexOf(childrenEle.featureUuid);
              if (valueIndex !== -1) {
                newSelectedFlag = false;
              }
            });
            if (ele.statusPlus === 'N') {
              recordSelectedFeaturesFlag = false;
              recordSelectedFeaturesIndex = this.recordSelectedFeatures.indexOf(ele.featureUuid);
            }
          }
        });

        if (newSelectedFlag) {
          newSelected.splice(newSelected.indexOf(item.releationship), 1);
          if (recordSelectedFeaturesFlag) {
            this.recordSelectedFeatures.push(item.releationship);
          } else {
            this.recordSelectedFeatures.splice(recordSelectedFeaturesIndex, 1);
          }
        }
        this.cancelParent(item.releationship, newSelected, this.recordSelectedFeatures);
      }
    });
  };

  // Added for JIRA MMI-566 by Wang Shu Hao on Jun 12 2019 -End
  recordSelectedFeatures = [];

  handleFeatureSelected = event => {
    event.stopPropagation();
    const { checked } = event.target;
    const { selectedFeatures } = this.state;
    const chechboxValue = event.target.value;
    const newSelected = selectedFeatures.slice();
    const recordSelectedFeatures = this.recordSelectedFeatures.slice();
    const recordValueIndex = recordSelectedFeatures.indexOf(chechboxValue);

    const valueIndex = newSelected.indexOf(chechboxValue);
    if (checked && valueIndex === -1) {
      newSelected.push(chechboxValue);
    }
    if (!checked && valueIndex !== -1) {
      newSelected.splice(valueIndex, 1);
    }

    if (recordValueIndex === -1) {
      this.recordSelectedFeatures.push(chechboxValue);
    }
    if (recordValueIndex !== -1) {
      this.recordSelectedFeatures.splice(recordValueIndex, 1);
    }
    if (checked) this.addParentId(chechboxValue, newSelected, recordSelectedFeatures, checked);
    this.setState({
      selectedFeatures: newSelected
    });
    // Added for JIRA MMI-566 by Wang Shu Hao on Jun 12 2019 -Start
    if (!checked) {
      this.cancelParent(chechboxValue, newSelected, this.recordSelectedFeatures);
    }
    // Added for JIRA MMI-566 by Wang Shu Hao on Jun 12 2019 -End
  };

  // added by Kevin on 16/1/2019---start
  handleFeatureModuleSelected = (event, item) => {
    event.stopPropagation();
    const { checked } = event.target;
    const { selectedFeatures } = this.state;
    const formatFeatureModule = Tools.getFormatedData(item); // arry
    const newSelected = selectedFeatures.slice();
    const newDataToSelected =
      formatFeatureModule.filter(item => item.statusPlus === 'Y').map(item => item.featureUuid) ||
      [];

    if (checked) {
      // only put the item which changed(statusPlus !== "Y") in
      this.addParentId(item.featureUuid, newSelected, this.recordSelectedFeatures, checked);
      for (const item of formatFeatureModule) {
        const uuid = item.featureUuid;
        const valueIndex = newSelected.indexOf(uuid);
        const initRecordValueIndex = this.recordSelectedFeatures.indexOf(uuid);
        const recordValueIndex = newDataToSelected.indexOf(uuid);
        if (valueIndex === -1) {
          newSelected.push(uuid);
        }
        // first, remove all id in current module
        if (initRecordValueIndex !== -1) {
          this.recordSelectedFeatures.splice(initRecordValueIndex, 1);
        }
        // second, add id changed status
        if (recordValueIndex === -1) {
          // Modify for jira mmi-566 by Wang Shu Hao on JUn 17 -Srart
          if (item.statusPlus === 'N') {
            this.recordSelectedFeatures.push(uuid);
          }
          // Modify for jira mmi-566 by Wang Shu Hao on JUn 17 -end
        }
      }
      this.setState({ selectedFeatures: newSelected });
    } else {
      for (const item of formatFeatureModule) {
        const uuid = item.featureUuid;
        const valueIndex = newSelected.indexOf(uuid);
        const recordValueIndex = this.recordSelectedFeatures.indexOf(uuid);
        if (valueIndex !== -1) {
          newSelected.splice(valueIndex, 1);
          // Modify for jira MMI-566 by Wang Shu Hao on Jun 17 -Start
          if (item.statusPlus === 'N') {
            this.recordSelectedFeatures.splice(recordValueIndex, 1);
          } else {
            this.recordSelectedFeatures.push(uuid);
          }
        }
      }

      this.setState({
        selectedFeatures: newSelected
      });
      // Added for JIRA MMI-566 by Wang Shu Hao on Jun 12 2019 -Start
      this.cancelParent(item.featureUuid, newSelected, this.recordSelectedFeatures);
      // Added for JIRA MMI-566 by Wang Shu Hao on Jun 12 2019 -End
    }
  };
  // added by Kevin on 16/1/2019---end

  handleFeatureAllSelected = event => {
    const { featureList } = this.state;
    const allChecked = event.target.checked;
    const newData = featureList.slice();
    if (allChecked) {
      this.setState({
        selectedFeatures: newData.map(item => item.featureUuid)
      });
      // only put the item which changed(statusPlus !== "Y") in
      this.recordSelectedFeatures = newData
        .filter(item => item.statusPlus !== 'Y')
        .map(item => item.featureUuid);
    } else {
      this.setState({
        selectedFeatures: []
      });
      this.recordSelectedFeatures = newData
        .filter(item => item.statusPlus === 'Y')
        .map(item => item.featureUuid);
    }
  };

  handleSaveFeatures = () => {
    const { featuresForSearch: featureList, roleId } = this.state;
    const { dispatch, roleList, userId } = this.props;

    const filterFeatures = [];
    for (const temp of featureList) {
      for (const id of this.recordSelectedFeatures) {
        if (temp.featureUuid === id) {
          filterFeatures.push(temp);
        }
      }
    }
    // Add for JIRA-IVHFATOSAT-459 by Chen Yu Long on 22/07/2019 start--
    const currentRoleName = roleList.items.slice().filter(item => {
      return item.roleId === roleId;
    });
    // Add for JIRA-IVHFATOSAT-459 by Chen Yu Long on 22/07/2019 end--
    const resultFeatures = filterFeatures.map(item => ({
      roleId,
      featureUuid: item.featureUuid,
      status: item.statusPlus === 'Y' ? 'N' : 'Y',
      createdId: userId,
      featureName: item.featureDesc,
      roleName: currentRoleName[0].roleName
    }));
    if (filterFeatures && filterFeatures.length > 0) {
      dispatch({
        type: 'securityRoleManagement/saveFeature',
        payload: { features: resultFeatures }
      });
      this.handleCloseFeatureDialog();
      this.setState({
        isSearchFeature: false
      });
    } else {
      msg.warn(constant.VALIDMSG_NOTCHANGE);
    }
  };

  // Fixed JIRA UMMIMMI-125 Chen Yu Long start===========================
  handleSearchFeature = featureName => {
    const { roleId } = this.state;
    const { dispatch, userId } = this.props;
    this.recordSelectedFeatures = [];
    this.setState({
      isSearchFeature: true
    });
    dispatch({
      type: 'securityRoleManagement/searchFeature',
      payload: { featureName, roleId, userId }
    });
  };

  // Fixed JIRA UMMIMMI-125 By Chen Yu Long end===========================
  hanldeDeleteFeatureComfirm = () => {
    // modified by Kevin on 9/1/2019---start
    // this.props.onDelRole(this.state.roleId, this.props.userId);
    this.handleDelBatch();
    // modified by Kevin on 9/1/2019---end
    this.handleDelFeatureComfirmPageClose();
    this.clean();
  };

  createAdminister = () => {
    this.setState({
      isCheakedAdminister: true
    });
    this.handleDelFeatureComfirmPageClose();
  };

  handleDelFeatureComfirmPageClose = () => {
    const { isAdministerComfirmShow } = this.state;
    if (isAdministerComfirmShow) {
      this.setState({
        isAdministerComfirmShow: false
      });
    } else {
      this.setState({
        deleteComfirmOpen: false
      });
    }
  };

  handleDelete = id => {
    this.setState({
      flagPageClean: true,
      deleteComfirmOpen: true,
      comfirmMessageTitle: 'Delete Role',
      comfirmMessage: 'You are trying to delete the selected role(s), please confirm.',
      // modified by Kevin on 9/1/2019---start
      checkedIds: id
      // modified by Kevin on 9/1/2019---end
    });
  };

  clean = () => {
    this.recordSelectedFeatures = [];
    this.setState({
      featureList: [{ featureUuid: '' }],
      checkedIds: [],
      selectedFeatures: [],
      updateRole: {},
      operationType: null,
      roleId: '',
      selectedFeaturesForSearch: [],
      roleNames: []
    });
  };

  // added by AnKe on 14/2/2019---start
  administerRoleCheak = (type, cheaked, name, desc) => {
    const { newRole, updateRole: newUpdateRole } = this.state;
    if (type === 'create') {
      newRole.roleDesc = desc;
      newRole.roleName = name;
    } else if (type === 'update') {
      newUpdateRole.roleDesc = desc;
      newUpdateRole.roleName = name;
    }
    if (cheaked) {
      this.setState({
        isAdministerComfirmShow: true,
        comfirmMessage: 'You are trying to create an Administer Role, please confirm.',
        comfirmMessageTitle: 'Create Administer Role',
        updateRole: newUpdateRole,
        newRole
      });
    } else {
      this.setState({
        isCheakedAdminister: false,
        updateRole: newUpdateRole
      });
    }
  };

  selectedGroupIdsList = [];

  handleGroupAllSelected = event => {
    event.stopPropagation();
    const { groupList } = this.state;
    const allChecked = event.target.checked;
    const newData = groupList.slice();
    if (allChecked) {
      this.getChildrenListId(newData);
      this.setState({
        selectedGroups: this.selectedGroupIdsList
      });
    } else {
      this.setState({
        selectedGroups: []
      });
    }
  };

  getChildrenListId = child => {
    child.forEach(item => {
      this.selectedGroupIdsList.push(item.groupId);
      if (item.children) {
        this.getChildrenListId(item.children);
      }
    });
  };

  isSelectedGroup = id => {
    const { selectedGroups } = this.state;
    return selectedGroups.indexOf(id) !== -1;
  };

  handleGroupSelected = event => {
    event.stopPropagation();
    const { checked, value: chechboxValue } = event.target;
    const { selectedGroups } = this.state;
    const newSelected = selectedGroups.slice();
    const valueIndex = newSelected.indexOf(chechboxValue);
    if (checked && valueIndex === -1) {
      newSelected.push(chechboxValue);
    }
    if (!checked && valueIndex !== -1) {
      newSelected.splice(valueIndex, 1);
    }
    this.setState({
      selectedGroups: newSelected
    });
  };

  cancelCreateAdminister = () => {
    this.setState({
      isCheakedAdminister: false
    });
    this.closeAddRoleDialog(false);
  };

  handleGroupModuleSelected = (event, item) => {
    event.stopPropagation();
    const { selectedGroups } = this.state;
    const { checked } = event.target;
    // const chechboxValue = event.target.value;
    const formatGroupModule = Tools.getFormatedData(item); // arry
    const newSelected = selectedGroups.slice();
    if (checked) {
      // only put the item which changed(statusPlus !== "Y") in
      for (const item of formatGroupModule) {
        const { groupId } = item;
        const valueIndex = newSelected.indexOf(groupId);
        if (valueIndex === -1) {
          newSelected.push(groupId);
        }
      }
      // this.recordSelectedFeatures.push(...newDataToSelected);
      // newSelected.push(...newDataToSelected)
      this.setState({
        selectedGroups: newSelected
      });
    } else {
      for (const item of formatGroupModule) {
        const { groupId } = item;
        const valueIndex = newSelected.indexOf(groupId);
        if (valueIndex !== -1) {
          newSelected.splice(valueIndex, 1);
        }
      }
      this.setState({
        selectedGroups: newSelected
      });
    }
  };

  cleanNewRole = () => {
    this.setState({
      newRole: { roleName: '', roleDesc: '' }
    });
  };

  handleGetDataByPage = (pageNo = 0, pageSize = 5, filterObj) => {
    const { dispatch, userId } = this.props;
    if (!!filterObj && filterObj !== {}) {
      this.filterObj = filterObj;
    }
    const obj = Object.assign({}, this.filterObj);
    obj.userId = userId;
    obj.pageNo = pageNo;
    obj.pageSize = pageSize;
    dispatch({
      type: 'securityRoleManagement/getRoleData',
      payload: { obj }
    });
  };

  handleChangeRole = (prop, value) => {
    const { operationType } = this.state;
    if (operationType === 'create') {
      const { newRole } = this.state;
      newRole[prop] = value;
      this.setState({
        newRole
      });
    } else if (operationType === 'update') {
      const { updateRole } = this.state;
      updateRole[prop] = value;
      this.setState({
        updateRole
      });
    }
  };

  render() {
    const {
      isAdministerComfirmShow,
      isCheakedAdminister,
      isCreateNewRole,
      isVisibility,
      checkedIds,
      flagSearchClean,
      rolesData,
      flagPageClean,
      operationType,
      newRole,
      updateRole,
      selectedGroups,
      groupList,
      groupsNum,
      oldRole,
      featureList,
      openFeatureDialog,
      selectedFeatures,
      comfirmMessage,
      comfirmMessageTitle,
      deleteComfirmOpen
    } = this.state;
    const { addRoleIsSuccess, featureListTree, moduleName, loading, classes } = this.props;
    const checkPermission = checkUserPermission('M4-12');
    return (
      <Paper elevation={0}>
        <div className={classNames(classes.root, { [classes.rootBgColor]: checkedIds.length > 0 })}>
          <div>
            {checkedIds.length > 0 ? (
              <Permission materialKey="M4-11">
                <Tooltip title={I18n.t('security.roleManagement.tooltips.deleteRole')}>
                  <IconButton
                    aria-label="Delete Role"
                    onClick={() => this.handleDelete(checkedIds)}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Permission>
            ) : (
              <Permission materialKey="M4-9">
                <Tooltip title={I18n.t('security.roleManagement.tooltips.addRole')}>
                  <IconButton
                    aria-label="Add Role"
                    onClick={() => this.openCreateOrUpdatePage('create', {})}
                  >
                    <LibraryAdd />
                  </IconButton>
                </Tooltip>
              </Permission>
            )}
          </div>

          <div>
            <TableToolbar
              disabled={!checkPermission}
              flagSearchClean={flagSearchClean}
              handleGetDataByPage={obj => this.handleGetDataByPage(0, 5, obj)}
              fieldList={[
                [I18n.t('security.roleManagement.placeholder.roleName'), 'roleName', 'iptType'],
                [
                  I18n.t('security.roleManagement.placeholder.roleDescription'),
                  'roleDesc',
                  'iptType'
                ]
              ]}
              handleDeleteUser={text => this.handleDelete(text)}
              checkedIds={checkedIds}
            />
          </div>
        </div>

        <RoleTable
          loading={loading}
          moduleName={moduleName}
          data={rolesData}
          selected={checkedIds}
          handleGetDataByPage={this.handleGetDataByPage}
          handleCheckboxClick={this.handleCheckboxClick}
          handleSelectAllClick={this.handleSelectAllClick}
          isSelected={this.isSelected}
          openCreateOrUpdatePage={this.openCreateOrUpdatePage}
          openFeatureDialog={roleId => this.handleOpenFeatureDialog(roleId)}
          // modified by Kevin on 9/1/2019---start
          handleDeleteRole={id => this.handleDelete([id])}
          // modified by Kevin on 9/1/2019---end
          // reset pageNo and pageSize
          flagPageClean={flagPageClean}
        />

        {/* added by AnKe on 14/2/2019---start */}
        <AddRole
          openDialog={addRoleIsSuccess}
          operationType={operationType}
          handleDialogClose={this.cancelCreateAdminister}
          handleRoleSubmit={this.handleRoleSubmit}
          administerRoleCheak={(type, cheaked, name, desc) =>
            this.administerRoleCheak(type, cheaked, name, desc)
          }
          isCheakedAdminister={isCheakedAdminister}
          role={operationType === 'create' ? newRole : updateRole}
          isCreateNewRole={isCreateNewRole}
          handleGroupSelected={this.handleGroupSelected}
          handleGroupAllSelected={this.handleGroupAllSelected}
          isSelectedGroup={id => this.isSelectedGroup(id)}
          selectedGroups={selectedGroups}
          groupList={groupList}
          groupsNum={groupsNum}
          cleanNewRole={this.cleanNewRole}
          isVisibility={isVisibility}
          handleChangeRole={this.handleChangeRole}
          oldRole={oldRole}
        />
        {/* added by AnKe on 14/2/2019---end */}
        <FeatureDialog
          featureList={featureList}
          featureListTree={featureListTree}
          openFeatureDialog={openFeatureDialog}
          closeFeatureDialog={this.handleCloseFeatureDialog}
          handleFeatureSelected={this.handleFeatureSelected}
          // modified by Kevin on 9/1/2019---start
          handleFeatureModuleSelected={this.handleFeatureModuleSelected}
          // modified by Kevin on 9/1/2019---end
          handleFeatureAllSelected={this.handleFeatureAllSelected}
          isSelectedFeature={id => this.isSelectedFeature(id)}
          selectedFeatures={selectedFeatures}
          save={this.handleSaveFeatures}
          handleSearch={this.handleSearchFeature}
        />
        <ConfirmPage
          message={comfirmMessage}
          messageTitle={comfirmMessageTitle}
          isConfirmPageOpen={isAdministerComfirmShow || deleteComfirmOpen}
          hanldeConfirmMessage={
            isAdministerComfirmShow ? this.createAdminister : this.hanldeDeleteFeatureComfirm
          }
          handleConfirmPageClose={this.handleDelFeatureComfirmPageClose}
        />
      </Paper>
    );
  }
}

export default withStyles(styles)(List);

const Tools = {
  // data tools
  formatedData: [],

  clearArray() {
    this.formatedData = [];
  },

  saveFormatedData(item) {
    this.formatedData.push(item);
  },

  getFormatedData(data) {
    this.clearArray();
    this.formatTreeData(data);
    return this.formatedData;
  },

  formatTreeData(data) {
    this.saveFormatedData(data);
    if (!!data.children && data.children.length > 0) {
      const childrenArr = data.children;
      for (const temp of childrenArr) {
        this.formatTreeData(temp);
      }
    }
  }
};
