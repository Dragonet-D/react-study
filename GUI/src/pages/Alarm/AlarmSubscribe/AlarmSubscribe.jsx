import React, { useState, useEffect, useCallback } from 'react';
import _ from 'lodash';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { connect } from 'dva';
import { Button, Pagination, TableToolbar, IVHTable, Permission } from 'components/common';
import materialKeys from 'utils/materialKeys';
import msg from 'utils/messageCenter';
import { isSuccess } from 'utils/helpers';
import * as constant from 'commons/constants/commonConstant';
import { PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
import { Translate, I18n } from 'react-i18nify';
import { EMAIL, SMS, ON_SCREEN, noEmailRemind, noPhoneRemind, handleDataForTable } from './utils';

function SubscribePage(props) {
  const moduleName = 'alarmSubscribe';
  const {
    alarmSubscribe: { subscribeSettingData = {}, alarmInitInfo = {} },
    dispatch,
    global: {
      userId,
      userInfo: { userEmail, userPhone }
    }
  } = props;
  const [pageNo, setPageNo] = useState(PAGE_NUMBER);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [subscribeData, setSubscribeData] = useState([]);
  const [originSubscribeData, setOriginSubscribeData] = useState([]);
  const [searchParameters, setSearchParameters] = useState('{}');

  const isLength = !!subscribeData.length;
  // get the initial data

  const onSearchSubscribe = useCallback(
    (obj = {}) => {
      dispatch({
        type: `${moduleName}/getSubscribeData`,
        payload: Object.assign(
          {
            userId,
            pageNo,
            pageSize
          },
          JSON.parse(searchParameters),
          obj
        )
      });
    },
    [dispatch, pageNo, pageSize, searchParameters, userId]
  );

  // init alarm system config
  useEffect(() => {
    dispatch({
      type: `${moduleName}/getAlarmInitInfoApi`
    });
  }, [dispatch]);
  useEffect(() => {
    onSearchSubscribe();
  }, [onSearchSubscribe]);

  // update the data list
  useEffect(() => {
    if (subscribeSettingData && subscribeSettingData.items) {
      const { items } = _.cloneDeep(subscribeSettingData);
      const handledData = handleDataForTable(items);
      setSubscribeData(handledData);
      setOriginSubscribeData(handledData);
    }
  }, [subscribeSettingData]);

  function setInitDataSource() {
    setSubscribeData(handleDataForTable(_.cloneDeep(subscribeSettingData).items));
  }

  function handleAlarmSearch(obj) {
    setSearchParameters(JSON.stringify(obj));
    setPageNo(0);
  }

  const handleItemCheck = (item, event) => {
    const { checked } = event.target;
    const { notificationMethod, alarmDefinitionUuid: value } = item;
    if (checked) {
      if (notificationMethod.includes('Email')) {
        if (!userEmail) {
          msg.info(noEmailRemind);
          return;
        }
      } else if (notificationMethod.includes('SMS')) {
        if (!userPhone) {
          msg.info(noPhoneRemind);
          return;
        }
      }
    }
    setSubscribeData(subscribeData => {
      const data = _.cloneDeep(subscribeData);
      if (checked) {
        for (const val of data) {
          if (val.alarmDefinitionUuid === value && val.forceSubscribe !== 'Y') {
            val.checked = checked;
          }
        }
      } else {
        const index = data.findIndex(item => item.alarmDefinitionUuid === value);
        const result = data.find(item => item.alarmDefinitionUuid === value);
        result.notificationMethod = result.defaultNotiMethod;
        result.checked = checked;
        data.splice(index, 1, result);
      }
      return data;
    });
  };

  function handleChooseAll(event) {
    const { checked } = event.target;
    if (checked) {
      setSubscribeData(subscribeData => {
        const data = _.cloneDeep(subscribeData);
        for (const val of data) {
          if (val.forceSubscribe !== 'Y' && !val.checked) {
            const { notificationMethod } = val;
            if (notificationMethod.includes(EMAIL) && !userEmail) {
              msg.info(noEmailRemind);
              val.checked = !checked;
            } else {
              val.checked = checked;
            }
            if (notificationMethod.includes(SMS) && !userPhone) {
              msg.info(noPhoneRemind);
              val.checked = !checked;
            } else {
              val.checked = checked;
            }
          }
        }
        return data;
      });
    } else {
      setSubscribeData(subscribeData => {
        const data = _.cloneDeep(subscribeData);
        for (const val of data) {
          if (val.forceSubscribe !== 'Y' && val.checked) {
            const { alarmDefinitionUuid } = val;
            val.checked = checked;
            const index = data.findIndex(item => item.alarmDefinitionUuid === alarmDefinitionUuid);
            const result = data.find(item => item.alarmDefinitionUuid === alarmDefinitionUuid);
            result.notificationMethod = result.defaultNotiMethod;
            result.checked = checked;
            data.splice(index, 1, result);
          }
        }
        return data;
      });
    }
  }

  const itemChildrenCheck = item => event => {
    const { checked, value } = event.target;
    const { alarmDefinitionUuid: id } = item;
    const findResult = subscribeData.find(item => item.alarmDefinitionUuid === id);
    if (!findResult) return;
    if (!findResult.checked) {
      msg.info(I18n.t('alarm.remindInformation.checkTheBoxFirstly'));
    } else {
      if (checked) {
        if (value === EMAIL) {
          if (!userEmail) {
            msg.info(noEmailRemind);
            return;
          }
        } else if (value === SMS) {
          if (!userPhone) {
            msg.info(noPhoneRemind);
            return;
          }
        }
      }
      setSubscribeData(subscribeData => {
        const data = _.cloneDeep(subscribeData);
        for (const val of data) {
          if (val.alarmDefinitionUuid === id) {
            let temp = val.notificationMethod;
            if (checked) {
              temp = `${temp},${value}`;
            } else if (temp.includes(value)) {
              const tempArr = temp.split(',');
              const index = tempArr.findIndex(item => item === value);
              tempArr.splice(index, 1);
              temp = tempArr.join(',');
            }
            val.notificationMethod = temp;
          }
        }
        return data;
      });
    }
  };

  function handleCancel() {
    setInitDataSource();
  }

  function handleSave() {
    const isEqual = _.isEqual(originSubscribeData, subscribeData);
    if (isEqual) {
      msg.warn(constant.VALIDMSG_NOTCHANGE, 'Alarm Subscribe');
      return;
    }
    const result = subscribeData.map(item => {
      const { alarmDefinitionUuid, notificationMethod, checked } = item;
      return {
        alarmDefId: alarmDefinitionUuid,
        notificationMethod,
        subscribeInd: checked ? 'Y' : 'N',
        subscribedBy: userId
      };
    });
    dispatch({
      type: `${moduleName}/saveSubscribeData`,
      payload: result
    }).then(res => {
      if (isSuccess(res)) {
        msg.info(res.message, 'Alarm Subscribe');
        onSearchSubscribe();
      } else if (res) {
        msg.error(res.message, 'Alarm Subscribe');
      }
    });
  }

  function handlePageNoChange(e, page) {
    setPageNo(page);
  }

  function handlePageSizeChange(e) {
    const { value } = e.target;
    setPageSize(value);
    setPageNo(0);
  }

  const columns = [
    {
      title: I18n.t('alarm.config.alarmName'),
      dataIndex: 'alarmName'
    },
    {
      title: I18n.t('alarm.config.eventType'),
      dataIndex: 'eventTypeDescription'
    },
    {
      title: I18n.t('alarm.config.alarmSeverity'),
      dataIndex: 'alarmSeverityDescription',
      width: 80
    },
    {
      title: I18n.t('alarm.config.status'),
      dataIndex: 'alarmStatus',
      width: 70
    }
  ];

  const ExtraCell = item => {
    const { notificationMethod, forceNotificationMethod } = item;

    return (
      <>
        {[EMAIL, SMS, ON_SCREEN].map(customItem => {
          //  merge the notificationMethod and forceNotificationMethod, it use to show which method has checked.
          const notificationMethodToArray = notificationMethod.split(',');
          const forceNotificationMethodToArray = forceNotificationMethod.split(',');
          const shouldCheckedMethod = [
            ...notificationMethodToArray,
            ...forceNotificationMethodToArray
          ];
          return (
            <FormControlLabel
              key={customItem}
              control={
                <Checkbox
                  checked={shouldCheckedMethod.includes(customItem)}
                  disabled={forceNotificationMethod.includes(customItem)}
                  value={customItem}
                  color="primary"
                  onClick={itemChildrenCheck(item)}
                />
              }
              label={customItem}
            />
          );
        })}
      </>
    );
  };

  const extraCell = {
    columns: [
      {
        title: I18n.t('alarm.config.notificationMethod'),
        dataIndex: '',
        width: 200
      }
    ],
    components: [
      {
        component: ExtraCell,
        key: '12',
        width: 200
      }
    ]
  };

  const rowSelection = {
    onChange: handleItemCheck
  };
  return (
    <>
      <Permission materialKey={materialKeys['M4-26']}>
        <TableToolbar
          handleGetDataByPage={handleAlarmSearch}
          fieldList={[
            ['AlarmName', 'alarmName', 'iptType'],
            ['Status', 'alarmStatus', 'dropdownType'],
            ['EventType', 'eventType', 'dropdownType'],
            ['AlarmSeverity', 'alarmSeverity', 'dropdownType']
          ]}
          dataList={{
            Status: { data: ['Enabled', 'Disabled'], type: 'normal' },
            EventType: {
              data: alarmInitInfo.eventType || [],
              type: 'keyVal',
              id: 0,
              val: 1
            },
            AlarmSeverity: {
              data: alarmInitInfo.alarmSeverity || [],
              type: 'keyVal',
              id: 0,
              val: 1
            }
          }}
        />
      </Permission>
      <IVHTable
        tableMaxHeight="calc(100% - 198px)"
        keyId="alarmDefinitionUuid"
        dataSource={subscribeData}
        columns={columns}
        extraCell={extraCell}
        rowSelection={rowSelection}
        handleChooseAll={handleChooseAll}
      />
      <Pagination
        count={subscribeSettingData.totalNum || 0}
        rowsPerPage={pageSize}
        page={pageNo}
        onChangePage={handlePageNoChange}
        onChangeRowsPerPage={handlePageSizeChange}
      />
      {isLength && (
        <>
          <Permission materialKey={materialKeys['M4-27']}>
            <Button color="primary" onClick={handleSave}>
              <Translate value="global.button.save" />
            </Button>
          </Permission>
          <Button color="primary" onClick={handleCancel}>
            <Translate value="global.button.cancel" />
          </Button>
        </>
      )}
    </>
  );
}

export default connect(({ alarmSubscribe, global }) => ({
  alarmSubscribe,
  global
}))(SubscribePage);
