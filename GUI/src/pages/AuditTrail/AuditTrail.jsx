import React from 'react';
import { connect } from 'dva';
import { Permission, IVHTable, Pagination } from 'components/common';
import materialKeys from 'utils/materialKeys';
import { dateTimeTypeForTextField } from 'utils/dateHelper';
import { I18n } from 'react-i18nify';
import moment from 'moment';
import { DATE_FORMAT, PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
import _ from 'lodash';
import { AuditTrailWithExport, AuditTrailSelectExport } from 'components/AuditTrail';
import makeStyles from '@material-ui/core/styles/makeStyles';

const moduleName = 'auditTrail';
const useStyles = makeStyles(() => {
  return {
    root: {
      width: '100%',
      height: 'auto',
      display: 'flex',
      padding: '10px',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row'
    }
  };
});
class AuditTrail extends React.Component {
  constructor(props) {
    super(props);
    const startTime = dateTimeTypeForTextField(new Date(new Date() - 1000 * 60 * 30));
    this.state = {
      selected: [],
      initAuditTrailList: [],
      startTime,
      endTime: dateTimeTypeForTextField(new Date()),
      selectedExportItems: [],
      exportUserId: '',
      pageNo: PAGE_NUMBER,
      pageSize: PAGE_SIZE
    };
  }

  componentDidMount() {
    this.handleFilter();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: `${moduleName}/clearExportAuditTrailList`
    });
    this.setState({
      selected: [],
      initAuditTrailList: []
    });
  }

  componentWillReceiveProps(nextProps) {
    const { auditTrail } = this.props;
    const { auditTrailList } = auditTrail;
    const { items } = auditTrailList;
    if (nextProps.auditTrailList !== items) {
      this.setState({
        initAuditTrailList: items
      });
    }
  }

  handleFilter = (pageSize = PAGE_SIZE, pageNo = PAGE_NUMBER, filterObj) => {
    const { startTime, endTime } = this.state;
    if (!!filterObj && filterObj !== {}) {
      this.filterObj = filterObj;
      this.setState({
        pageNo: PAGE_NUMBER,
        pageSize: PAGE_SIZE
      });
    }
    const obj = Object.assign({}, this.filterObj);
    const { startTime: objStartTime, endTime: objEndTime } = obj;
    const { global } = this.props;
    obj.loginUserId = global.userId;
    obj.pageNo = pageNo;
    obj.pageSize = pageSize;
    obj.startTime =
      objStartTime !== undefined ? moment(objStartTime).format('YYYY-MM-DDTHH:mm:ss') : startTime;
    obj.endTime =
      objEndTime !== undefined ? moment(objEndTime).format('YYYY-MM-DDTHH:mm:ss') : endTime;
    this.callGetListSaga(obj);
    this.setState({
      exportActivityType: obj.activityType ? obj.activityType : '',
      exportUserId: obj.userId ? obj.userId : ''
    });
  };

  isSelected = id => {
    const { selected } = this.state;
    return selected.indexOf(id) !== -1;
  };

  handleExportAllAsExcel = () => {
    const { exportUserId, exportActivityType, startTime, endTime } = this.state;
    const { global } = this.props;
    const { userId } = global;
    const obj = {
      userId: exportUserId || '',
      activityType: exportActivityType || '',
      loginUserId: userId,
      startTime,
      endTime
    };
    this.onExportAll(obj);
  };

  // get the changed date
  handleChangeDate = (type, val) => {
    const { startTime, endTime } = this.state;
    let dateBegin = new Date(startTime);
    let dateEnd = new Date(endTime);
    let start = startTime;
    let end = endTime;
    if (type === 'start') {
      start = val;
      dateBegin = new Date(start);
    }
    if (type === 'end') {
      end = val;
      dateEnd = new Date(end);
    }
    const dateDiff = dateEnd.getTime() - dateBegin.getTime();
    if (dateDiff <= 0) {
      if (type === 'end') {
        this.setState({
          endTime: startTime
        });
      }
      if (type === 'start') {
        this.setState({
          startTime: endTime
        });
      }
    } else {
      this.setState({
        startTime: start,
        endTime: end
      });
    }
  };

  callGetListSaga(obj = {}) {
    const { dispatch } = this.props;
    dispatch({
      type: `${moduleName}/callGetListSaga`,
      payload: obj
    });
  }

  onExportAll(obj = {}) {
    const { dispatch } = this.props;
    dispatch({
      type: `${moduleName}/callExportAllSaga`,
      payload: obj
    });
  }

  onChangePage = (event, pageNo) => {
    const { pageSize } = this.state;
    this.setState({ pageNo });
    if (!_.isEmpty(event)) this.handleFilter(pageSize, pageNo);
  };

  onChangeRowsPerPage = event => {
    const { value } = event.target;
    this.setState({ pageSize: value, pageNo: PAGE_NUMBER });
    this.handleFilter(value, PAGE_NUMBER);
  };

  handleEventSearch = filterObj => {
    const { pageSize } = this.state;
    this.setState({ pageNo: PAGE_NUMBER });
    this.handleFilter(pageSize, PAGE_NUMBER, filterObj);
  };

  // select all list
  handleCheckAllClick = event => {
    // const { checked } = event.target;
    const { checked } = event.target;
    const { initAuditTrailList, selected } = this.state;
    const newData = initAuditTrailList.slice();
    const ids = newData.map(item => item.activityUuid);
    if (checked) {
      const curAll = selected.concat(ids);
      const res = Array.from(new Set(curAll));
      const newSelectedExportItems = []; // check no change
      initAuditTrailList.forEach(ele => {
        newSelectedExportItems.push(ele);
      });
      this.setState({
        selected: res,
        selectedExportItems: newSelectedExportItems
      });
    } else {
      const pre = _.clone(selected, true);
      for (const i in ids) {
        pre.splice(pre.indexOf(ids[i]), 1);
      }
      this.setState({
        selected: pre,
        selectedExportItems: []
      });
    }
  };

  // select single item
  handleCheckboxClick = (item, event) => {
    const { checked } = event.target;
    const { selected, selectedExportItems } = this.state;
    const { activityUuid } = item;
    const valueIndex = selected.indexOf(activityUuid);

    if (checked && valueIndex === -1) {
      selected.push(activityUuid);
      selectedExportItems.push(item);
    }
    if (!checked && valueIndex !== -1) {
      selected.splice(valueIndex, 1);
      selectedExportItems.splice(valueIndex, 1);
    }
    this.setState({ selected, selectedExportItems });
  };

  render() {
    const { selected, selectedExportItems, pageNo, pageSize } = this.state;
    const classes = useStyles;
    const columns = [
      {
        title: I18n.t('auditTrail.title.userId'),
        dataIndex: 'userId'
      },
      {
        title: I18n.t('auditTrail.title.actionType'),
        dataIndex: 'activityType'
      },
      {
        title: I18n.t('auditTrail.title.auditDateTime'),
        dataIndex: 'logTime',
        render: text => <span>{moment(text).format(DATE_FORMAT)}</span>
      },
      {
        title: I18n.t('auditTrail.title.data'),
        dataIndex: 'requestInfo',
        render: text => <span>{JSON.stringify(JSON.parse(text).params)}</span>
      },
      {
        title: I18n.t('auditTrail.title.response'),
        dataIndex: 'responseInfo',
        render: text => (
          <span>
            {JSON.parse(text).statusCode === 200
              ? 'Success'
              : `Fail: ${JSON.parse(text).errorMessage}`}
          </span>
        )
      }
    ];
    const { auditTrail } = this.props;
    const { auditTrailList, auditTrailExportData } = auditTrail;
    const { totalNum } = auditTrailList;
    const rowSelection = {
      onChange: this.handleCheckboxClick,
      selectedRowKeys: selected
    };
    return (
      <>
        <div className={classes.root}>
          {selectedExportItems.length > 0 && (
            <Permission materialKey={materialKeys['M4-110']}>
              <AuditTrailSelectExport numSelected={selectedExportItems} />
            </Permission>
          )}
          <Permission materialKey={materialKeys['M4-119']}>
            <AuditTrailWithExport
              downloadMaterialKey={materialKeys['M4-111']}
              exportData={auditTrailExportData}
              handleExport={this.handleExportAllAsExcel}
              fieldList={[
                ['UserID', 'userId', 'iptType'],
                ['ActionType', 'activityType', 'iptType'],
                ['Range', 'range', 'rangeType']
              ]}
              dataList={{
                [I18n.t('auditTrail.title.actionType')]: {
                  data: I18n.t('auditTrail.title.actionType') || [],
                  type: 'keyVal',
                  id: 0,
                  val: 1
                }
              }}
              handleDateSubmit={this.handleChangeDate}
              handleSearch={this.handleEventSearch}
            />
          </Permission>
        </div>
        <IVHTable
          tableMaxHeight="calc(100% - 156px)"
          keyId="activityUuid"
          handleChooseAll={this.handleCheckAllClick}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={(auditTrailList && auditTrailList.items) || []}
        />
        <Pagination
          page={pageNo}
          rowsPerPage={pageSize}
          count={totalNum}
          onChangePage={this.onChangePage}
          onChangeRowsPerPage={this.onChangeRowsPerPage}
        />
      </>
    );
  }
}
export default connect(({ auditTrail, global }) => ({ auditTrail, global }))(AuditTrail);
