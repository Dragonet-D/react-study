import React, { Fragment, useState, useEffect, useRef } from 'react';
import { IVHTable, Pagination, ConfirmPage } from 'components/common';
import { connect } from 'dva';
import { makeStyles, Link } from '@material-ui/core';
import _ from 'lodash';
import { isSuccess } from 'utils/helpers';
import msg from 'utils/messageCenter';
import {
  VideoDeviceHeader,
  DeleteHeader,
  // DeviceActionBar,
  BatchUpload,
  AddDevice
} from 'components/VMS/VideoDevice';
import { I18n } from 'react-i18nify';
import { PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      position: 'relative'
    }
  };
});

function VideoDevice(props) {
  const { dispatch, global, VMSVideoDevice } = props;
  const { deviceList, modelList, uploadTaskList, exportData, resetCount } = VMSVideoDevice;
  const { userId } = global;
  const classes = useStyles();
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [dataSource, setDataSource] = useState([]);
  const [pageNo, setPageNo] = useState(PAGE_NUMBER);
  const [PopBatchAdd, setPopBatchAdd] = useState(null);
  const [PopAddDevice, setPopAddDevice] = useState(null);
  const [itemStorage, setitemStorage] = useState(new Map());
  const [selectedStorage, setselectedStorage] = useState(new Set());
  const [itemData, setitemData] = useState(null);
  const [filterObj, setFilterObj] = useState({});
  const [confirmPageOpen, setconfirmPageOpen] = useState(false);
  const dataList = useRef(null);
  const toolBarCF = useRef();
  dataList.current = dataSource;

  const datafield =
    modelList &&
    modelList.map(x => {
      return [x.id, x.name];
    });

  useEffect(() => {
    getModel();
    getDeviceList({ pageNo, pageSize });
  }, []);

  useEffect(() => {
    setselectedStorage(new Set());
  }, [resetCount]);

  useEffect(() => {
    const data = _.cloneDeep(deviceList);
    setDataSource(data.items || []);
  }, [deviceList]);

  useEffect(() => {
    return () => {
      dispatch({
        type: `VMSVideoDevice/clearExportDataActionData`
      });
    };
  }, [exportData]);

  function getModel() {
    dispatch({
      type: 'VMSVideoDevice/getModelList',
      payload: { pageNo: PAGE_NUMBER, pageSize: 50 }
    });
  }

  const updatePage = item => () => {
    buttonAction('UpdateDevice');
    setitemData(item);
  };

  const columns = [
    {
      title: I18n.t('uvms.videoDevice.deviceName'),
      dataIndex: 'deviceName',
      renderItem: item => (
        <Link onClick={updatePage(item)}>
          <Typography color="secondary" component="span">
            {item.deviceName}
          </Typography>
        </Link>
      )
    },
    {
      title: I18n.t('uvms.videoDevice.uri'),
      dataIndex: 'deviceUri'
    },
    {
      title: I18n.t('uvms.videoDevice.deviceType'),
      dataIndex: 'deviceType'
    },
    {
      title: I18n.t('uvms.videoDevice.model'),
      dataIndex: 'modelName'
    },
    {
      title: I18n.t('uvms.videoDevice.channelCount'),
      dataIndex: 'channelCount'
    },
    {
      title: I18n.t('uvms.videoDevice.vmsStatus'),
      dataIndex: 'vmsStatus'
    }
  ];
  function getDeviceList(obj, _filterObj) {
    let payload = null;
    if (_filterObj) {
      payload = {
        ...obj,
        userId,
        ..._filterObj
      };
    } else {
      payload = {
        ...obj,
        userId,
        ...filterObj
      };
    }

    dispatch({
      type: 'VMSVideoDevice/getDeviceList',
      payload
    }).then(res => {
      if (!res) return;
      if (isSuccess(res)) {
        setPageNo(res.data.pageNo);
        setPageSize(res.data.pageSize);
      } else if (res) {
        msg.error(res.message, 'video device');
      }
    });
  }

  function refreshDeviceList() {
    getDeviceList({ pageNo, pageSize });
  }
  function getBatchUploadTaskList(obj) {
    const payload = {
      ...obj,
      createdId: userId
    };
    dispatch({
      type: 'VMSVideoDevice/getBatchUploadTaskList',
      payload
    });
  }

  const onChangePage = (e, pageNo) => {
    setPageNo(pageNo);
    getDeviceList({ pageSize, pageNo });
  };

  const onChangeRowsPerPage = e => {
    const { value } = e.target;
    setPageSize(value);
    setPageNo(PAGE_NUMBER);
    getDeviceList({ pageSize: value, pageNo: PAGE_NUMBER });
  };

  const createPop = type => {
    switch (type) {
      case 'BatchAdd':
        setPopBatchAdd(true);
        setPopAddDevice(false);
        break;
      case 'AddDevice':
        setPopBatchAdd(false);
        setPopAddDevice(true);
        break;
      default:
        break;
    }
  };

  const handleVideoDeviceSearch = obj => {
    setPageNo(PAGE_NUMBER);
    getDeviceList({ pageNo: PAGE_NUMBER, pageSize }, obj);
  };

  const popOnClose = (fn, value) => {
    return () => {
      fn(value);
    };
  };

  function handleRowSelection(item, event) {
    const { deviceId } = item;
    const { checked } = event.target;
    const data = _.cloneDeep(selectedStorage);
    if (checked) {
      data.add(deviceId);
      setitemStorage(itemStorage.set(deviceId, item));
    } else {
      data.delete(deviceId);
    }
    setselectedStorage(data);
  }

  function handleChooseAll(e) {
    const { checked } = e.target;
    const data = _.cloneDeep(selectedStorage);
    const list = dataList.current;
    if (checked) {
      list.forEach(x => {
        data.add(x.deviceId);
        itemStorage.set(x.deviceId, x);
      });
      setitemStorage(itemStorage);
      setselectedStorage(data);
    } else {
      list.forEach(x => {
        data.delete(x.deviceId);
      });
      setselectedStorage(data);
    }
  }

  const openConfirm = () => {
    setconfirmPageOpen(true);
  };

  const closeConfirm = () => {
    setconfirmPageOpen(false);
  };

  function handleDelete() {
    const deviceIds = [...selectedStorage];
    const deviceNames = [];
    selectedStorage.forEach(x => {
      deviceNames.push(itemStorage.get(x).deviceName);
    });
    setFilterObj({});
    closeConfirm();
    dispatch({
      type: 'VMSVideoDevice/batchDeleteDevice',
      payload: { deviceIds, deviceNames, userId }
    }).then(res => {
      if (!res) return;
      if (isSuccess(res)) {
        msg.success('Delete Device Success', 'Video Device');
        setPageNo(PAGE_NUMBER);
        getDeviceList({ pageNo: PAGE_NUMBER, pageSize });
        setselectedStorage(new Set());
      } else if (res) {
        msg.error(res.message, 'Video Device');
      }
    });
  }

  function infoSave(_obj) {
    // filterObj = {};
    setFilterObj({});
    const { payload, type, itemData } = _obj;
    if (type === 'update') {
      dispatch({
        type: 'VMSVideoDevice/updateDevice',
        payload: { ...payload, lastUpdatedId: userId },
        id: itemData.deviceId
      }).then(res => {
        if (!res) return;
        if (isSuccess(res)) {
          msg.success('Update Device Success', 'Video Device');
          setPopAddDevice(false);
          getDeviceList({ pageNo, pageSize });
        } else if (res) {
          msg.error(res.message, 'Video Device');
        }
      });
    } else if (type === 'add') {
      dispatch({
        type: 'VMSVideoDevice/addDevice',
        payload: { ...payload, createdId: userId }
      }).then(res => {
        if (!res) return;
        if (isSuccess(res)) {
          msg.success('Add Device Success', 'Video Device');
          // close dialog
          setPopAddDevice(false);
          toolBarCF.current.clean();
          // refresh list
          getDeviceList({ pageNo: PAGE_NUMBER, pageSize }, {});
          // reset pagenation
          setPageNo(PAGE_NUMBER);
          // setPageSize(PAGE_SIZE);
        } else if (res) {
          msg.error(res.message, 'Video Device');
        }
      });
    }
  }

  function fileUpload(obj) {
    dispatch({
      type: 'VMSVideoDevice/fileUpload',
      payload: { ...obj, createdId: userId }
    }).then(res => {
      if (!res) return;
      if (isSuccess(res)) {
        msg.success('Upload Devices Success', 'Video Device');
        getDeviceList({ pageNo: PAGE_NUMBER, pageSize });
        setPageNo(PAGE_NUMBER);
        getBatchUploadTaskList({ pageNo: PAGE_NUMBER, pageSize: PAGE_SIZE });
      } else if (res) {
        msg.error(res.message, 'Video Device');
      }
    });
  }

  function getToolBarRef(toolBarRef) {
    toolBarCF.current = toolBarRef;
  }

  function templateDownload() {
    dispatch({
      type: 'VMSVideoDevice/downloadTemplate'
    });
  }

  function taskListDownLoad(id) {
    dispatch({
      type: 'VMSVideoDevice/downloadFromTaskList',
      payload: { id }
    });
  }

  function buttonAction(type) {
    // const id = [...selectedStorage][0];
    // let itemData = null;
    // dataSource.forEach(x => {
    //   if (x.deviceId === id) {
    //     itemData = x;
    //   }
    // });
    switch (type) {
      case 'UpdateDevice':
        createPop('AddDevice');
        break;

      case 'AddDevice':
        setitemData(null);
        createPop('AddDevice');
        break;
      default:
        break;
    }
  }

  const rowSelection = {
    onChange: handleRowSelection,
    selectedRowKeys: [...selectedStorage]
  };
  return (
    <Fragment>
      <div className={classes.wrapper}>
        {[...selectedStorage].length > 0 && (
          <DeleteHeader
            handleDelete={openConfirm}
            numSelected={[...selectedStorage]}
            iconInfo={{
              icon: 'delete',
              label: 'Delete Alarm'
            }}
          />
        )}
        <VideoDeviceHeader
          onClickSearch={obj => {
            setFilterObj(obj);
            handleVideoDeviceSearch(obj);
          }}
          onClickAddDevice={() => {
            buttonAction('AddDevice');
          }}
          onClickBatchAdd={() => {
            createPop('BatchAdd');
          }}
          datafield={datafield}
          getToolBarRef={getToolBarRef}
        />
      </div>
      {/* {[...selectedStorage].length === 1 && <DeviceActionBar buttonAction={buttonAction} />} */}
      <IVHTable
        tableMaxHeight="calc(100% - 190px)"
        handleChooseAll={handleChooseAll}
        rowSelection={rowSelection}
        keyId="deviceId"
        columns={columns}
        dataSource={dataSource || []}
      />
      <Pagination
        page={pageNo}
        rowsPerPage={pageSize}
        count={deviceList.totalNum || 0}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
      />
      {PopAddDevice && (
        <AddDevice
          openDialog={PopAddDevice}
          onClose={popOnClose(setPopAddDevice, false)}
          itemData={itemData}
          modelList={modelList}
          infoSave={infoSave}
        />
      )}
      {PopBatchAdd && (
        <BatchUpload
          onClose={popOnClose(setPopBatchAdd, false)}
          getTaskList={getBatchUploadTaskList}
          taskListDatasource={uploadTaskList}
          fileUpload={fileUpload}
          templateDownload={templateDownload}
          taskListDownLoad={taskListDownLoad}
          exportData={exportData}
          refreshDeviceList={refreshDeviceList}
        />
      )}
      <ConfirmPage
        message={I18n.t('uvms.videoDevice.deleteDeviceConfirm')}
        messageTitle={I18n.t('uvms.videoDevice.deleteDevice')}
        isConfirmPageOpen={confirmPageOpen}
        hanldeConfirmMessage={handleDelete}
        handleConfirmPageClose={closeConfirm}
      />
    </Fragment>
  );
}

export default connect(({ VMSVideoDevice, global }) => ({
  VMSVideoDevice,
  global
}))(VideoDevice);
