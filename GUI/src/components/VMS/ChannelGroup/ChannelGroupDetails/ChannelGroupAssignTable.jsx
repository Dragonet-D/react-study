import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { I18n } from 'react-i18nify';
import Typography from '@material-ui/core/Typography';
// import Collapse from '@material-ui/core/Collapse';
import { Pagination, IVHTable, TableToolbar, TableHeaderAction } from 'components/common';
import { PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
import { dataUpdatedHandle } from 'utils/helpers';
import {
  handleCheckedItem,
  handleInitCheckedItemList,
  handleSlectedItems,
  handleInitCheckedItem,
  NoChangeInfoMsg
} from '../utils';

const useStyles = makeStyles(() => {
  return {
    tableContainer: {
      // display: 'flex',
      // alignItems: 'center',
      marginTop: '20px'
    },
    boxTitle: { fontSize: '0.8vw' },
    detailsBox: { position: 'relative' }
  };
});

function ChannelGroupAssignTable(props) {
  const classes = useStyles();
  const { dispatch, global, VMSChannelGroup } = props;
  const { channelList, namespace, groupDetails } = VMSChannelGroup;
  const { userId } = global;
  const moduleName = namespace;
  const [rowSelectItems, setRowSelectItems] = useState([]);
  const [oldRowSelectItems, setOldRowSelectItems] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [pageNo, setPageNo] = useState(PAGE_NUMBER);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [searchParams, setSearchParams] = useState('{}');

  const getChannelListFunc = useCallback(
    (obj = {}) => {
      dispatch({
        type: `${moduleName}/getChannelList`,
        payload: {
          userId,
          pageNo,
          pageSize,
          ...JSON.parse(searchParams),
          ...obj
        }
      });
    },
    [dispatch, moduleName, pageNo, pageSize, searchParams, userId]
  );

  useEffect(() => {
    setDataSource(channelList.items || []);
    setTotalNum(channelList.totalNum || 0);
  }, [channelList]);
  useEffect(() => {
    setRowSelectItems(handleInitCheckedItemList(channelList.items, groupDetails.groupId));
    setOldRowSelectItems(handleInitCheckedItemList(channelList.items, groupDetails.groupId));
    setDataSource(handleInitCheckedItem(channelList.items, groupDetails.groupId));
  }, [channelList, groupDetails]);
  useEffect(() => {
    getChannelListFunc();
  }, [searchParams, pageNo, pageSize, getChannelListFunc]);

  // table setting
  const columns = [
    {
      title: I18n.t('uvms.channelGroup.detailsBox.table.name'),
      dataIndex: 'channelName'
    },
    {
      title: I18n.t('uvms.channelGroup.detailsBox.table.device'),
      dataIndex: 'deviceName'
    },
    {
      title: I18n.t('uvms.channelGroup.detailsBox.table.uri'),
      dataIndex: 'deviceUri'
    },
    {
      title: I18n.t('uvms.channelGroup.detailsBox.table.groupName'),
      dataIndex: 'groupName'
    },
    {
      title: I18n.t('uvms.channelGroup.detailsBox.table.schedule'),
      dataIndex: 'scheduleName'
    },
    {
      title: I18n.t('uvms.channelGroup.detailsBox.table.model'),
      dataIndex: 'modelId'
    },
    {
      title: I18n.t('uvms.channelGroup.detailsBox.table.status'),
      dataIndex: 'vmsStatus'
    }
  ];
  // header action setting
  const headerActionSetting = [
    {
      title: I18n.t('uvms.channelGroup.detailsBox.headerAction.assign'),
      action: 'assign'
    }
  ];

  function handleAction(target) {
    switch (target) {
      case 'assign':
        assignChannelToGroup();
        break;
      default:
        break;
    }
  }

  // rowSelection setting
  const rowSelection = {
    onChange: handleRowSelection
  };

  function handleRowSelection(item, event) {
    const { checked } = event.target;
    const { channelId } = item;
    setDataSource(dataSource => {
      const data = handleCheckedItem(dataSource, channelId, checked);
      setRowSelectItems(data.filter(item => !!item.checked));
      return data;
    });
  }

  function handleChooseAll(e) {
    const { checked } = e.target;
    setDataSource(dataSource => {
      const data = dataSource.map(item => ({ ...item, checked }));
      setRowSelectItems(checked ? data : []);
      return data;
    });
  }

  function onChangePage(e, page) {
    setPageNo(page);
  }
  function onChangeRowsPerPage(e) {
    const { value } = e.target;
    setPageSize(value);
  }
  function assignChannelToGroup(obj = {}) {
    if (_.isEqual(rowSelectItems, oldRowSelectItems)) {
      NoChangeInfoMsg(I18n.t('uvms.channelGroup.detailsBox.headerAction.assign'));
      return false;
    }
    const selectData = handleSlectedItems(rowSelectItems);
    dispatch({
      type: `${moduleName}/assignChannelToGroup`,
      payload: {
        createdId: userId,
        channelGroup: groupDetails,
        ...selectData,
        ...obj
      }
    }).then(res => {
      dataUpdatedHandle(res, I18n.t('uvms.channelGroup.detailsBox.headerAction.assign'), () => {
        getChannelListFunc();
      });
    });
  }

  return (
    <div className={classes.tableContainer}>
      <Typography component="h5">
        {I18n.t('uvms.channelGroup.detailsBox.assignChannelTableTitle')}
      </Typography>

      <div className={classes.detailsBox}>
        <TableToolbar
          handleGetDataByPage={e => setSearchParams(JSON.stringify(e))}
          fieldList={[
            ['Channel Name', 'channelName', 'iptType'],
            ['Status', 'vmsStatus', 'dropdownType']
          ]}
          dataList={{
            Status: {
              data: ['active', 'unavailable'],
              type: 'normal'
            }
          }}
        />

        {/* <Collapse in={rowSelectItems.length > 0}> */}
        <TableHeaderAction headerActionSetting={headerActionSetting} handleAction={handleAction} />
        {/* </Collapse> */}

        <IVHTable
          tableMaxHeight={rowSelectItems.length > 0 ? 'calc(100% - 196px)' : 'calc(100% - 160px)'}
          handleChooseAll={handleChooseAll}
          rowSelection={rowSelection}
          keyId="channelId"
          columns={columns}
          dataSource={dataSource}
          // loading={loading.effects[`${moduleName}/getChannelList`]}
        />

        <Pagination
          page={pageNo}
          rowsPerPage={pageSize}
          count={_.parseInt(totalNum) || 0}
          onChangePage={onChangePage}
          onChangeRowsPerPage={onChangeRowsPerPage}
        />
      </div>
    </div>
  );
}

export default connect(({ global, VMSChannelGroup }) => ({
  global,
  VMSChannelGroup
}))(ChannelGroupAssignTable);
