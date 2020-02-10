import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import msg from 'utils/messageCenter';
import { IVHTable, Pagination, ConfirmPage, TableToolbar, ToolTip } from 'components/common';
import { isSuccess } from 'utils/helpers';
import {
  ApiKeyAddOrUpdateDialog as AddOrUpdate,
  ApiKeyExtraCell as ExtraCell,
  ApiKeyAssignRolePage as AssignRolePage,
  RoleManagementAssignFeature as FeaturePage,
  ApiKeyAssignGroupPage as AssignGroupPage,
  ApiKeyPermissionPage as PermissionPage
} from 'components/Security';
import { I18n } from 'react-i18nify';
import { PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
import IconButton from '@material-ui/core/IconButton';
import LibraryAdd from '@material-ui/icons/LibraryAdd';
// import moment from 'moment';, DATE_FORMAT

function ApiKey(props) {
  const moduleName = 'securityApiKey';
  const msgTitle = 'Api Key';
  const { dispatch, global, securityApiKey } = props;
  const { roleData, groupData, featureData, featureTreeData } = securityApiKey;
  const { userId } = global;

  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [dataSource, setdataSource] = useState({});
  const [pageNo, setPageNo] = useState(PAGE_NUMBER);
  const [popAdd, setPopAdd] = useState(false);
  const [targetItem, setTargetItem] = useState(null);
  const [confirmPageOpen, setconfirmPageOpen] = useState(false);
  const [popAssignGroup, setPopAssignGroup] = useState(false);
  const [popAssignRole, setPopAssignRole] = useState(false);
  const [popAssignFeature, setPopAssignFeature] = useState(false);
  const [popAssignPermission, setPopAssignPermission] = useState(false);
  const [permissionData, setPermissionData] = useState([]);
  const getApiKeyList = useCallback(
    filerObj => {
      dispatch({
        type: `${moduleName}/getApiKeyList`,
        payload: {
          ...filerObj,
          pageNo,
          pageSize
        }
      }).then(res => {
        if (!res) return;
        if (isSuccess(res)) {
          setPageNo(res.data.pageNo);
          setPageSize(res.data.pageSize);
          setdataSource(res.data);
        } else {
          msg.error(res.message, msgTitle);
        }
      });
    },
    [dispatch, pageNo, pageSize]
  );

  useEffect(() => {
    getApiKeyList();
  }, [getApiKeyList]);
  function getRoleData(pageNo, pageSize) {
    dispatch({
      type: `${moduleName}/getRoleData`,
      payload: { pageNo, pageSize, userId }
    });
  }
  function getVapRoleData() {
    dispatch({
      type: `${moduleName}/getVapRoleList`
    });
  }
  function getFeatureData(roleId) {
    dispatch({
      type: `${moduleName}/getFeatureData`,
      payload: { roleId, userId }
    });
  }
  const columns = [
    {
      title: I18n.t('security.apiKey.sysUser'),
      dataIndex: 'userId'
    },
    {
      title: I18n.t('security.apiKey.apiKey'),
      dataIndex: 'apikey'
    },
    {
      title: I18n.t('security.apiKey.targetSystem'),
      dataIndex: 'targetSystem'
    },
    {
      title: I18n.t('security.apiKey.createdBy'),
      dataIndex: 'createdId'
    },
    {
      title: I18n.t('security.apiKey.validTime'),
      dataIndex: 'validTime'
    },
    {
      title: I18n.t('security.apiKey.startDate'),
      dataIndex: 'startDate'
      // render: text => moment(`${text}:00`).format(DATE_FORMAT)
    },
    {
      title: I18n.t('security.apiKey.expiredDate'),
      dataIndex: 'expiredDate'
      // render: text => moment(`${text}:00`).format(DATE_FORMAT)
    },
    {
      title: I18n.t('global.button.operation'),
      dataIndex: '',
      renderItem: item => (
        <ExtraCell
          disabled={item && item.total <= 0}
          openConfirm={() => openConfirm(item)}
          openEdit={() => openEdit(item)}
          openAssignGroup={() => openAssignGroup(item)}
          openAssignRole={() => openAssignRole(item)}
          item={item}
          generateApiKey={() => generateApiKey(item)}
        />
      ),
      noTooltip: true
    }
  ];

  function generateApiKey(obj) {
    dispatch({
      type: `${moduleName}/generateApiKey`,
      payload: { userId: obj.userId, createdId: userId }
    }).then(res => {
      if (!res) return;
      if (isSuccess(res)) {
        getApiKeyList();
      } else if (res) {
        msg.error(res.message, msgTitle);
      }
    });
  }
  function openAssignGroup(item) {
    setPopAssignGroup(true);
    setTargetItem(item);
  }
  function openAssignRole(item) {
    setPopAssignRole(true);
    setTargetItem(item);
    if (item.targetSystem === 'UVAP') {
      getVapRoleData();
    } else {
      getRoleData(PAGE_NUMBER, PAGE_SIZE);
    }
  }
  function openCreate() {
    setPopAdd(true);
    setTargetItem(null);
  }
  function saveApiKey(obj) {
    dispatch({
      type: `${moduleName}/createApikey`,
      payload: { ...obj, createdId: userId }
    }).then(res => {
      if (!res) return;
      if (isSuccess(res)) {
        if (pageNo === PAGE_NUMBER) {
          getApiKeyList();
        } else {
          setPageNo(PAGE_NUMBER);
        }
        setPopAdd(false);
      } else if (res) {
        msg.error(res.message, msgTitle);
      }
    });
  }
  const onChangePage = (e, pageNo) => {
    setPageNo(pageNo);
    // getApiKeyList();
  };

  const onChangeRowsPerPage = e => {
    const { value } = e.target;
    setPageSize(value);
    // getApiKeyList(value, pageNo);
  };
  const openEdit = item => {
    setTargetItem(item);
    setPopAdd(true);
  };
  const openFeature = item => {
    setPopAssignFeature(true);
    getFeatureData(item.roleId);
  };
  const openPermission = data => {
    setPopAssignPermission(true);
    setPermissionData(data);
  };
  function handleDelete() {
    closeConfirm();
    dispatch({
      type: `${moduleName}/deleteApiKey`,
      payload: { ...targetItem }
    }).then(res => {
      if (!res) return;
      if (isSuccess(res)) {
        msg.success('Delete ApiKey Success', '');
        getApiKeyList();
      } else if (res) {
        msg.error(res.message, msgTitle);
      }
    });
  }
  const openConfirm = item => {
    setconfirmPageOpen(true);
    setTargetItem(item);
  };

  const closeConfirm = () => {
    setconfirmPageOpen(false);
  };
  function handleAssignRole(id) {
    dispatch({
      type: `${moduleName}/assignRole`,
      payload: { roleId: id, userId: targetItem.userId, createdId: userId }
    }).then(res => {
      if (!res) return;
      if (isSuccess(res)) {
        msg.success('Assign Role Success', '');
        getApiKeyList();
        setPopAssignRole(false);
        setTargetItem({});
      } else if (res) {
        msg.error(res.message, msgTitle);
      }
    });
  }
  function handleAssignGroup(id) {
    dispatch({
      type: `${moduleName}/assignGroup`,
      payload: { groupId: id, userId: targetItem.userId, createdId: userId }
    }).then(res => {
      if (!res) return;
      if (isSuccess(res)) {
        msg.success('Assign Group Success', '');
        setPopAssignGroup(false);
        getApiKeyList();
        setTargetItem({});
      } else if (res) {
        msg.error(res.message, msgTitle);
      }
    });
  }
  const handleSearch = obj => {
    setPageNo(PAGE_NUMBER);
    setPageSize(PAGE_SIZE);
    getApiKeyList(obj);
  };
  return (
    <>
      <TableToolbar
        handleGetDataByPage={handleSearch}
        fieldList={[['SysUser', 'userId', 'iptType'], ['TargetSystem', 'targetSystem', 'iptType']]}
      >
        <div style={{ marginLeft: 'auto' }}>
          <ToolTip title="Create Api Key">
            <IconButton aria-label="Create Api Key" onClick={openCreate}>
              <LibraryAdd />
            </IconButton>
          </ToolTip>
        </div>
      </TableToolbar>
      <IVHTable
        dataSource={dataSource.items || []}
        columns={columns}
        rowKey="id"
        tableMaxHeight="calc(100% - 160px)"
      />
      <Pagination
        page={pageNo}
        rowsPerPage={pageSize}
        count={dataSource.totalNum || 0}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
      />
      {popAdd && (
        <AddOrUpdate
          onClose={() => {
            setPopAdd(false);
          }}
          itemData={targetItem}
          handleSubmit={saveApiKey}
        />
      )}
      {popAssignGroup && (
        <AssignGroupPage
          openDialog={popAssignGroup}
          onClose={() => {
            setPopAssignGroup(false);
          }}
          getRoleData={groupData}
          itemData={targetItem}
          handleSubmit={handleAssignGroup}
        />
      )}
      {popAssignRole && (
        <AssignRolePage
          onClose={() => {
            setPopAssignRole(false);
          }}
          roleData={roleData}
          handleSubmit={handleAssignRole}
          itemData={targetItem}
          getRoleData={getRoleData}
          getFeatureData={getFeatureData}
          openFeature={openFeature}
          openPermission={openPermission}
        />
      )}
      {popAssignFeature && (
        <FeaturePage
          openFeatureDialog={popAssignFeature}
          featureList={featureData.items}
          featureListTree={featureTreeData}
          closeFeatureDialog={() => {
            setPopAssignFeature(false);
          }}
          mode="DiaplayOnly"
        />
      )}
      {popAssignPermission && (
        <PermissionPage
          onClose={() => {
            setPopAssignPermission(false);
          }}
          dataSource={permissionData || []}
        />
      )}
      <ConfirmPage
        message={I18n.t('security.apiKey.deleteConfirm')}
        messageTitle={I18n.t('security.apiKey.deleteApiKey')}
        isConfirmPageOpen={confirmPageOpen}
        hanldeConfirmMessage={handleDelete}
        handleConfirmPageClose={closeConfirm}
      />
    </>
  );
}
export default connect(({ securityApiKey, global }) => ({
  securityApiKey,
  global
}))(ApiKey);
