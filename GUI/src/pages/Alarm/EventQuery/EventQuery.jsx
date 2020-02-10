import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Pagination, IVHTable, Permission } from 'components/common';
import materialKeys from 'utils/materialKeys';
import Typography from '@material-ui/core/Typography';
import { SearchHeaderWithExport, DataView } from 'components/Alarm';
import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import { I18n } from 'react-i18nify';
import { PAGE_NUMBER, PAGE_SIZE, DATE_FORMAT } from 'commons/constants/const';
import { getStartTime, getEndTime } from 'utils/dateHelper';
import { handleDataForTable, getSelectRowKeys } from './utils';
import EventQueryCustomExport from './EventQueryCustomExport';
import styles from './EventQuery.module.less';

function EventQuery(props) {
  const moduleName = 'eventQuery';
  const { dispatch, eventQuery, global } = props;
  const { eventsData, alarmInitInfo = {}, eventsExportData } = eventQuery;
  const { userId } = global;
  const eventsLocal = useRef([]);

  const [eventQueryData, setEventQueryData] = useState([]);
  const [pageNo, setPageNo] = useState(PAGE_NUMBER);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [startTime, setStartTime] = useState(getStartTime());
  const [endTime, setEndTime] = useState(getEndTime());
  const [searchParameters, setSearchParameters] = useState('{}');
  const [rowSelectItems, setRowSelectItems] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataView, setDataView] = useState({ open: false, data: '' });

  const getEventList = useCallback(
    (obj = {}) => {
      const payload = Object.assign(
        {
          userId,
          startTime,
          endTime,
          pageNo,
          pageSize
        },
        JSON.parse(searchParameters),
        obj
      );
      dispatch({
        type: `${moduleName}/getEvents`,
        payload
      });
    },
    [dispatch, endTime, pageNo, pageSize, searchParameters, startTime, userId]
  );
  // clear export data
  useEffect(() => {
    dispatch({
      type: `${moduleName}/clearExportEventList`
    });
  }, [eventsExportData, dispatch]);
  // init alarm system config
  useEffect(() => {
    dispatch({
      type: `${moduleName}/getAlarmInitInfo`
    });
  }, [dispatch]);
  useEffect(() => {
    getEventList();
  }, [getEventList]);

  useEffect(() => {
    if (eventsData && eventsData.items) {
      const data = handleDataForTable(eventsData.items);
      eventsLocal.current = eventsData.items;
      setEventQueryData(data);
    }
  }, [eventsData]);

  const handleViewData = useCallback(e => {
    setDataView({ open: true, data: JSON.parse(e) });
  }, []);

  const columns = [
    {
      title: I18n.t('alarm.config.sentTime'),
      dataIndex: 'time',
      render: text => <span>{moment(text).format(DATE_FORMAT)}</span>,
      width: 50
    },
    {
      title: I18n.t('alarm.config.source'),
      dataIndex: 'sourceName',
      width: 40
    },
    {
      title: I18n.t('alarm.config.eventType'),
      dataIndex: 'eventType',
      width: 50
    },
    {
      title: I18n.t('alarm.config.data'),
      dataIndex: 'data',
      width: 250,
      render: text => (
        <Typography
          color="textSecondary"
          component="span"
          onClick={handleViewData.bind(null, text)}
        >
          {text}
        </Typography>
      )
    }
  ];

  function handleItemCheck(item, event) {
    const { checked } = event.target;
    const { eventId } = item;
    setRowSelectItems(prevData => {
      const data = _.cloneDeep(prevData);
      if (checked) {
        data.push(item);
        return data;
      } else {
        const index = data.findIndex(i => i.eventId === eventId);
        data.splice(index, 1);
        return data;
      }
    });
    setSelectedRowKeys(prevData => {
      const data = prevData.slice();
      if (checked) {
        data.push(eventId);
        return data;
      } else {
        const index = data.indexOf(eventId);
        data.splice(index, 1);
        return data;
      }
    });
  }

  const rowSelection = {
    onChange: handleItemCheck,
    selectedRowKeys
  };

  // choose all
  const handleChooseAll = useCallback(e => {
    const { checked } = e.target;
    const eventDataTemp = _.cloneDeep(eventsLocal.current);
    setRowSelectItems(prevData => {
      const data = _.cloneDeep(prevData);
      if (checked) {
        return _.uniqBy(data.concat(eventDataTemp), 'eventId');
      } else {
        return _.uniqBy(_.differenceBy(data, eventDataTemp, 'eventId'), 'eventId');
      }
    });
    setSelectedRowKeys(prevData => {
      const data = _.cloneDeep(prevData);
      const eventQueryDataIds = getSelectRowKeys(eventDataTemp, 'eventId');
      if (checked) {
        return [...new Set(data.concat(eventQueryDataIds))];
      } else {
        return [...new Set(_.difference(data, eventQueryDataIds))];
      }
    });
  }, []);

  // page change
  function onChangePage(e, page) {
    setPageNo(page);
  }

  // row per page change
  function onChangeRowsPerPage(e) {
    const { value } = e.target;
    setPageSize(value);
    setPageNo(0);
  }

  function handleEventSearch(filterObj) {
    setSearchParameters(JSON.stringify(filterObj));
    setPageNo(0);
  }

  const handleDateSubmit = (time, value) => {
    if (time === 'startTime') {
      setStartTime(value);
      getEventList({ startTime: value });
    } else if (time === 'endTime') {
      setEndTime(value);
      getEventList({ endTime: value });
    }
  };

  function handleExport() {
    dispatch({
      type: `${moduleName}/exportEventList`,
      payload: {
        userId,
        startTime,
        endTime,
        pageNo,
        pageSize,
        ...searchParameters
      }
    });
  }

  function dataViewClose() {
    setDataView({ open: false, data: '' });
  }

  return (
    <>
      {dataView.open && <DataView dataSource={dataView.data} handleClose={dataViewClose} />}
      <div className={styles.toolbar_wrapper}>
        {rowSelectItems.length > 0 && (
          <Permission materialKey={materialKeys['M4-79']}>
            <EventQueryCustomExport numSelected={rowSelectItems} />
          </Permission>
        )}
        <Permission materialKey={materialKeys['M4-64']}>
          <SearchHeaderWithExport
            downloadMaterialKey={materialKeys['M4-79']}
            handleSearch={handleEventSearch}
            fieldList={[
              [I18n.t('alarm.config.source'), 'sourceName', 'iptType'],
              [I18n.t('alarm.config.eventType'), 'eventType', 'dropdownType'],
              ['Range', 'range', 'rangeType']
            ]}
            dataList={{
              [I18n.t('alarm.config.eventType')]: {
                data: alarmInitInfo.eventType || [],
                type: 'keyVal',
                id: 0,
                val: 1
              }
            }}
            exportData={eventsExportData}
            handleDateSubmit={handleDateSubmit}
            handleExport={handleExport}
          />
        </Permission>
      </div>
      <IVHTable
        tableMaxHeight="calc(100% - 184px)"
        keyId="eventId"
        handleChooseAll={handleChooseAll}
        columns={columns}
        dataSource={eventQueryData}
        rowSelection={rowSelection}
      />
      <Pagination
        page={pageNo}
        rowsPerPage={pageSize}
        count={eventsData.totalNum}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
      />
    </>
  );
}

export default connect(({ global, eventQuery }) => ({ global, eventQuery }))(EventQuery);
