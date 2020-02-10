import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Link } from '@material-ui/core';
import { I18n } from 'react-i18nify';
import { IVHTable, Pagination, Calendar } from 'components/common';
import moment from 'moment';
import { DATE_FORMAT_DATE_PICKER, PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';

const useStyles = makeStyles(theme => {
  return {
    title: {
      padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
      marginTop: theme.spacing(2)
    },
    renderItem: {
      height: '24px',
      width: '24px',
      borderRadius: '12px',
      position: 'relative',
      top: '-17px',
      left: 'calc(50% - 12px)',
      pointerEvents: 'none'
    },
    Levels: {
      backgroundColor: `${theme.palette.primary.main}22 !important`
    },
    Levelm: {
      backgroundColor: `${theme.palette.primary.main}55 !important`
    },
    Levell: {
      backgroundColor: `${theme.palette.primary.main}99 !important`
    }
  };
});

function RecordingRender(props) {
  const classes = useStyles();
  const { itemData, dispatch, userId, setTime } = props;

  const { channelId, channelName, deviceId, groupName, parentDevice } = itemData;
  const [dataSource, setdataSource] = React.useState({});
  const [pageSize, setPageSize] = React.useState(PAGE_SIZE);
  const [pageNo, setPageNo] = React.useState(PAGE_NUMBER);
  const [itemStorage, setitemStorage] = React.useState(new Map());
  const [renderList, setrenderList] = React.useState([]);
  // const [selectDate, setselectDate] = React.useState(moment());

  React.useEffect(() => {
    dispatch({
      type: 'VMSPlayback/getRecords',
      payload: {
        channelId,
        channelName,
        deviceId,
        psize: 9999,
        pageNo,
        descriptionFields: {
          'User ID': userId,
          'Channel Name': channelName,
          'Parent Device': parentDevice,
          'Group Name': groupName
        }
      }
    })
      .then(res => {
        if (res) {
          setdataSource(res);
        }
      })
      .then(() => {
        setrenderList(itemStorage.get(moment().format('YYYY-MM-DD')));
      });
  }, []);

  React.useEffect(() => {}, [dataSource]);

  function onSelect(date) {
    setrenderList(itemStorage.get(date.format('YYYY-MM-DD')));
  }

  const columns = [
    {
      title: I18n.t('uvms.playback.recordingRender.startTime'),
      dataIndex: 'start',
      renderItem: item => {
        return (
          <Link
            onClick={() => {
              setTime({
                type: 'startTime',
                time: moment(new Date(parseInt(item.start, 10))).second(0)
              });
            }}
          >
            {moment(new Date(parseInt(item.start, 10))).format(DATE_FORMAT_DATE_PICKER)}
          </Link>
        );
      }
    },
    {
      title: I18n.t('uvms.playback.recordingRender.endTime'),
      dataIndex: 'end',
      renderItem: item => {
        return (
          <Link
            onClick={() => {
              setTime({
                type: 'endTime',
                time: moment(new Date(parseInt(item.end, 10))).second(0)
              });
            }}
          >
            {moment(new Date(parseInt(item.end, 10))).format(DATE_FORMAT_DATE_PICKER)}
          </Link>
        );
      }
    }
  ];

  function onChangePage(e, page) {
    setPageNo(page);
  }

  function onChangeRowsPerPage(e) {
    const { value } = e.target;
    setPageSize(value);
  }

  function dateCellRender(value) {
    const listData = getListData(value);
    if (listData) {
      return <div className={`${classes.renderItem} ${classes[`Level${listData}`]}`} />;
    }
  }

  function setLevel(data) {
    if (data.length < 3) {
      return 's';
    } else if (data.length >= 3 && data.length < 6) {
      return 'm';
    } else if (data.length >= 6) {
      return 'l';
    } else {
      return null;
    }
  }

  function getListData(value) {
    const time = moment(value);
    const range = [
      time.subtract(1, 'day').format('YYYY-MM-DD'),
      time.add(2, 'day').format('YYYY-MM-DD')
    ];
    const list = dataSource.recordPeriod;
    const result = [];
    if (list && list.length) {
      list.forEach(x => {
        if (moment(moment(parseInt(x.start, 10)).format('YYYY-MM-DD')).isBetween(...range)) {
          result.push(x);
        }
      });
    }
    if (result.length) {
      itemStorage.set(value.format('YYYY-MM-DD'), result);
      setitemStorage(itemStorage);
      return setLevel(result);
    }

    // let listData;
    // switch (value.date()) {
    //   case 1:
    //     listData = 's';
    //     break;
    //   case 2:
    //     listData = 'm';
    //     break;
    //   case 3:
    //     listData = 'l';
    //     break;
    //   default:
    // }
    // return listData || null;
  }

  return (
    <div style={{ width: '700px' }}>
      <Typography color="textSecondary" className={classes.title} component="span" variant="h6">
        {`${I18n.t('uvms.playback.recordingRender.title')} ${itemData.channelName}`}
      </Typography>
      <Calendar
        dateCellRender={dateCellRender}
        fullscreen={false}
        onSelect={onSelect}
        onChange={onSelect}
      />
      <IVHTable
        tableMaxHeight="calc(100% - 98px)"
        keyId="start"
        columns={columns}
        dataSource={renderList || []}
      />
      <Pagination
        page={pageNo}
        rowsPerPage={pageSize}
        count={(renderList && renderList.length) || 0}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
      />
    </div>
  );
}

export default RecordingRender;
