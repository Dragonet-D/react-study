import React, { useCallback, useEffect, useState } from 'react';
import { IVHTable } from 'components/common';
import { I18n } from 'react-i18nify';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { handleCheckedItem, initialCheckedItems } from './utils';

function GroupTable(props) {
  const moduleName = 'faceEnrollment';
  const { get, faceEnrollment, dispatch, checkedItemIds, tableMaxHeight } = props;
  const { groupsDataTable } = faceEnrollment;
  const [data, setData] = useState([]);

  useEffect(() => {
    dispatch({
      type: `${moduleName}/getFrsGroupsTable`
    });
  }, [dispatch]);

  useEffect(() => {
    setData(initialCheckedItems(groupsDataTable, checkedItemIds));
  }, [checkedItemIds, groupsDataTable]);

  useEffect(() => {
    get({ getData });
  });

  function getData() {
    return data.filter(item => item.checked).map(item => item.id);
  }
  const columns = [
    {
      title: I18n.t('vap.face.faceEnrollment.groupName'),
      dataIndex: 'name'
    },
    {
      title: I18n.t('vap.face.faceEnrollment.triggerAlarm'),
      dataIndex: 'notificationEnabled',
      render: value => value.toString()
    }
  ];

  const handleItemChoose = useCallback((item, event) => {
    const { id } = item;
    const { checked } = event.target;
    setData(dataSource => {
      return handleCheckedItem(dataSource, id, checked);
    });
  }, []);
  const rowSelection = {
    onChange: handleItemChoose
  };

  const handleChooseAll = useCallback(e => {
    const { checked } = e.target;
    setData(dataSource => {
      return dataSource.map(item => ({ ...item, checked }));
    });
  }, []);

  return (
    <IVHTable
      keyId="id"
      handleChooseAll={handleChooseAll}
      columns={columns}
      dataSource={data}
      rowSelection={rowSelection}
      tableMaxHeight={tableMaxHeight}
    />
  );
}
GroupTable.defaultProps = {
  get: () => {},
  checkedItemIds: [],
  tableMaxHeight: '236px'
};

GroupTable.propTypes = {
  get: PropTypes.func,
  checkedItemIds: PropTypes.array,
  tableMaxHeight: PropTypes.string
};

export default connect(({ faceEnrollment }) => ({ faceEnrollment }))(GroupTable);
