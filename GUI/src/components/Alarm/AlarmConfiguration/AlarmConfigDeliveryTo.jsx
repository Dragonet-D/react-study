import React, { useCallback, useEffect, useState } from 'react';
import { IVHTable, Pagination, TableToolbar } from 'components/common';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import _ from 'lodash';
import { PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
import msg from 'utils/messageCenter';
import { I18n } from 'react-i18nify';
import makeStyles from '@material-ui/core/styles/makeStyles';
import AlarmDialog from '../AlarmDialog';
import { handleCheckedItem } from '../utils';
import { handleDeliveryToSelected, handleDeliveryToArray } from './utils';

const useStyles = makeStyles(() => {
  return {
    dialog: {
      height: 520,
      width: 960,
      maxWidth: 960
    }
  };
});

function AlarmConfigDeliveryTo(props) {
  const moduleName = 'alarmConfiguration';
  const classes = useStyles();
  const { open, title, onClose, alarmConfiguration, global, dispatch, onSave, rowSelected } = props;
  const { deliveryToUserList } = alarmConfiguration;
  const { userId } = global;

  const [dataSource, setDataSource] = useState([]);
  const [pageNo, setPageNo] = useState(PAGE_NUMBER);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [searchParameters, setSearchParameters] = useState({});
  const [originSubscribeData, setOriginSubscribeData] = useState([]);

  const getUserList = useCallback(
    (obj = {}) => {
      dispatch({
        type: `${moduleName}/getUserList`,
        payload: {
          pageNo,
          pageSize,
          searchUserId: userId,
          ...searchParameters,
          ...obj
        }
      });
    },
    [dispatch, pageNo, pageSize, searchParameters, userId]
  );

  useEffect(() => {
    getUserList();
  }, [getUserList]);

  useEffect(() => {
    if (deliveryToUserList.items) {
      const { items } = _.cloneDeep(deliveryToUserList);
      const data = items.map(item => {
        return {
          ...item,
          checked: handleDeliveryToArray(rowSelected.deliverTo).includes(item.userId)
        };
      });
      setDataSource(data);
      setOriginSubscribeData(data);
    }
  }, [deliveryToUserList, rowSelected.deliverTo]);

  const columns = [
    {
      title: I18n.t('alarm.config.userID'),
      dataIndex: 'userId'
    },
    {
      title: I18n.t('alarm.config.fullName'),
      dataIndex: 'userFullName'
    },
    {
      title: I18n.t('alarm.config.email'),
      dataIndex: 'userEmail'
    },
    {
      title: I18n.t('alarm.config.phone'),
      dataIndex: 'userPhone'
    }
  ];

  function handleRowItemSelect(item, event) {
    const { userUuid } = item;
    const { checked } = event.target;
    setDataSource(dataSource => {
      return handleCheckedItem(dataSource, userUuid, checked, 'userUuid');
    });
  }

  const rowSelection = {
    onChange: handleRowItemSelect
  };

  function onChangePage(e, page) {
    setPageNo(page);
    getUserList({ pageNo: page });
  }

  function onChangeRowsPerPage(e) {
    const { value } = e.target;
    setPageSize(value);
    getUserList({ pageSize: value });
  }

  function handleAlarmConfigSearch(obj) {
    setSearchParameters(obj);
    getUserList(obj);
  }

  function handleSave() {
    if (_.isEqual(originSubscribeData, dataSource)) {
      msg.warn(I18n.t('global.popUpMsg.noChange'), 'Alarm Configuration');
      return;
    }
    const ids = dataSource.filter(item => item.checked).map(item => item.userId);
    const currentPageIds = dataSource.map(item => item.userId);
    onSave({
      ids: handleDeliveryToSelected(rowSelected.deliverTo, currentPageIds, ids),
      descriptionFields: {
        'Alarm Name': rowSelected.alarmName,
        'Last Updated Id': userId,
        Users: ids
      },
      alarmDefinitionUuid: rowSelected.alarmDefinitionUuid || '',
      lastUpdatedId: userId
    });
  }

  function handleClose() {
    onClose(false);
  }

  function handleChooseAll(e) {
    const { checked } = e.target;
    setDataSource(dataSource => {
      return dataSource.map(item => ({ ...item, checked }));
    });
  }
  return (
    <AlarmDialog
      open={open}
      title={title || I18n.t('alarm.config.deliveryTo')}
      handleSave={handleSave}
      handleClose={handleClose}
      dialogWidth={classes.dialog}
    >
      <TableToolbar
        handleGetDataByPage={handleAlarmConfigSearch}
        fieldList={[
          [I18n.t('alarm.config.userID'), 'userId', 'iptType'],
          [I18n.t('alarm.config.fullName'), 'userName', 'iptType'],
          [I18n.t('alarm.config.email'), 'userEmail', 'iptType']
        ]}
      />
      <IVHTable
        tableMaxHeight="292px"
        keyId="userUuid"
        columns={columns}
        handleChooseAll={handleChooseAll}
        rowSelection={rowSelection}
        dataSource={dataSource}
      />
      <Pagination
        count={deliveryToUserList.totalNum || 0}
        page={pageNo}
        rowsPerPage={pageSize}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
      />
    </AlarmDialog>
  );
}

AlarmConfigDeliveryTo.defaultProps = {
  title: I18n.t('alarm.config.deliveryTo'),
  rowSelected: {}
};

AlarmConfigDeliveryTo.propTypes = {
  title: PropTypes.string,
  rowSelected: PropTypes.object
};

export default connect(({ global, alarmConfiguration }) => ({
  global,
  alarmConfiguration
}))(AlarmConfigDeliveryTo);
