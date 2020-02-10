import React, { Fragment, useState, useEffect, useRef } from 'react';
import { makeStyles, Link } from '@material-ui/core';
import { connect } from 'dva';
import {
  FirmwareHeader,
  CreateOrUpdate,
  UploadFirmwareTask,
  FirmwareUpgrade,
  DeleteHeader
} from 'components/VMS/Firmware';
import _ from 'lodash';
import { isSuccess } from 'utils/helpers';
import msg from 'utils/messageCenter';
import { IVHTable, Pagination, Button, ConfirmPage } from 'components/common';
import { PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
import { I18n } from 'react-i18nify';

const useStyles = makeStyles(() => {
  return {
    button: {
      marginLeft: '4px'
    },
    wrapper: {
      position: 'relative'
    }
  };
});
let searchParameters = {};
function Firmware(props) {
  const classes = useStyles();
  const { dispatch, global, VMSFirmware } = props;
  const {
    firmwareDataSource,
    modelList,
    upgradeList,
    firmwareUpgradeDeviceList,
    selectedDeviceArray
  } = VMSFirmware;
  const { userId } = global;
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [pageNo, setPageNo] = useState(PAGE_NUMBER);
  const [popUpload, setPopUpload] = useState(null);
  const [uploadFirmwareTask, setuploadFirmwareTask] = useState(null);
  const [firmwareUpgrade, setfirmwareUpgrade] = useState(null);
  const [itemStorage, setitemStorage] = useState(new Map());
  const [selectedStorage, setselectedStorage] = useState(new Set());
  const [dataSource, setDataSource] = useState([]);
  // update target item info
  const [perItemData, setperItemData] = useState(null);
  const [upgradeDList, setupgradeDList] = useState([]);
  const [confirmPageOpen, setconfirmPageOpen] = useState(false);
  const dataList = useRef(null);
  dataList.current = dataSource;
  const toolBarCF = useRef();

  const datafield =
    modelList &&
    modelList.map(x => {
      return [x.id, x.name];
    });

  useEffect(() => {
    dispatch({
      type: 'VMSFirmware/getModelList',
      payload: { pageNo: 0, pageSize: 50 }
    });
    getFirmwareList({ pageNo, pageSize });
  }, []);

  useEffect(() => {
    const data = _.cloneDeep(firmwareDataSource.items);
    setDataSource(data || []);
  }, [firmwareDataSource]);

  useEffect(() => {
    if (firmwareUpgradeDeviceList) {
      setupgradeDList(firmwareUpgradeDeviceList);
    }
  }, [firmwareUpgradeDeviceList]);

  const columns = [
    {
      title: 'Firmware Name',
      dataIndex: 'firmwareName',
      renderItem: item => (
        <Link
          onClick={() => {
            createPop('popUpload', item);
          }}
        >
          {item.firmwareName}
        </Link>
      )
    },
    {
      title: 'Firmware Version',
      dataIndex: 'firmwareVersion'
    },
    {
      title: 'Model',
      dataIndex: 'firmwareModelName'
    },
    {
      title: 'Comments',
      dataIndex: 'description'
    }
  ];
  const ExtraCell = item => {
    return (
      <Fragment>
        <Button
          variant="text"
          size="small"
          color="primary"
          className={classes.button}
          onClick={() => {
            createPop('firmwareUpgrade', { item, type: 'Schedule' });
          }}
        >
          Schedule
        </Button>
        <Button
          variant="text"
          size="small"
          color="primary"
          className={classes.button}
          onClick={() => {
            createPop('firmwareUpgrade', { item, type: 'Immediate' });
          }}
        >
          Immediate
        </Button>
      </Fragment>
    );
  };

  const extraCell = {
    columns: [
      {
        title: 'Upgrade',
        dataIndex: ''
      }
    ],
    components: [
      {
        component: ExtraCell,
        key: '12'
      }
    ]
  };
  const openConfirm = () => {
    setconfirmPageOpen(true);
  };

  const closeConfirm = () => {
    setconfirmPageOpen(false);
  };
  function viewUpgradeTaskhandleDelete(payload, getListPayload) {
    dispatch({
      type: 'VMSFirmware/deleteSchedule',
      payload,
      getListPayload
    });
  }

  function getFirmwareList(obj) {
    const payload = {
      ...obj,
      userId
    };
    dispatch({
      type: 'VMSFirmware/getFirmwareList',
      payload
    });
  }

  function getUpgradeList(obj) {
    const payload = {
      ...obj
    };
    dispatch({
      type: 'VMSFirmware/getUpgradeList',
      payload
    });
  }

  function getSelectedDeviceArray(obj) {
    const payload = {
      ...obj,
      userId
    };
    dispatch({
      type: 'VMSFirmware/getSelectedDeviceArray',
      payload
    });
  }

  function handleHistorySearch(obj) {
    searchParameters = obj;
    getFirmwareList({ ...obj, pageNo: 0, pageSize });
  }

  function onChangePage(e, page) {
    setPageNo(page);
    getFirmwareList({ ...searchParameters, pageSize, pageNo: page });
  }

  function onChangeRowsPerPage(e) {
    const { value } = e.target;
    setPageSize(value);
    setPageNo(PAGE_NUMBER);
    getFirmwareList({ ...searchParameters, pageSize: value, pageNo: PAGE_NUMBER });
  }

  function getToolBarRef(toolBarRef) {
    toolBarCF.current = toolBarRef;
  }

  const createPop = (type, optionValue) => {
    switch (type) {
      case 'firmwareUpgrade':
        setperItemData(optionValue);
        setfirmwareUpgrade(true);
        break;
      case 'uploadFirmwareTask':
        setuploadFirmwareTask(true);
        break;
      case 'popUpload':
        if (optionValue) {
          setperItemData(optionValue);
        } else {
          setperItemData(null);
        }
        setPopUpload(true);
        break;
      default:
        break;
    }
  };

  const popOnClose = (fn, value) => {
    return () => {
      fn(value);
    };
  };

  function handleDelete() {
    closeConfirm();
    setselectedStorage(new Set());
    dispatch({
      type: 'VMSFirmware/delFirmware',
      payload: { id: [...selectedStorage], userId, psize: 50 }
    }).then(res => {
      if (!res) return;
      if (isSuccess(res)) {
        msg.success('Delete Firmware Success', 'Firmware');
        setPageNo(PAGE_NUMBER);
        getFirmwareList({ pageNo: PAGE_NUMBER, pageSize, ...searchParameters });
      } else if (res) {
        msg.error(res.message, 'Firmware');
      }
    });
  }

  function firmwareUpgradeRequest(obj) {
    dispatch({
      type: 'VMSFirmware/firmwareUpgradeRequest',
      payload: {
        ...obj,
        userId
      }
    }).then(res => {
      if (!res) return;
      if (isSuccess(res)) {
        msg.success(res.message, 'Firmware');
        setfirmwareUpgrade(false);
        getFirmwareList({ pageNo, pageSize });
      } else if (res) {
        msg.error(res.message, 'Firmware');
      }
    });
  }

  function handleRowSelection(item, event) {
    const { firmwareId } = item;
    const { checked } = event.target;
    const data = _.cloneDeep(selectedStorage);
    if (checked) {
      setselectedStorage(data.add(firmwareId));
      setitemStorage(itemStorage.set(firmwareId, item));
    } else {
      data.delete(firmwareId);
      setselectedStorage(data);
    }
  }

  function firmwareUpdate(obj) {
    dispatch({
      type: 'VMSFirmware/updateFirmware',
      payload: {
        ...obj
      }
    }).then(res => {
      if (!res) return;
      if (isSuccess(res)) {
        msg.success('Update Firmware Success', 'Firmware');
        setPopUpload(false);
        getFirmwareList({ pageNo, pageSize });
      } else if (res) {
        msg.error(res.message, 'Firmware');
      }
    });
  }

  function getFirmwareUpgradeDeviceList(obj) {
    const payload = {
      ...obj,
      userId
    };
    dispatch({
      type: 'VMSFirmware/getFirmwareUpgradeDeviceList',
      payload
    });
  }
  function fileUpload(obj) {
    dispatch({
      type: 'VMSFirmware/uploadFirmware',
      payload: { ...obj }
    }).then(res => {
      if (!res) return;
      if (isSuccess(res)) {
        msg.success('Upload File Success', 'Firmware');
        setPopUpload(false);
        toolBarCF.current.clean();
        setPageNo(PAGE_NUMBER);
        getFirmwareList({ pageNo: PAGE_NUMBER, pageSize });
      } else if (res) {
        msg.error(res.message, 'Firmware');
      }
    });
  }

  function cleanData() {
    setupgradeDList([]);
  }

  function handleChooseAll(e) {
    const { checked } = e.target;
    const data = _.cloneDeep(selectedStorage);
    const list = dataList.current;
    if (checked) {
      list.forEach(x => {
        data.add(x.firmwareId);
        itemStorage.set(x.firmwareId, x);
      });
      setitemStorage(itemStorage);
      setselectedStorage(data);
    } else {
      list.forEach(x => {
        data.delete(x.firmwareId);
      });
      setselectedStorage(data);
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
              label: 'Delete Firmware'
            }}
          />
        )}
        <FirmwareHeader
          onClickSearch={obj => handleHistorySearch(obj)}
          onClickUploadFirmwareFile={() => {
            createPop('popUpload');
          }}
          onClickUploadFirmwareTask={() => {
            createPop('uploadFirmwareTask');
          }}
          datafield={datafield}
          getToolBarRef={getToolBarRef}
        />
      </div>

      <IVHTable
        tableMaxHeight="calc(100% - 190px)"
        handleChooseAll={handleChooseAll}
        rowSelection={rowSelection}
        extraCell={extraCell}
        keyId="firmwareId"
        columns={columns}
        dataSource={dataSource || []}
      />
      <Pagination
        page={pageNo}
        rowsPerPage={pageSize}
        count={firmwareDataSource.totalNum || 0}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
      />
      {popUpload && (
        <CreateOrUpdate
          openDialog={popUpload}
          onClose={popOnClose(setPopUpload, false)}
          modelList={modelList}
          handleSubmitFile={fileUpload}
          perItemData={perItemData}
          handleUpdateFirmware={firmwareUpdate}
        />
      )}
      {uploadFirmwareTask && (
        <UploadFirmwareTask
          onClose={popOnClose(setuploadFirmwareTask, false)}
          dataSource={upgradeList || []}
          getUpgradeList={getUpgradeList}
          DeleteHeader={DeleteHeader}
          viewUpgradeTaskhandleDelete={viewUpgradeTaskhandleDelete}
        />
      )}
      {firmwareUpgrade && (
        <FirmwareUpgrade
          onClose={popOnClose(setfirmwareUpgrade, false)}
          upgradeContent={perItemData}
          getFirmwareUpgradeDeviceList={getFirmwareUpgradeDeviceList}
          getSelectedDeviceArray={getSelectedDeviceArray}
          selectedDeviceArray={selectedDeviceArray}
          dataSource={upgradeDList}
          cleanData={cleanData}
          firmwareUpgrade={firmwareUpgradeRequest}
        />
      )}
      <ConfirmPage
        message={I18n.t('uvms.firmware.deleteFirmwareConfirm')}
        messageTitle={I18n.t('uvms.firmware.deleteFirmware')}
        isConfirmPageOpen={confirmPageOpen}
        hanldeConfirmMessage={handleDelete}
        handleConfirmPageClose={closeConfirm}
      />
    </Fragment>
  );
}

export default connect(({ VMSFirmware, global }) => ({ VMSFirmware, global }))(Firmware);
