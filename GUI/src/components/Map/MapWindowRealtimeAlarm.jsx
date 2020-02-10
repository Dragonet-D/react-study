/*
 * @Description: Realtime alarm table
 * @Author: Kevin
 * @Email: baishi.wang@ncs.com.sg
 * @Date: 2019-08-21 00:21:41
 * @LastEditTime: 2019-10-16 15:13:12
 * @LastEditors: Kevin
 */

import React, { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import { I18n } from 'react-i18nify';
import { Pagination, IVHTable, DialogWindow } from 'components/common';
import { Context } from 'utils/createContext';
import { PAGE_NUMBER, PAGE_SIZE, DATE_FORMAT } from 'commons/constants/const';

const columns = [
  {
    title: I18n.t('map.realtime.sentTime'),
    dataIndex: 'time',
    render: text => <span>{moment(text).format(DATE_FORMAT)}</span>,
    sorter: {
      order: 'desc',
      active: true
    }
  },
  {
    title: I18n.t('map.realtime.eventType'),
    dataIndex: 'alarmTypeDesc'
  },
  {
    title: I18n.t('map.realtime.source'),
    dataIndex: 'sourceName'
  },
  {
    title: I18n.t('map.realtime.data'),
    dataIndex: 'data'
  },
  {
    title: I18n.t('map.realtime.owner'),
    dataIndex: 'ownedBy'
  },
  {
    title: I18n.t('map.realtime.status'),
    dataIndex: 'status'
  }
];

export default function MapWindowRealtimeAlarm(props) {
  const moduleName = 'map';
  const {
    contextMenu: { alarmListUI }
  } = useContext(Context);
  const { setRealtimeAlarmSelected } = alarmListUI;
  const { alarmRealtimeData, dispatch, userId } = props;
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [pageNo, setPageNo] = useState(PAGE_NUMBER);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    setDataSource(handlePaginationFront(alarmRealtimeData, pageSize, pageNo));
  }, [alarmRealtimeData, pageNo, pageSize]);

  return (
    <>
      <DialogWindow
        title={I18n.t('map.windowRealtimeAlarm.title')}
        properties={{
          default: { x: 15, y: 410, width: '98%', height: '40%' },
          minWidth: '10%',
          minHeight: '20%'
        }}
        operation={{}}
      >
        <IVHTable
          tableMaxHeight="100%"
          // rowSelection={rowSelection}
          keyId="alarmDetailsUuid"
          columns={columns}
          dataSource={dataSource}
          handleSortChange={handleSortChange}
          rowSelectionClick={handleSelectRowClickEvent}
          rowSelectionType="single"
        />
        <Pagination
          page={pageNo}
          rowsPerPage={pageSize}
          count={alarmRealtimeData.length || 0}
          onChangePage={onChangePage}
          onChangeRowsPerPage={onChangeRowsPerPage}
        />
      </DialogWindow>
    </>
  );

  function onChangePage(e, page) {
    setPageNo(page);
    setDataSource(handlePaginationFront(alarmRealtimeData, pageSize, page));
  }
  function onChangeRowsPerPage(e) {
    const { value } = e.target;
    setPageSize(value);
    setDataSource(handlePaginationFront(alarmRealtimeData, value, pageNo));
  }

  function handlePaginationFront(data, pageSize, pageNo) {
    const { length } = data;
    return data.slice(pageNo * pageSize, pageSize > length ? length : pageSize + pageNo * pageSize);
  }

  function handleSortChange(data) {
    getAlarmRealtimeList(data.sort);
  }

  function getAlarmRealtimeList(sort = 'desc') {
    const sortList = [{ key: 'time', sort }];
    dispatch({
      type: `${moduleName}/getAlarmRealtimeData`,
      payload: {
        sort: sortList,
        userId
      }
    });
  }

  function handleSelectRowClickEvent(item) {
    setRealtimeAlarmSelected(item);
  }
}
