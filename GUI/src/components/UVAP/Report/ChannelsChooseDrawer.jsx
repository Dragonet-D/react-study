/* eslint-disable no-unused-vars */
import React, { useCallback, useState, useReducer, useEffect } from 'react';
import Drawer from '@material-ui/core/Drawer';
import PropTypes from 'prop-types';
import { Pagination, IVHTableAntd } from 'components/common';
import { I18n } from 'react-i18nify';
import { PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
import _ from 'lodash';
import Typography from '@material-ui/core/Typography';
// import { MapSketch } from 'components/common';
// import { channelData } from './test';

function ChannelsChooseDrawer(props) {
  const {
    open,
    onClose,
    getChannelList,
    channelList,
    multipleDeivceItems,
    setMultipleDeivceItems
  } = props;

  const [sourceData, setSourceData] = useState([]);
  const [rowSelectItems, setRowSelectItems] = useState([]);
  // channel table init
  const channelPageAction = (pageInfo, action) => {
    switch (action.type) {
      case 'pageNo':
        return { ...pageInfo, pageNo: action.data };
      case 'pageSize':
        return { pageNo: PAGE_NUMBER, pageSize: action.data };
      default:
        throw new Error();
    }
  };
  const [channelPage, dispatchChannelPage] = useReducer(channelPageAction, {
    pageNo: PAGE_NUMBER,
    pageSize: PAGE_SIZE
  });
  const [totalNum, setTotalNum] = useState(0);
  const handleClose = useCallback(() => {
    onClose(false);
  }, [onClose]);

  function onChangePage(e, page) {
    dispatchChannelPage({ type: 'pageNo', data: page });
  }
  function onChangeRowsPerPage(e) {
    const { value } = e.target;
    dispatchChannelPage({ type: 'pageSize', data: value });
  }
  function handleDeviceRowSelection(ids, items) {
    setRowSelectItems(ids);
    // Clear repeat options, Merge different paging options
    const newMultipleDeivceItems = _.unionWith(multipleDeivceItems, items, _.isEqual).filter(
      item => _.indexOf(ids, item.channelId) >= 0
    );
    setMultipleDeivceItems(_.cloneDeep(newMultipleDeivceItems));
  }

  // table columns setting
  const columns = [
    {
      title: I18n.t('uvms.channelGroup.detailsBox.table.name'),
      dataIndex: 'channelName'
    },
    {
      title: I18n.t('uvms.channelGroup.detailsBox.table.status'),
      dataIndex: 'vmsStatus'
    }
  ];
  const rowDeviceSelectionConfig = {
    selectedRowKeys: rowSelectItems,
    onChange: handleDeviceRowSelection
  };

  useEffect(() => {
    getChannelList(channelPage);
  }, [getChannelList, channelPage]);

  useEffect(() => {
    setSourceData(_.isEmpty(channelList) ? [] : channelList.items);
    setTotalNum(channelList.totalNum ? _.parseInt(channelList.totalNum) : 0);
  }, [channelList]);
  return (
    <>
      <Drawer open={open} anchor="right" keepMounted onClose={handleClose}>
        <div style={{ width: '50vw', height: '100%' }}>
          {/* <MapSketch
            channelData={channelData}
            getMapInformation={e => {
              console.log(e);
            }}
          /> */}
          <Typography variant="h6" component="span" color="textSecondary">
            {I18n.t('alarm.history.channel')}
          </Typography>
          <IVHTableAntd
            columns={columns}
            dataSource={sourceData || []}
            rowSelection={rowDeviceSelectionConfig}
            rowKey="channelId"
          />

          <Pagination
            page={channelPage.pageNo}
            rowsPerPage={channelPage.pageSize}
            count={totalNum}
            onChangePage={onChangePage}
            onChangeRowsPerPage={onChangeRowsPerPage}
          />
        </div>
      </Drawer>
    </>
  );
}

ChannelsChooseDrawer.defaultProps = {
  open: false,
  onClose: () => {},
  channelList: {},
  getChannelList: () => {},
  setMultipleDeivceItems: () => {},
  multipleDeivceItems: []
  // channelData: []
};

ChannelsChooseDrawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  channelList: PropTypes.object,
  getChannelList: PropTypes.func,
  setMultipleDeivceItems: PropTypes.func,
  multipleDeivceItems: PropTypes.array
  // channelData: PropTypes.array
};

export default ChannelsChooseDrawer;
