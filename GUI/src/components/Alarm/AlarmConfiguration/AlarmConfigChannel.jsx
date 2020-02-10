import React, { useState, useEffect } from 'react';
import { IVHTable, Pagination } from 'components/common';
import { PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
import PropTypes from 'prop-types';
import { I18n } from 'react-i18nify';
import { handleCheckedItem } from '../utils';
import { handleChannelSelect, handleDeliveryToSelected } from './utils';

function AlarmConfigChannel(props) {
  const { dataSource, getSelectedItems, alarmData, handleChange } = props;
  const { sourceId = '' } = alarmData;
  const [data, setData] = useState([]);
  const [pageNo, setPageNo] = useState(PAGE_NUMBER);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  useEffect(() => {
    setData(handleChannelSelect(dataSource.items || [], sourceId));
  }, [dataSource, sourceId]);

  const columns = [
    {
      title: I18n.t('alarm.config.cameraName'),
      dataIndex: 'deviceName'
    },
    {
      title: I18n.t('alarm.config.parentDevices'),
      dataIndex: 'parentDevice'
    },
    {
      title: I18n.t('alarm.config.groupName'),
      dataIndex: 'groupName'
    },
    {
      title: I18n.t('alarm.config.model'),
      dataIndex: 'modelId'
    }
  ];
  function handleSelectRow(item, event) {
    const { channelId } = item;
    const { checked } = event.target;
    setData(dataSource => {
      const data = handleCheckedItem(dataSource, channelId, checked, 'channelId');
      const selectedItems = data.filter(item => !!item.checked);
      const ids = selectedItems.map(item => item.channelId);
      const currentPageIds = dataSource.map(item => item.channelId);
      getSelectedItems(handleDeliveryToSelected(sourceId, currentPageIds, ids));
      return data;
    });
  }

  function handleChooseAll(e) {
    const { checked } = e.target;
    setData(dataSource => {
      const data = dataSource.map(item => ({ ...item, checked }));
      const currentPageIds = dataSource.map(item => item.channelId);
      const ids = data.map(item => item.channelId);
      getSelectedItems(checked ? handleDeliveryToSelected(sourceId, currentPageIds, ids) : '');
      return data;
    });
  }

  function handlePageChange(obj = {}) {
    handleChange({
      pageNo,
      pageSize,
      ...obj
    });
  }
  const rowSelection = {
    onChange: handleSelectRow
  };
  function onChangePage(e, page) {
    setPageNo(page);
    handlePageChange({ pageNo: page });
  }
  function onChangeRowsPerPage(e) {
    const { value } = e.target;
    setPageSize(value);
    handlePageChange({ pageSize: value });
  }

  return (
    <>
      <IVHTable
        handleChooseAll={handleChooseAll}
        keyId="channelId"
        tableMaxHeight="250px"
        columns={columns}
        dataSource={data}
        rowSelection={rowSelection}
      />
      <Pagination
        page={pageNo}
        rowsPerPage={pageSize}
        count={dataSource.totalNum || 0}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
      />
    </>
  );
}

AlarmConfigChannel.defaultProps = {
  getSelectedItems: () => {}
};

AlarmConfigChannel.propTypes = {
  getSelectedItems: PropTypes.func
};

export default AlarmConfigChannel;
