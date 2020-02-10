import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  RecordingHeader,
  ChannelDetail,
  DownloadData,
  ViewTask,
  FileUpload
} from 'components/VMS/Recording';
import { IVHTable, Pagination, Download, Button } from 'components/common';
import { PAGE_NUMBER, PAGE_SIZE, DATE_FORMAT } from 'commons/constants/const';
import { makeStyles, Link } from '@material-ui/core';
import { isSuccess } from 'utils/helpers';
import msgCenter from 'utils/messageCenter';
import moment from 'moment';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(() => {
  return {
    button: {
      marginLeft: '4px'
    }
  };
});

// const dateTimeTypeForTextField = _time => {
//   const time = _time || new Date();
//   return moment(time).format('YYYY-MM-DDTHH:mm');
// };
let lastSearchParams = {};
function Recording(props) {
  // const moduleName = 'recordingManagement';
  const { dispatch, global, VMSRecording } = props;
  const {
    channelDataSource,
    recordingDataSource,
    downloadDataSource,
    taskList,
    exportData
  } = VMSRecording;
  const { userId } = global;
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [pageNo, setPageNo] = useState(PAGE_NUMBER);
  const [PopChannel, setPopChannel] = useState(null);
  const [PopDownloadData, setPopDownloadData] = useState(null);
  const [PopViewTask, setPopViewTask] = useState(null);
  const [PopUpload, setPopUpload] = useState(null);
  const [OpCtx, setOpCtx] = useState(null);
  // show download btn aft filter recordList succ
  const [flagFilterSucc, setflagFilterSucc] = useState(PAGE_SIZE);

  const classes = useStyles();
  useEffect(() => {
    getChannelList({ pageNo, pageSize });
    getDownloadData({
      psize: 5,
      pindex: 0,
      start: '',
      status: '',
      streamId: '',
      end: '',
      deviceId: '',
      channelId: ''
    });
  }, []);

  useEffect(() => {
    return () => {
      dispatch({
        type: `VMSRecording/clearExportDataActionData`
      });
    };
  }, [exportData]);

  const columns = [
    {
      title: 'Channel Name',
      dataIndex: 'channelName',
      renderItem: item => (
        <Link
          onClick={() => {
            setOpCtx(item);
            createPop('channel');
          }}
        >
          <Typography color="secondary" component="span">
            {item.channelName}
          </Typography>
        </Link>
      )
    },
    {
      title: 'Parent Devices',
      dataIndex: 'parentDevice'
    },
    {
      title: 'Group',
      dataIndex: 'groupName'
    }
  ];

  function getTaskList(obj) {
    const payload = [...obj];
    dispatch({
      type: 'VMSRecording/getTaskList',
      payload
    });
  }
  function getChannelList(obj) {
    const payload = {
      ...obj,
      userId
    };
    dispatch({
      type: 'VMSRecording/getChannel',
      payload
    });
    // setSearchParameters(obj);
  }

  function getDownloadData(obj) {
    const payload = {
      ...obj,
      userId,
      descriptionFields: {
        'User Id': userId
      }
    };
    dispatch({
      type: 'VMSRecording/getDownloadData',
      payload
    });
  }

  function fileUpload(obj) {
    const payload = {
      ...obj,
      userId,
      descriptionFields: JSON.stringify({
        'User Id': userId
      })
    };
    dispatch({
      type: 'VMSRecording/fileUpload',
      payload
    }).then(() => {
      setPopUpload(false);
    });
  }

  function handleHistorySearch(obj) {
    // setSearchParameters(obj);
    setPageNo(PAGE_NUMBER);
    lastSearchParams = obj;
    getChannelList({ ...obj, pageNo: PAGE_NUMBER, pageSize });
  }

  function onChangePage(e, page) {
    setPageNo(page);
    getChannelList({ pageSize, pageNo: page, ...lastSearchParams });
  }

  function onChangeRowsPerPage(e) {
    const { value } = e.target;
    setPageSize(value);
    setPageNo(PAGE_NUMBER);
    getChannelList({ pageSize: value, pageNo: PAGE_NUMBER, ...lastSearchParams });
  }

  const createPop = type => {
    switch (type) {
      case 'viewTask':
        setPopViewTask(true);
        setPopChannel(false);
        setPopDownloadData(false);
        setPopUpload(false);
        break;
      case 'downloadData':
        setPopViewTask(false);
        setPopChannel(false);
        setPopDownloadData(true);
        setPopUpload(false);
        break;

      case 'channel':
        setPopViewTask(false);
        setPopChannel(true);
        setPopDownloadData(false);
        setPopUpload(false);
        setflagFilterSucc(false);
        break;
      case 'upload':
        setPopViewTask(false);
        setPopChannel(false);
        setPopDownloadData(false);
        setPopUpload(true);
        break;
      default:
        break;
    }
  };

  const exportRecording = obj => {
    const payload = {
      ...obj
    };
    dispatch({
      type: 'VMSRecording/exportRecording',
      payload
    }).then(res => {
      if (!res) return;
      if (isSuccess(res)) {
        dispatch({
          type: 'messageCenter/addProgressBar',
          payload: {
            deviceName: obj.descriptionFields['Channel Name'],
            msg: 'Recording Download In Progress..',
            clippingId: res.data.id,
            start: moment(obj.start).format(DATE_FORMAT),
            end: moment(obj.end).format(DATE_FORMAT)
          }
        });
      } else if (res) {
        msgCenter.error(res.message, 'Recording');
      }
    });
  };

  const viewTaskDelete = (obj, getTaskList) => {
    const payload = {
      ...obj
    };
    dispatch({
      type: 'VMSRecording/viewTaskDelete',
      payload,
      getTaskList
    });
  };

  const downloadRecording = obj => {
    const payload = {
      ...obj
    };
    dispatch({
      type: 'VMSRecording/downloadRecording',
      payload
    });
  };

  const getRecords = obj => {
    dispatch({
      type: 'VMSRecording/getRecords',
      payload: {
        ...obj,
        userId
      }
    }).then(res => {
      if (!res) return;
      if (isSuccess(res) && obj.start && obj.end) {
        setflagFilterSucc(true);
      }
    });
  };

  const popOnClose = (fn, value) => {
    return () => {
      fn(value);
    };
  };

  const ExtraCell = item => {
    const virtual = item.modelId === 'virtual' || item.modelId === 'Virtual';
    return (
      <Fragment>
        <Button
          variant="text"
          size="small"
          color="primary"
          className={classes.button}
          onClick={() => {
            setOpCtx(item);
            createPop('upload');
          }}
          disabled={!virtual}
        >
          Upload
        </Button>
      </Fragment>
    );
  };

  const extraCell = {
    columns: [
      {
        title: 'Operation',
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

  return (
    <Fragment>
      <RecordingHeader
        onClickSearch={obj => handleHistorySearch(obj)}
        onClickViewTask={() => {
          createPop('viewTask');
        }}
        onClickDownloadData={() => {
          createPop('downloadData');
        }}
      />
      <IVHTable
        tableMaxHeight="calc(100% - 190px)"
        extraCell={extraCell}
        keyId="channelId"
        columns={columns}
        dataSource={channelDataSource.items || []}
      />
      <Pagination
        page={pageNo}
        rowsPerPage={pageSize}
        count={channelDataSource.totalNum || 0}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
      />
      {PopChannel && (
        <ChannelDetail
          onClose={popOnClose(setPopChannel, false)}
          getRecords={getRecords}
          exportRecording={exportRecording}
          dataSource={recordingDataSource}
          itemData={OpCtx}
          userId={userId}
          flagFilterSucc={flagFilterSucc}
        />
      )}
      {PopDownloadData && (
        <DownloadData
          onClose={popOnClose(setPopDownloadData, false)}
          dataSource={downloadDataSource}
          getDownloadData={getDownloadData}
        />
      )}
      {PopViewTask && (
        <ViewTask
          onClose={popOnClose(setPopViewTask, false)}
          getTaskList={getTaskList}
          downloadRecording={downloadRecording}
          dataSource={taskList || []}
          channelList={channelDataSource.items || []}
          userId={userId}
          viewTaskDelete={viewTaskDelete}
        />
      )}
      {PopUpload && (
        <FileUpload
          onClose={popOnClose(setPopUpload, false)}
          fileUpload={fileUpload}
          itemData={OpCtx}
        />
      )}
      <Download exportData={exportData} />
    </Fragment>
  );
}

export default connect(({ VMSRecording, global }) => ({ VMSRecording, global }))(Recording);
