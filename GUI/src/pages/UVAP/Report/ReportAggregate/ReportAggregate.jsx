import React, { Fragment, useState, useEffect, useReducer, useCallback } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { I18n } from 'react-i18nify';
import { PAGE_NUMBER, PAGE_SIZE, DATE_FORMAT } from 'commons/constants/const';
import { Pagination, IVHTable } from 'components/common';
import {
  ReportAggregateFilterToolbar,
  ReportAggregateChart,
  ChannelsChooseDrawer,
  FileChooseDrawer
} from 'components/UVAP';
import moment from 'moment';
import { dateFormatForReportList, handleReportTypeList } from 'pages/UVAP/Report/utils';
import Dialog from '@material-ui/core/Dialog';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CardMedia from '@material-ui/core/CardMedia';

const useStyles = makeStyles(theme => {
  return {
    media_image: {
      height: theme.spacing(5),
      width: theme.spacing(5)
    }
  };
});

const pageInfoReducer = (pageInfo, action) => {
  switch (action.type) {
    case 'pindex':
      return { ...pageInfo, pindex: action.data };
    case 'psize':
      return { pindex: PAGE_NUMBER, psize: action.data };
    // case 'totalNum':
    //   return { ...pageInfo, totalNum: action.data || 0 };
    default:
      throw new Error();
  }
};

function ReportAggregate(props) {
  const classes = useStyles();
  const { dispatch, global, ReportAggregate } = props;
  const { userId } = global;
  const moduleName = ReportAggregate.namespace;
  const { reportList, reportTypeList, channelList, fileList } = ReportAggregate || {};
  const [pageInfo, dispatchPageInfo] = useReducer(pageInfoReducer, {
    pindex: PAGE_NUMBER,
    psize: PAGE_SIZE
  });
  const [totalNum, setTotalNum] = useState(0);

  const [dataSource, setDataSource] = useState([]);

  const [parameters, setParameters] = useState({});

  const [previewImage, setPreviewImage] = useState('');
  const [previewStatus, setPreviewStatus] = useState(false);

  const [chooseChannelStatus, setChooseChannelStatus] = useState(false);

  const [chooseFileStatus, setChooseFileStatus] = useState(false);

  const [simpleReportTypeList, setSimpleReportTypeList] = useState([]);

  const [multipleDeivceItems, setMultipleDeivceItems] = useState([]);

  useEffect(() => {
    setSimpleReportTypeList(handleReportTypeList(reportTypeList));
  }, [reportTypeList]);

  useEffect(() => {
    setDataSource(
      _.isEmpty(reportList.items) || _.isNil(reportList.items)
        ? []
        : dateFormatForReportList(reportList.items)
    );
    setTotalNum(_.parseInt(reportList.totalNum));
  }, [reportList]);

  const handlePreview = image => () => {
    setPreviewStatus(true);
    setPreviewImage(image);
  };

  const ImgCell = item => {
    return (
      item._snapshotId && (
        <CardMedia
          onClick={handlePreview(item._image)}
          className={classes.media_image}
          image={item._image}
        />
      )
    );
  };

  const extraCell = {
    columns: [
      {
        title: I18n.t('vap.table.report.snapshot'),
        dataIndex: '_image',
        key: '11'
      }
    ],
    components: [
      {
        component: ImgCell,
        key: '11'
      }
    ]
  };

  // table columns setting
  const columns = [
    {
      title: I18n.t('vap.table.report.time'),
      dataIndex: 'time',
      render: text => <span>{moment(_.toNumber(text)).format(DATE_FORMAT)}</span>
    },
    {
      title: I18n.t('vap.table.report.provider'),
      dataIndex: '_provider'
    },
    {
      title: I18n.t('vap.table.report.data'),
      dataIndex: '_data'
      // render: data => <span>{_.isObjectLike(data) ? JSON.stringify(data) : ''}</span>
    },
    {
      title: I18n.t('vap.table.report.type'),
      dataIndex: '_snapshotType'
    }
  ];
  // page func
  function onChangePage(e, page) {
    dispatchPageInfo({ type: 'pindex', data: page });
    getReportList({ pindex: page });
  }
  function onChangeRowsPerPage(e) {
    const { value } = e.target;
    dispatchPageInfo({ type: 'psize', data: value });
    getReportList({ pindex: PAGE_NUMBER, psize: value });
  }
  function getReportList(obj = {}) {
    dispatch({
      type: `${moduleName}/getReportList`,
      payload: {
        userId,
        ...parameters,
        ...pageInfo,
        multipleDeivceItems,
        ...obj
      }
    });
  }
  const getReportTypeList = useCallback(
    (obj = {}) => {
      dispatch({
        type: `${moduleName}/getReportTypeList`,
        payload: {
          userId,
          ...obj
        }
      });
    },
    [dispatch, moduleName, userId]
  );

  const getChannelList = useCallback(
    (obj = {}) => {
      dispatch({
        type: `${moduleName}/getChannelList`,
        payload: {
          userId,
          ...obj
        }
      });
    },
    [dispatch, moduleName, userId]
  );

  const getFilesList = useCallback(
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

  useEffect(() => {
    getReportTypeList();
  }, [getReportTypeList]);

  // reset data
  const resetVapReportAggregateState = useCallback(() => {
    dispatch({
      type: `${moduleName}/resetVapReportAggregateState`
    });
  }, [dispatch, moduleName]);

  useEffect(() => {
    resetVapReportAggregateState();
  }, [resetVapReportAggregateState]);

  function previewClose() {
    setPreviewStatus(false);
  }
  function clearTableList() {
    setDataSource([]);
    setTotalNum(0);
  }
  function handleChooseChannelClose() {
    setChooseChannelStatus(false);
  }
  function handleChooseChannelOpen() {
    setChooseChannelStatus(true);
  }
  function handleChooseFileOpen() {
    setChooseFileStatus(true);
  }
  function handleChooseFileClose() {
    setChooseFileStatus(false);
  }

  return (
    <Fragment>
      <ReportAggregateFilterToolbar
        reportTypeList={simpleReportTypeList}
        setParameters={setParameters}
        getReportList={getReportList}
        clearTableList={clearTableList}
        handleChooseChannelOpen={handleChooseChannelOpen}
        handleChooseFileOpen={handleChooseFileOpen}
        multipleDeivceItems={multipleDeivceItems}
        setMultipleDeivceItems={setMultipleDeivceItems}
      />
      {reportList.totalNum > 0 && (
        <ReportAggregateChart
          dataSource={reportList.items || {}}
          title={I18n.t('overview.title.licenseManagement')}
          callShowDetails={reportList.items}
          caseOfSwitch="reportManagement"
          isTitleNeeded={false}
        />
      )}
      <IVHTable keyId="_id" columns={columns} dataSource={dataSource} extraCellPrev={extraCell} />
      <Pagination
        page={pageInfo.pindex}
        rowsPerPage={pageInfo.psize}
        count={totalNum || 0}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
      />
      {/* channel choose drawer */}
      {chooseChannelStatus && (
        <ChannelsChooseDrawer
          // channelData={channelTreeData}
          open={chooseChannelStatus}
          onClose={handleChooseChannelClose}
          getChannelList={getChannelList}
          channelList={channelList}
          multipleDeivceItems={multipleDeivceItems}
          setMultipleDeivceItems={setMultipleDeivceItems}
        />
      )}
      {/* file choose drawer */}
      {chooseFileStatus && (
        <FileChooseDrawer
          // channelData={channelTreeData}
          open={chooseFileStatus}
          onClose={handleChooseFileClose}
          getFilesList={getFilesList}
          fileList={fileList}
          multipleDeivceItems={multipleDeivceItems}
          setMultipleDeivceItems={setMultipleDeivceItems}
        />
      )}
      {/* img dialog */}
      <Dialog open={previewStatus} footer={null} onClose={previewClose}>
        <img alt="Avatar" style={{ width: '100%' }} src={previewImage} />
      </Dialog>
    </Fragment>
  );
}

export default connect(({ global, ReportAggregate }) => ({
  global,
  ReportAggregate
}))(ReportAggregate);
