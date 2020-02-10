import React from 'react'; // , { useCallback }
import { makeStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
import FolderOpen from '@material-ui/icons/FolderOpen';
import {
  Input,
  ToolTip,
  IVHTable,
  Pagination,
  Download,
  Button,
  DialogTitle
} from 'components/common';
import CloudDownload from '@material-ui/icons/CloudDownload';
import Toc from '@material-ui/icons/Toc';
import SaveAlt from '@material-ui/icons/SaveAlt';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import { VALIDMSG_NOTNULL } from 'commons/constants/commonConstant';
import { I18n } from 'react-i18nify';

const useStyles = makeStyles(theme => {
  return {
    dialogTitle: {
      padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`
    },
    titleLayout: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: theme.palette.primary.main
    },
    dateTimePicker: {
      width: '230px',
      float: 'left',
      marginLeft: theme.spacing(1)
    },
    textField: {
      width: '100%'
    },
    buttonGroup: {
      height: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      margin: '-6px 0',
      float: 'right'
    }
  };
});

function BatchUpload(props) {
  const {
    onClose,
    fileUpload,
    templateDownload,
    taskListDatasource,
    getTaskList,
    taskListDownLoad,
    exportData,
    refreshDeviceList
  } = props;
  const classes = useStyles();
  const [pageNo, setPageNo] = React.useState(PAGE_NUMBER);
  const [pageSize, setPageSize] = React.useState(PAGE_SIZE);
  const [open, setOpen] = React.useState(false);
  const [file, setfile] = React.useState('');
  const [errState, setErrState] = React.useState(false);
  // const [uploadFile, setuploadFile] = React.useState(null);
  const [mode, setmode] = React.useState('batchUpload');
  // const [uploadTime, setuploadTime] = React.useState(moment());
  // change to 'taskList' mode aft batch upload
  const [flagAftUpload, setFlagAftUpload] = React.useState(false);

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    refreshDeviceList();
    onClose();
  }

  // const getUploadTaskList = useCallback(
  //   _obj => {
  //     const playload = _obj.pageNo && _obj.pageSize ? _obj : { pageNo, pageSize };
  //     getTaskList(playload);
  //   },
  //   [pageNo, pageSize, getTaskList]
  // );
  function getUploadTaskList(_obj) {
    const playload = _obj.pageNo && _obj.pageSize ? _obj : { pageNo, pageSize };
    getTaskList(playload);
  }

  function onUpload() {
    if (!file) {
      setErrState(true);
      return;
    }
    const obj = {
      file
    };
    fileUpload(obj);
    setFlagAftUpload(true);
  }
  React.useEffect(() => {
    if (flagAftUpload) {
      setFlagAftUpload(false);
      setmode('taskList');
      setfile('');
    }
  }, [taskListDatasource, flagAftUpload]);

  React.useEffect(() => {
    handleClickOpen();
  }, []);

  React.useEffect(() => {
    if (mode === 'taskList') {
      getUploadTaskList({ pageNo, pageSize });
    }
  }, [mode, pageNo, pageSize]);

  // const handleChange = event => {
  //   setValues(event.target.value);
  // };

  const handleUploadChange = e => {
    const { files } = e.target;
    setfile(files[0]);
  };

  function onChangePage(e, page) {
    setPageNo(page);
    getUploadTaskList({ pageNo: page });
  }

  function onChangeRowsPerPage(e) {
    const { value } = e.target;
    setPageSize(value);
    getUploadTaskList({ pageSize: value });
  }

  function downloadInTaskList(id) {
    taskListDownLoad(id);
  }

  const ExtraCell = item => {
    const id = item.resultFileUuid;
    return (
      <SaveAlt
        onClick={() => {
          downloadInTaskList(id);
        }}
      />
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

  const columns = [
    {
      title: 'File Name',
      dataIndex: 'fileName'
    },
    {
      title: 'Success Number',
      dataIndex: 'successNo'
    },
    {
      title: 'Fail Number',
      dataIndex: 'failNo'
    },
    {
      title: 'Create Date',
      dataIndex: 'createdDate'
    },
    {
      title: 'Task Status',
      dataIndex: 'taskStatus'
    },
    {
      title: 'Download Status',
      dataIndex: 'downloadStatus',
      render: text => {
        if (text === 'N') {
          return 'No';
        } else if (text === 'Y') {
          return 'Yes';
        } else {
          return 'N/A';
        }
      }
    }
  ];

  const dialogRender = () => {
    if (mode === 'batchUpload') {
      return (
        <>
          <Dialog open={open} maxWidth="sm" fullWidth>
            <DialogTitle>
              Batch Upload
              <div className={classes.buttonGroup}>
                <ToolTip title="Download Template">
                  <IconButton onClick={templateDownload}>
                    <CloudDownload />
                  </IconButton>
                </ToolTip>
                <ToolTip title="Task List">
                  <IconButton
                    onClick={() => {
                      setmode('taskList');
                      setErrState(false);
                    }}
                  >
                    <Toc />
                  </IconButton>
                </ToolTip>
              </div>
            </DialogTitle>
            <DialogContent>
              <FormControl error={errState} fullWidth>
                <InputLabel>Choose Files</InputLabel>
                <Input
                  placeholder="Choose Files"
                  value={!file ? '' : file.name}
                  onClick={() => {
                    setErrState(false);
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton aria-label="Choose Files">
                        <label htmlFor="contained-button-file">
                          <FolderOpen />
                        </label>
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <input
                  style={{ display: 'none' }}
                  id="contained-button-file"
                  multiple
                  onChange={handleUploadChange}
                  type="file"
                />
                <FormHelperText>{errState ? VALIDMSG_NOTNULL : ''}</FormHelperText>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={onUpload} color="primary">
                {I18n.t('global.button.save')}
              </Button>
              <Button onClick={handleClose} color="primary">
                {I18n.t('global.button.cancel')}
              </Button>
            </DialogActions>
          </Dialog>
          <Download exportData={exportData} />
        </>
      );
    } else if (mode === 'taskList') {
      return (
        <>
          <Dialog open={open} maxWidth="lg" fullWidth>
            <DialogTitle>
              Task List
              <div className={classes.buttonGroup}>
                <ToolTip title="Batch Upload">
                  <IconButton
                    onClick={() => {
                      setmode('batchUpload');
                    }}
                  >
                    <Toc />
                  </IconButton>
                </ToolTip>
              </div>
            </DialogTitle>
            <DialogContent>
              <IVHTable
                extraCell={extraCell}
                columns={columns}
                dataSource={taskListDatasource.items}
                keyId="resultFileUuid"
              />
              <Pagination
                count={taskListDatasource.totalNum || 0}
                page={pageNo}
                rowsPerPage={pageSize}
                onChangePage={onChangePage}
                onChangeRowsPerPage={onChangeRowsPerPage}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={getUploadTaskList} color="primary">
                {I18n.t('global.button.refresh')}
              </Button>
              <Button onClick={handleClose} color="primary">
                {I18n.t('global.button.cancel')}
              </Button>
            </DialogActions>
          </Dialog>
          <Download exportData={exportData} />
        </>
      );
    }
  };

  return dialogRender();
}

export default BatchUpload;
