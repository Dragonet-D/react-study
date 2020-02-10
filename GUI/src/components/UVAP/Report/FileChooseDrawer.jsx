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

function FileChooseDrawer(props) {
  const {
    open,
    onClose,
    getFilesList,
    fileList,
    multipleDeivceItems,
    setMultipleDeivceItems
  } = props;

  const [sourceData, setSourceData] = useState([]);
  const [rowSelectItems, setRowSelectItems] = useState([]);
  // channel table init
  const filePageAction = (pageInfo, action) => {
    switch (action.type) {
      case 'pageNo':
        return { ...pageInfo, pageNo: action.data };
      case 'pageSize':
        return { pageNo: PAGE_NUMBER, pageSize: action.data };
      default:
        throw new Error();
    }
  };
  const [filePage, dispatchFilePage] = useReducer(filePageAction, {
    pageNo: PAGE_NUMBER,
    pageSize: PAGE_SIZE
  });
  const [totalNum, setTotalNum] = useState(0);
  const handleClose = useCallback(() => {
    onClose(false);
  }, [onClose]);

  function onChangePage(e, page) {
    dispatchFilePage({ type: 'pageNo', data: page });
  }
  function onChangeRowsPerPage(e) {
    const { value } = e.target;
    dispatchFilePage({ type: 'pageSize', data: value });
  }
  function handleDeviceRowSelection(ids, items) {
    setRowSelectItems(ids);
    // Clear repeat options, Merge different paging options
    const newMultipleDeivceItems = _.unionWith(multipleDeivceItems, items, _.isEqual).filter(
      item => _.indexOf(ids, item.id) >= 0
    );
    setMultipleDeivceItems(_.cloneDeep(newMultipleDeivceItems));
  }

  // table columns setting
  const columns = [
    {
      title: I18n.t('vap.table.files.name'),
      dataIndex: 'name'
    },
    {
      title: I18n.t('vap.table.files.type'),
      dataIndex: 'mimeType'
    },
    {
      title: I18n.t('vap.table.files.data'),
      dataIndex: 'metadata',
      render: text => <span>{JSON.stringify(text)}</span>
    }
  ];
  const rowDeviceSelectionConfig = {
    selectedRowKeys: rowSelectItems,
    onChange: handleDeviceRowSelection
  };

  useEffect(() => {
    getFilesList(filePage);
  }, [getFilesList, filePage]);

  useEffect(() => {
    setSourceData(_.isEmpty(fileList) ? [] : fileList.items);
    setTotalNum(fileList.totalCount ? _.parseInt(fileList.totalCount) : 0);
  }, [fileList]);
  return (
    <>
      <Drawer open={open} anchor="right" onClose={handleClose} keepMounted>
        <div style={{ width: '50vw', height: '100%' }}>
          {/* <MapSketch
            channelData={channelData}
            getMapInformation={e => {
              console.log(e);
            }}
          /> */}
          <Typography variant="h6" component="span" color="textSecondary">
            {I18n.t('vap.toolbar.report.fileId')}
          </Typography>
          <IVHTableAntd
            columns={columns}
            dataSource={sourceData || []}
            rowSelection={rowDeviceSelectionConfig}
            rowKey="id"
          />

          <Pagination
            page={filePage.pageNo}
            rowsPerPage={filePage.pageSize}
            count={totalNum}
            onChangePage={onChangePage}
            onChangeRowsPerPage={onChangeRowsPerPage}
          />
        </div>
      </Drawer>
    </>
  );
}

FileChooseDrawer.defaultProps = {
  open: false,
  onClose: () => {},
  fileList: {},
  getFilesList: () => {},
  setMultipleDeivceItems: () => {},
  multipleDeivceItems: []
  // channelData: []
};

FileChooseDrawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  fileList: PropTypes.object,
  getFilesList: PropTypes.func,
  setMultipleDeivceItems: PropTypes.func,
  multipleDeivceItems: PropTypes.array
  // channelData: PropTypes.array
};

export default FileChooseDrawer;
