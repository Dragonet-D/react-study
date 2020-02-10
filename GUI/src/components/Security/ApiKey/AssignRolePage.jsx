import React, { useState } from 'react';
import { Button, IVHTable, Pagination, DialogTitle } from 'components/common';
import { I18n, Translate } from 'react-i18nify';
import { PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import _ from 'lodash';

function AssignRolePage(props) {
  const {
    roleData,
    getRoleData,
    onClose,
    openFeature,
    handleSubmit,
    itemData,
    openPermission
  } = props;
  const [pageNo, setPageNo] = useState(PAGE_NUMBER);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [checkedId, setCheckedId] = useState([]);
  const flagIsUVAP = itemData.targetSystem === 'UVAP' && !roleData.items;

  const ummiRolecolumns = [
    {
      title: I18n.t('security.roleTable.name'),
      dataIndex: 'roleName'
    },
    {
      title: I18n.t('security.roleTable.description'),
      dataIndex: 'roleDesc'
    },
    {
      title: I18n.t('security.roleTable.access'),
      dataIndex: '',
      key: '',
      renderItem: item => (
        <Button
          color="primary"
          onClick={() => {
            showFeature(item);
          }}
        >
          <Translate value="security.button.feature" />
        </Button>
      )
    }
  ];
  const uvapRolecolumns = [
    {
      title: I18n.t('security.roleTable.name'),
      dataIndex: 'name'
    },
    {
      title: I18n.t('security.roleTable.access'),
      dataIndex: '',
      key: '',
      renderItem: item => (
        <Button color="primary" onClick={() => showPermission(item.permissions)}>
          <Translate value="security.button.feature" />
        </Button>
      )
    }
  ];

  function showPermission(data) {
    openPermission(data);
  }
  function showFeature(item) {
    openFeature(item);
  }
  const onChangePage = (e, pageNo) => {
    setPageNo(pageNo);
    getRoleData(pageSize, pageNo);
  };

  const onChangeRowsPerPage = e => {
    const { value } = e.target;
    setPageSize(value);
    getRoleData(value, pageNo);
  };
  function cancel() {
    onClose();
  }
  function save() {
    handleSubmit(checkedId.toString());
  }

  function handleCheckboxClick(item, event) {
    const { checked } = event.target;
    let tid = '';
    if (flagIsUVAP) {
      const { id } = item;
      tid = id;
    } else {
      tid = item.roleId;
    }
    const ids = _.cloneDeep(checkedId);
    const valueIndex = ids.indexOf(tid);

    if (checked && valueIndex === -1) {
      ids.push(tid);
    }
    if (!checked && valueIndex !== -1) {
      ids.splice(valueIndex, 1);
    }
    setCheckedId(ids);
  }
  const rowSelection = {
    onChange: handleCheckboxClick,
    selectedRowKeys: checkedId
  };
  return (
    <Dialog fullWidth open>
      <DialogTitle>{I18n.t('security.apiKey.assignRole')}</DialogTitle>
      <DialogContent>
        <IVHTable
          dataSource={flagIsUVAP && !_.isEqual(roleData, {}) ? roleData : roleData.items || []}
          columns={flagIsUVAP ? uvapRolecolumns : ummiRolecolumns}
          rowKey="roleId"
          tableMaxHeight="calc(100% - 98px)"
          rowSelection={rowSelection}
        />
        <Pagination
          page={pageNo}
          rowsPerPage={pageSize}
          count={roleData.totalNum || 0}
          onChangePage={onChangePage}
          onChangeRowsPerPage={onChangeRowsPerPage}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={save} color="primary">
          {I18n.t('global.button.save')}
        </Button>
        <Button onClick={cancel} color="primary" autoFocus>
          {I18n.t('global.button.cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default AssignRolePage;
