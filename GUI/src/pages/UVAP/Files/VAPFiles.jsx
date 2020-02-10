import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { I18n } from 'react-i18nify';
import moment from 'moment';
import { PAGE_NUMBER, PAGE_SIZE, DATE_FORMAT } from 'commons/constants/const';
import {
  Pagination,
  IVHTable,
  ConfirmPage,
  TableToolbar,
  Download,
  Permission
} from 'components/common';
import { OperationTableMenu, VapFilesEditFileDialog } from 'components/UVAP';
import IconButton from '@material-ui/core/IconButton';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import { dataUpdatedHandle } from 'utils/helpers';
import { VIDEO_TYPE } from 'commons/constants/commonConstant';
import Tooltip from '@material-ui/core/Tooltip';
import materialKeys from 'utils/materialKeys';
import styles from './VAPFiles.module.less';

function VAPFiles(props) {
  const { dispatch, global, vapFiles } = props;
  const { userId } = global;
  const moduleName = vapFiles.namespace;
  const { fileList, fileDetails, fileBlob } = vapFiles || {};

  // data init
  const [searchParameters, setSearchParameters] = useState({
    name: '',
    mimetype: '',
    pageNo: PAGE_NUMBER,
    pageSize: PAGE_SIZE
  });
  const [mainFileList, setMainFileList] = useState([]);
  const [fileData, setFileData] = useState(fileDetails);
  const [editDialogStatus, setEditDialogStatus] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMsg, setConfirmMsg] = useState('');
  const [confirmType, setConfirmType] = useState('');
  const [editOpenType, setEditOpenType] = useState('');
  const [isDownload, setIsDownload] = useState(false);

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
    },
    {
      title: I18n.t('vap.table.files.length'),
      dataIndex: 'length',
      render: text => <span>{`${_.floor(text / 1024 / 1024, 2)} MB`}</span>
    },
    {
      title: I18n.t('vap.table.common.createdTime'),
      dataIndex: 'time',
      render: text => <span>{moment(text).format(DATE_FORMAT)}</span>
    }
  ];

  // table operation menu setting
  const opertayionMenu = {
    tipName: I18n.t('vap.table.common.operationMenu.tipName'),
    titleName: I18n.t('vap.table.common.operationMenu.name'),
    icon: 'MoreVert',
    items: [
      {
        icon: 'Tune',
        title: I18n.t('vap.table.files.operationMenu.update'),
        materialKey: materialKeys['M4-34'],
        action: 'update'
      },
      {
        icon: 'CloudDownload',
        title: I18n.t('vap.table.files.operationMenu.download'),
        materialKey: materialKeys['M4-150'],
        action: 'download'
      },
      {
        icon: 'Delete',
        title: I18n.t('vap.table.files.operationMenu.delete'),
        materialKey: materialKeys['M4-151'],
        action: 'delete'
      }
    ]
  };

  function handleActions(target, data) {
    switch (target) {
      case 'update':
        setFileData({});
        getFileDetailsFunc({ id: data.id });
        setEditOpenType('update');
        setEditDialogStatus(true);
        break;
      case 'download':
        setIsDownload(true);
        handleDownloadFileFunc({ id: data.id });
        break;
      case 'delete':
        setConfirmTitle(I18n.t('vap.confirm.files.deleteTitle'));
        setConfirmMsg(I18n.t('vap.confirm.files.deleteMsg'));
        setConfirmType('delete');
        setConfirmDialog(true);
        setFileData(data);
        break;
      default:
        break;
    }
  }

  const ExtraCell = item => {
    const { id: fileId } = item;
    return (
      <Fragment>
        <OperationTableMenu
          columns={opertayionMenu}
          key={fileId}
          itemId={fileId}
          currentData={item}
          getActionData={handleActions}
        />
      </Fragment>
    );
  };

  const extraCell = {
    columns: [
      {
        title: I18n.t('vap.table.common.operation'),
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

  // confirm page action setting
  function confirmActions() {
    switch (confirmType) {
      case 'delete':
        handleDeleteFileFunc();
        setConfirmDialog(false);
        setConfirmType('');
        break;
      default:
        break;
    }
  }

  // func init
  const getFilesListFunc = useCallback(
    (obj = {}) => {
      dispatch({
        type: `${moduleName}/getFilesList`,
        payload: {
          userId,
          ...obj
        }
      });
    },
    [dispatch, moduleName, userId]
  );
  function getFileDetailsFunc(obj = {}) {
    dispatch({
      type: `${moduleName}/getFileDetails`,
      payload: {
        userId,
        ...obj
      }
    });
  }
  function openEditDialog() {
    setEditDialogStatus(true);
    setFileData({});
    setEditOpenType('create');
  }
  function onChangePage(e, page) {
    searchParameters.pageNo = page;
    setSearchParameters(searchParameters);
    getFilesListFunc(searchParameters);
  }
  function onChangeRowsPerPage(e) {
    const { value } = e.target;
    searchParameters.pageSize = value;
    setSearchParameters(searchParameters);
    getFilesListFunc(searchParameters);
  }
  function updateSearchParameters(param = {}) {
    const newParam = param;
    newParam.pageNo = searchParameters.pageNo;
    newParam.pageSize = searchParameters.pageSize;
    setSearchParameters(_.cloneDeep(newParam));
    // sgetFilesListFunc(newParam);
  }
  function handleSaveFileDetails(payload) {
    if (editOpenType === 'update') {
      dispatch({
        type: `${moduleName}/updateFileDetails`,
        payload: {
          userId,
          ...payload
        }
      }).then(res => {
        dataUpdatedHandle(res, I18n.t('vap.dialog.files.updateTitle'), () => {
          setEditDialogStatus(false);
          getFilesListFunc(searchParameters);
        });
      });
    } else if (editOpenType === 'create') {
      // dispatch({
      //   type: `${moduleName}/uploadFile`,
      //   payload: {
      //     userId,
      //     ...payload
      //   }
      // }).then(res => {
      // dataUpdatedHandle(res, I18n.t('vap.dialog.files.createTitle'), () => {
      //   setEditDialogStatus(false);
      //   getFilesListFunc(searchParameters);
      // });
      // });
      setEditDialogStatus(false);
      getFilesListFunc(searchParameters);
    }
  }
  function handleDeleteFileFunc() {
    dispatch({
      type: `${moduleName}/deleteFile`,
      payload: {
        userId,
        id: fileData.id
      }
    }).then(res => {
      dataUpdatedHandle(res, confirmTitle, () => {
        getFilesListFunc(searchParameters);
      });
    });
  }
  function handleDownloadFileFunc(obj = {}) {
    dispatch({
      type: `${moduleName}/downloadFile`,
      payload: {
        userId,
        ...obj
      }
    });
  }

  // get main page data
  useEffect(() => {
    getFilesListFunc(searchParameters);
  }, [getFilesListFunc, searchParameters]);

  // init main page data
  useEffect(() => {
    setMainFileList(fileList.items || []);
  }, [fileList]);

  useEffect(() => {
    setFileData(fileDetails || {});
  }, [fileDetails]);

  useEffect(() => {
    setFileData({});
  }, [editDialogStatus]);

  const resetVapFileState = useCallback(() => {
    dispatch({
      type: `${moduleName}/resetVapFileState`
    });
  }, [dispatch, moduleName]);

  useEffect(() => {
    resetVapFileState();
  }, [resetVapFileState]);

  return (
    <Fragment>
      {!_.isEmpty(fileBlob) && isDownload && <Download exportData={fileBlob} />}
      {confirmDialog && (
        <ConfirmPage
          messageTitle={confirmTitle}
          message={confirmMsg}
          isConfirmPageOpen={confirmDialog}
          hanldeConfirmMessage={confirmActions}
          handleConfirmPageClose={() => setConfirmDialog(false)}
        />
      )}

      {editDialogStatus && (
        <VapFilesEditFileDialog
          open={editDialogStatus}
          onClose={() => setEditDialogStatus(false)}
          onSave={handleSaveFileDetails}
          fileData={fileData}
          // loading={
          //   loading.effects[`${moduleName}/getFileDetails`] ||
          //   loading.effects[`${moduleName}/updateFileDetails`] ||
          //   loading.effects[`${moduleName}/uploadFile`]
          // }
          userId={userId}
          editOpenType={editOpenType}
        />
      )}
      <Permission materialKey={materialKeys['M4-152']}>
        <TableToolbar
          handleGetDataByPage={updateSearchParameters}
          fieldList={[['FileName', 'name', 'iptType'], ['MimeType', 'mimetype', 'dropdownType']]}
          dataList={{
            MimeType: {
              data: VIDEO_TYPE,
              type: 'normal'
            }
          }}
        >
          <Tooltip title={I18n.t('vap.toolbar.files.createFile')}>
            <IconButton className={styles.add_alarm} onClick={openEditDialog}>
              <LibraryAddIcon />
            </IconButton>
          </Tooltip>
        </TableToolbar>
      </Permission>
      <IVHTable
        // tableMaxHeight={rowSelectItems.length > 0 ? 'calc(100% - 196px)' : 'calc(100% - 160px)'}
        // handleChooseAll={handleChooseAll}
        // rowSelection={rowSelection}
        keyId="id"
        columns={columns}
        dataSource={mainFileList}
        // loading={loading.effects[`${moduleName}/getFilesList`]}
        extraCell={extraCell}
      />
      <Pagination
        page={searchParameters.pageNo}
        rowsPerPage={searchParameters.pageSize}
        count={_.parseInt(fileList.totalCount) || 0}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
      />
    </Fragment>
  );
}

export default connect(({ global, vapFiles, loading }) => ({ global, vapFiles, loading }))(
  VAPFiles
);
