import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { TableToolbar, ConfirmPage, IVHTable, Download, ToolTip } from 'components/common';
import msg from 'utils/messageCenter';
import { I18n } from 'react-i18nify';
import { isSuccess } from 'utils/helpers';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import CloudDownload from '@material-ui/icons/CloudDownload';
import LibraryAdd from '@material-ui/icons/LibraryAdd';
import VerticalAlignCenter from '@material-ui/icons/VerticalAlignCenter';
import {
  VADEDataTypeCreateOrUpdate as CreateFileTypeDialog,
  VADEDataCreateOrUpdate as CreateOrUpdate,
  VADEDataGeneratePage as GeneratePage,
  VADEDataDetailPage as DetailPage
} from 'components/VADE';
import Paper from '@material-ui/core/Paper';
import { PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import TablePagination from '@material-ui/core/TablePagination';
// import moment from 'moment';

const msgTitle = 'VADE Data';
class VADEData extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      checkedIds: [],
      operationType: '',
      itemData: [],
      openUploadDialog: false,
      pageNo: PAGE_NUMBER,
      pageSize: PAGE_SIZE,
      isConfirmPageOpen: false,
      flagCleanCreateData: false,
      openCreateFileTypeDialog: false,
      downloadResult: '',
      isGeneratePageOpen: false,
      eabledGenerateBtn: false,
      analyticItem: {},
      modelItem: {},
      openDetailDialog: false
    };
    this.flag_openCreate = false;
    this.searchMapObj = {};
    this.searchComponent = null;
  }

  openConfirm = () => {
    this.setState({ isConfirmPageOpen: true });
  };

  openGenerate = () => {
    this.setState({ isGeneratePageOpen: true });
  };

  closeConfirm = () => {
    this.setState({ isConfirmPageOpen: false });
  };

  handleBatchDel = () => {
    const { dispatch, global } = this.props;
    const { checkedIds, pageSize } = this.state;
    dispatch({
      type: 'vadeData/delData',
      payload: {
        ids: checkedIds, // checkedIds.toString()
        createUserId: global.userId
      }
    }).then(res => {
      if (!res) return;
      if (isSuccess(res)) {
        msg.success('Deleted Data Successfully', msgTitle);
        this.setState({ pageNo: PAGE_NUMBER });
        this.handleGetDataByPage(PAGE_NUMBER, pageSize);
      } else {
        msg.error(res.message, msgTitle);
      }
      this.closeConfirm();
      this.clean();
    });
  };

  handleCheckboxClick = (item, event) => {
    const { vadeData } = this.props;
    const { dataListPage } = vadeData;
    const dataList = dataListPage.items;

    const { checked } = event.target;
    const { checkedIds } = this.state;
    const { uuid } = item;
    const valueIndex = checkedIds.indexOf(uuid);

    if (checked && valueIndex === -1) {
      checkedIds.push(uuid);
    }
    if (!checked && valueIndex !== -1) {
      checkedIds.splice(valueIndex, 1);
    }
    this.setState({ checkedIds });
    if (checkedIds.length === 2) {
      let checkedId1 = '';
      let checkedId2 = '';
      for (const key in dataList) {
        if (dataList[key].uuid === checkedIds[0]) {
          checkedId1 = dataList[key];
        }
        if (dataList[key].uuid === checkedIds[1]) {
          checkedId2 = dataList[key];
        }
      }
      if (checkedId1.entry === 'analytic' && checkedId2.entry === 'model') {
        this.setState({ eabledGenerateBtn: true, analyticItem: checkedId1, modelItem: checkedId2 });
      } else if (checkedId2.entry === 'analytic' && checkedId1.entry === 'model') {
        this.setState({ eabledGenerateBtn: true, analyticItem: checkedId2, modelItem: checkedId1 });
      } else {
        this.setState({ eabledGenerateBtn: false });
      }
    } else {
      this.setState({ eabledGenerateBtn: false });
    }
  };

  handleSelectAllClick = event => {
    const { vadeData } = this.props;
    const { dataListPage } = vadeData;
    const { checkedIds } = this.state;
    const { checked } = event.target;
    const curPageIds = dataListPage.items.map(item => item.uuid);
    if (checked) {
      const allPageCheckedIds = checkedIds.concat(curPageIds);
      const result = _.uniq(allPageCheckedIds);
      this.setState({
        checkedIds: result
      });
    } else {
      const pre = _.clone(checkedIds, true);
      for (const i in curPageIds) {
        pre.splice(pre.indexOf(curPageIds[i]), 1);
      }
      this.setState({ checkedIds: pre });
    }
  };

  isSelected = id => {
    const { checkedIds } = this.state;
    return checkedIds.indexOf(id) !== -1;
  };

  clean = () => {
    this.setState({
      checkedIds: []
    });
  };

  openDetail = itemData => {
    this.setState({ openDetailDialog: true, itemData });
  };

  onCloseDetailPage = () => {
    this.setState({ openDetailDialog: false });
  };

  openCreateDialog = () => {
    this.setState({ operationType: 'create', openUploadDialog: true });
  };

  openEditPage = item => {
    const { onSearchOne } = this.props;
    onSearchOne(item.uuid);
    this.setState({
      operationType: 'update',
      itemData: item,
      openUploadDialog: true
    });
  };

  closeUploadDialog = () => {
    this.setState({ openUploadDialog: false });
    this.clean();
  };

  downloadFile = () => {
    const { dispatch } = this.props;
    const { checkedIds } = this.state;
    dispatch({
      type: 'vadeData/downloadFile',
      payload: { checkedIds }
    }).then(() => {
      // if (!res) return;
      // if (res) {
      //   this.setState({ downloadResult: res });
      //   msg.success('Download File Successfully', msgTitle);
      this.clean();
      // } else {
      //   msg.error('Download File Failure', msgTitle);
      // }
    });
  };

  handleAddFileType = info => {
    const { dispatch, global } = this.props;
    const obj = info;
    obj.createUserId = global.userId;
    dispatch({
      type: 'vadeData/createDataTypeList',
      payload: obj
    }).then(res => {
      if (!res) return;
      if (isSuccess(res)) {
        msg.success('Saved Data Type Successfully', msgTitle);
        dispatch({
          type: 'vadeData/getFileTypeList',
          payload: { category: 'data', createUserId: global.userId }
        });
        this.setState({
          openCreateFileTypeDialog: false
        });
        this.CreateFileTypeComponent.clean();
      } else {
        msg.error(res.message, msgTitle);
      }
    });
  };

  addModel = obj => {
    const { dispatch, global } = this.props;
    const { analyticItem, modelItem } = this.state;
    dispatch({
      type: 'messageCenter/addProgressBar',
      payload: {
        deviceName: analyticItem.fileName,
        msg: 'Generate Data In Progress..',
        clippingId: analyticItem.uuid
      }
    });
    dispatch({
      type: 'vadeData/addModel',
      payload: {
        ...obj,
        analyticUuid: analyticItem.uuid,
        modelUuid: modelItem.uuid,
        createUserId: global.userId
      }
    }).then(res => {
      if (!res) return;
      if (isSuccess(res)) {
        msg.success('Generate Data Successfully', msgTitle);
        this.handleGetDataByPage(PAGE_NUMBER, PAGE_SIZE);
        dispatch({
          type: 'messageCenter/delProgressBar',
          id: analyticItem.uuid
        });
        this.setState({
          isGeneratePageOpen: false,
          pageNo: PAGE_NUMBER,
          pageSize: PAGE_SIZE,
          checkedIds: [],
          analyticItem: {},
          modelItem: {}
        });
      } else {
        msg.error(res.message, msgTitle);
        dispatch({
          type: 'messageCenter/delProgressBar',
          id: analyticItem.uuid
        });
      }
    });
  };

  saveData = () => {
    const { pageSize } = this.state;
    this.setState({ pageNo: PAGE_NUMBER });
    this.searchComponent.clean();
    this.searchMapObj = {};
    this.handleGetDataByPage(PAGE_NUMBER, pageSize);
    // const { dispatch, global } = this.props;
    // const { operationType, pageSize } = this.state;
    // dispatch({
    //   type: 'vadeData/saveData',
    //   payload: {
    //     ...obj,
    //     createUserId: global.userId,
    //     category: 'data'
    //   }
    // }).then(res => {
    //   if (!res) return;
    // if (isSuccess(res)) {) {
    //     if (operationType === 'create') {
    //       msg.success('Saved Data Successfully', msgTitle);
    //     } else {
    //       msg.success('Updated Data Successfully', msgTitle);
    //     }
    //     this.handleGetDataByPage(PAGE_NUMBER, pageSize);
    //     this.setState(
    //       {
    //         openUploadDialog: false
    //       },
    //       () => {
    //         this.CreateOrUpdateComponent.onClose();
    //       }
    //     );
    //   } else {
    //     msg.error(res.message, msgTitle);
    //   }
    // });
  };

  columns = [
    {
      title: I18n.t('vade.config.dataName'),
      dataIndex: 'fileName',
      renderItem: item => (
        <Link
          onClick={() => {
            this.openDetail(item);
          }}
        >
          <Typography color="secondary" component="span">
            {item.fileName}
          </Typography>
        </Link>
      )
    },
    {
      title: I18n.t('vade.config.entry'),
      dataIndex: 'entry'
    },
    {
      title: I18n.t('vade.config.generatedBy'),
      dataIndex: 'generateBy'
    },
    {
      title: I18n.t('vade.config.createdBy'),
      dataIndex: 'createUserId'
    },
    {
      title: I18n.t('vade.config.createdDate'),
      dataIndex: 'createTime'
      // render: text => moment(text).format(DATE_FORMAT)
    }
  ];

  onChangePage = (e, page) => {
    const { pageSize } = this.state;
    this.setState({ pageNo: page });
    this.handleGetDataByPage(page, pageSize);
  };

  onChangeRowsPerPage = e => {
    const { value } = e.target;
    this.setState({ pageNo: PAGE_NUMBER, pageSize: value });
    this.handleGetDataByPage(PAGE_NUMBER, value);
  };

  handleSearch = obj => {
    const { pageSize } = this.state;
    this.setState({ pageNo: PAGE_NUMBER });
    this.handleGetDataByPage(PAGE_NUMBER, pageSize, obj);
  };

  handleGetDataByPage = (pageNo, pageSize, searchMapObj) => {
    const { dispatch, global } = this.props;
    if (searchMapObj && !_.isEqual(searchMapObj, {})) {
      this.searchMapObj = searchMapObj;
    }
    dispatch({
      type: 'vadeData/getDataList',
      payload: {
        pageNo,
        pageSize,
        category: 'data',
        createUserId: global.userId,
        ...this.searchMapObj
      }
    });
  };

  componentDidMount() {
    const { dispatch, global } = this.props;
    this.handleGetDataByPage(PAGE_NUMBER, PAGE_SIZE);
    dispatch({
      type: 'vadeData/getEntryList',
      payload: { category: 'data' }
    });
    dispatch({
      type: 'vadeData/getFileTypeList',
      payload: { category: 'data', createUserId: global.userId }
    });
  }

  render() {
    const { vadeData, global } = this.props;
    const { dataListPage, dataTypeList, entryList, taskTypeList } = vadeData;
    const {
      checkedIds,
      openUploadDialog,
      // dataEntryList,
      operationType,
      isConfirmPageOpen,
      flagCleanCreateData,
      itemData,
      openCreateFileTypeDialog,
      pageNo,
      pageSize,
      downloadResult,
      isGeneratePageOpen,
      eabledGenerateBtn,
      analyticItem,
      modelItem,
      openDetailDialog
    } = this.state;
    const rowSelection = {
      onChange: this.handleCheckboxClick,
      selectedRowKeys: checkedIds
    };
    return (
      <>
        <Paper elevation={0}>
          <TableToolbar
            getToolBarRef={child => {
              this.searchComponent = child;
            }}
            checkedIds={checkedIds}
            handleGetDataByPage={this.handleSearch}
            fieldList={[['DataName', 'fileName', 'iptType'], ['Entry', 'entry', 'dropdownType']]}
            dataList={{
              Entry: { data: entryList.map(item => item.entry), type: 'normal' }
            }}
          >
            <div style={{ marginLeft: 'auto' }}>
              {checkedIds.length > 0 ? (
                <React.Fragment>
                  <ToolTip title="Generate">
                    <div style={{ display: 'inline' }}>
                      <IconButton
                        aria-label="Generate"
                        disabled={!eabledGenerateBtn}
                        onClick={this.openGenerate}
                      >
                        <VerticalAlignCenter />
                      </IconButton>
                    </div>
                  </ToolTip>
                  <ToolTip title="Download">
                    <div style={{ display: 'inline' }}>
                      <IconButton
                        aria-label="Download"
                        disabled={checkedIds.length !== 1}
                        onClick={() => this.downloadFile(checkedIds)}
                      >
                        <CloudDownload />
                      </IconButton>
                    </div>
                  </ToolTip>
                  <ToolTip title="Delete">
                    <IconButton aria-label="Delete" onClick={this.openConfirm}>
                      <Delete />
                    </IconButton>
                  </ToolTip>
                </React.Fragment>
              ) : (
                <ToolTip title="Create Data">
                  <IconButton
                    aria-label="Create Data"
                    onClick={() =>
                      this.setState({
                        openUploadDialog: true,
                        operationType: 'create',
                        itemData: {}
                      })
                    }
                  >
                    <LibraryAdd />
                  </IconButton>
                </ToolTip>
              )}
            </div>
          </TableToolbar>
        </Paper>
        <IVHTable
          dataSource={(dataListPage && dataListPage.items) || []}
          handleChooseAll={this.handleSelectAllClick}
          columns={this.columns}
          rowSelection={rowSelection}
          tableMaxHeight="calc(100% - 160px)"
          keyId="uuid"
        />
        <Download exportData={downloadResult} />
        <TablePagination
          page={pageNo}
          rowsPerPage={pageSize}
          count={(dataListPage && dataListPage.totalNum) || 0}
          onChangePage={this.onChangePage}
          onChangeRowsPerPage={this.onChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          backIconButtonProps={{
            'aria-label': 'previous page'
          }}
          nextIconButtonProps={{
            'aria-label': 'next page'
          }}
        />
        {openUploadDialog && (
          <CreateOrUpdate
            getChild={child => {
              this.CreateOrUpdateComponent = child;
            }}
            openDialog={openUploadDialog}
            closeDialog={this.closeUploadDialog}
            operationType={operationType}
            fileTypeList={dataTypeList && dataTypeList.items ? dataTypeList.items : []}
            handleSubmit={this.saveData}
            itemData={itemData}
            entryList={entryList}
            openCreateFileTypeDialog={entry => {
              this.setState({ openCreateFileTypeDialog: true });
              this.flag_openCreate = true;
              this.entryOfCreateFileType = entry;
            }}
            flag_openCreate={this.flag_openCreate}
            userId={global.userId}
          />
        )}
        {openDetailDialog && <DetailPage itemData={itemData} onClose={this.onCloseDetailPage} />}
        <CreateFileTypeDialog
          getChild={child => {
            this.CreateFileTypeComponent = child;
          }}
          openDialog={openCreateFileTypeDialog}
          closeDialog={() => {
            this.setState({ openCreateFileTypeDialog: false }, () => {
              this.flag_openCreate = false;
            });
          }}
          handleSubmit={this.handleAddFileType}
          operationType="create"
          entryOfCreateFileType={this.entryOfCreateFileType}
          entryList={entryList}
          taskTypeList={taskTypeList}
          flag_clean={flagCleanCreateData}
        />
        <GeneratePage
          openDialog={isGeneratePageOpen}
          closeDialog={() => {
            this.setState({ isGeneratePageOpen: false });
          }}
          handleSubmit={this.addModel}
          analyticName={analyticItem.fileName}
          modelName={modelItem.fileName}
        />
        <ConfirmPage
          message={I18n.t('vade.config.deleteDataConfirm')}
          messageTitle={I18n.t('vade.config.deleteData')}
          isConfirmPageOpen={isConfirmPageOpen}
          hanldeConfirmMessage={this.handleBatchDel}
          handleConfirmPageClose={this.closeConfirm}
        />
      </>
    );
  }
}

export default connect(({ vadeData, global }) => ({ vadeData, global }))(VADEData);
