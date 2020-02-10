import React, { useState, useEffect } from 'react';
import FilterIcon from '@material-ui/icons/FilterList';
import IconButton from '@material-ui/core/IconButton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { connect } from 'dva';
import _ from 'lodash';
import moment from 'moment';
import {
  SearchControl,
  SearchResult,
  ChooseChannels,
  ShowChosenOnly,
  ShowChosenOnlyMap
} from 'components/UVAP/Face/index';
import { BasicLayoutTitle, Download } from 'components/common';
import { isSuccess } from 'utils/helpers';
import { I18n } from 'react-i18nify';
import { PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
import { getStartTime, getEndTime } from 'utils/dateHelper';
import { getSearchParameters } from './utils';

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      overflowY: 'scroll',
      maxHeight: 'calc(100% - 42px)',
      height: 'calc(100% - 42px)'
    },
    filter: {
      marginLeft: '8px'
    }
  };
});

function FaceSearch(props) {
  const moduleName = 'faceSearch';
  const classes = useStyles();
  const { dispatch, global, faceSearch } = props;
  const { userId } = global;
  const {
    channelTreeData,
    groupsData,
    faceSearchFacesResult,
    eventsDataList,
    searchParameters,
    personImages,
    exportSearchResultData
  } = faceSearch;

  const [chooseChannelStatus, setChooseChannelStatus] = useState(false);
  const [showChosenOnly, setShowChosenOnly] = useState(false);
  const [showChosenOnlyMap, setShowChosenOnlyMap] = useState(false);
  const [filterStatus, setFilterStatus] = useState(true);
  const [chosenEventsData, setChosenEventsData] = useState([]);
  const [faceSearchParameters, setFaceSearchParameters] = useState({});
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [pageNo, setPageNo] = useState(PAGE_NUMBER);
  const [startTime, setStartTime] = useState(getStartTime());
  const [endTime, setEndTime] = useState(getEndTime());

  const getEventsList = (searchParameters, faceSearchParameters) => {
    dispatch({
      type: `${moduleName}/vapFrsEventsSearch`,
      payload: {
        type: 'vap.event.frs.group',
        time: {
          from: moment(searchParameters.time.from).valueOf(),
          to: moment(searchParameters.time.to).valueOf()
        },
        page: {
          index: searchParameters.page.index,
          size: searchParameters.page.size,
          sort: 'desc'
        },
        vaInstances: [
          {
            id: '',
            type: 'LIVE_VA',
            appId: ''
          }
        ],
        sources: [],
        data: getSearchParameters(faceSearchParameters)
      }
    });
  };

  useEffect(() => {
    return () => {
      // init the events search parameters in case that the search result kept after router change
      dispatch({
        type: `${moduleName}/initEventsParameters`
      });

      dispatch({
        type: `${moduleName}/clearVapFrsExportSearchData`
      });
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: `${moduleName}/getFrsGroups`,
      payload: ''
    });
  }, [dispatch]);

  const handleChooseChannelClose = () => {
    setChooseChannelStatus(false);
  };

  const handleChooseChannelControl = () => {
    setChooseChannelStatus(true);
  };

  const handleShowChosenOnlyClose = () => {
    setShowChosenOnly(false);
  };

  const handleChosenOnlyShow = () => {
    setShowChosenOnly(true);
  };

  const handleShowChosenOnlyCloseMap = () => {
    setShowChosenOnlyMap(false);
  };

  const handleChosenOnlyShowMap = () => {
    setShowChosenOnlyMap(true);
  };

  const chosenShowInMap = () => {
    setShowChosenOnlyMap(true);
  };

  function handleFilterToggle() {
    setFilterStatus(prev => !prev);
  }

  function getSearchHandle(e) {
    switch (e) {
      case 'channelControl':
        dispatch({
          type: `${moduleName}/getTreeData`,
          payload: userId
        });
        break;
      default:
        break;
    }
  }

  function handleSearch(e) {
    const { confidenceThreshold, groupId, identityNo, imgBase64, name } = e;
    dispatch({
      type: `${moduleName}/vapFrsFaceSearch`,
      payload: {
        confidenceThreshold,
        groupId,
        identityNo,
        imgBase64,
        name
      }
    }).then(res => {
      if (isSuccess(res)) {
        // const userIdentifyNo = _.get(res, 'data[0].personInfo.identityNo', '');
        if (_.isEmpty(res.data)) {
          dispatch({
            type: `${moduleName}/clearFaceSearchFacesResult`
          });
          return;
        }
        const personIds = res.data.map(item => item.personId);
        getEventsList(searchParameters, { ...e, personId: [personIds[0]] });
        setFaceSearchParameters({ ...e, personId: [personIds[0]] });
        dispatch({
          type: `${moduleName}/vapFrsGetPersonImages`,
          payload: personIds[0]
        });
      }
    });
  }

  function getChosenEventsData(e) {
    setChosenEventsData(e);
  }

  function getPersonInformation(e) {
    const personId = _.get(e, 'personId', '');
    setPageNo(0);
    if (!personId) return;
    dispatch({
      type: `${moduleName}/vapFrsGetPersonImages`,
      payload: personId
    });
    setFaceSearchParameters(prev => ({ ...prev, personId: [personId] }));
    getEventsList(searchParameters, {
      ...e,
      personId: [personId],
      confidenceThreshold: faceSearchParameters.confidenceThreshold
    });
  }

  const onChangePage = (e, page) => {
    setPageNo(page);
    getEventsList(_.merge(searchParameters, { page: { index: page } }), faceSearchParameters);
  };

  const onChangeRowsPerPage = e => {
    const { value } = e.target;
    setPageSize(value);
    setPageNo(0);
    getEventsList(
      _.merge(searchParameters, { page: { size: value, index: 0 } }),
      faceSearchParameters
    );
  };

  function handleDateAccept(time, value) {
    setPageNo(0);
    if (time === 'startTime') {
      setStartTime(value);
      getEventsList(
        _.merge(searchParameters, { time: { from: value }, page: { index: 0 } }),
        faceSearchParameters
      );
    } else if (time === 'endTime') {
      setEndTime(value);
      getEventsList(
        _.merge(searchParameters, { time: { to: value }, page: { index: 0 } }),
        faceSearchParameters
      );
    }
  }

  function getChannelGroup() {
    return dispatch({
      type: `${moduleName}/getChannelGroup`,
      payload: { userId }
    });
  }

  function searchChannnel(obj) {
    return dispatch({
      type: `${moduleName}/channelList`,
      payload: { ...obj, userId }
    });
  }

  function getChannel(groupId) {
    return dispatch({
      type: `${moduleName}/getChannelByChannelGroupId`,
      payload: { groupId }
    });
  }

  const handleDataChange = time => value => {
    if (time === 'startTime') {
      setStartTime(value);
    } else if (time === 'endTime') {
      setEndTime(value);
    }
  };

  function handleExport() {
    const count = _.get(eventsDataList, 'items.length', 0);
    if (!count) return;
    dispatch({
      type: `${moduleName}/vapFrsExportSearchData`,
      payload: {
        type: 'vap.event.frs.group',
        time: {
          from: moment(searchParameters.time.from).valueOf(),
          to: moment(searchParameters.time.to).valueOf()
        },
        page: {
          index: searchParameters.page.index,
          size: searchParameters.page.size,
          sort: 'desc'
        },
        vaInstances: [
          {
            id: '',
            type: 'LIVE_VA',
            appId: ''
          }
        ],
        sources: [],
        data: getSearchParameters(faceSearchParameters),
        count
      }
    });
  }

  return (
    <>
      <Download exportData={exportSearchResultData} isIconNeeded={false} />
      <BasicLayoutTitle titleName={I18n.t('menu.uvap.children.face.children.faceSearch')}>
        <IconButton size="small" className={classes.filter} onClick={handleFilterToggle}>
          <FilterIcon color="primary" />
        </IconButton>
      </BasicLayoutTitle>
      <div className={classes.wrapper}>
        <SearchControl
          startTime={startTime}
          endTime={endTime}
          filterStatus={filterStatus}
          searchResult={faceSearchFacesResult}
          groupsData={groupsData}
          personImages={personImages}
          getData={handleSearch}
          getSearchHandle={getSearchHandle}
          handleChooseChannelControl={handleChooseChannelControl}
          getPersonInformation={getPersonInformation}
          handleDateAccept={handleDateAccept}
          handleDataChange={handleDataChange}
        />
        <SearchResult
          onChangeRowsPerPage={onChangeRowsPerPage}
          onChangePage={onChangePage}
          pageSize={pageSize}
          pageNo={pageNo}
          getChosenData={getChosenEventsData}
          searchParameters={searchParameters}
          eventsDataList={eventsDataList}
          handleExport={handleExport}
          handleChosenOnlyShow={handleChosenOnlyShow}
          handleChosenOnlyShowMap={handleChosenOnlyShowMap}
        />
        <ChooseChannels
          channelData={channelTreeData}
          open={chooseChannelStatus}
          onClose={handleChooseChannelClose}
          getChannelGroup={getChannelGroup}
          getChannel={getChannel}
          searchChannnel={searchChannnel}
        />
        <ShowChosenOnly
          dataSource={chosenEventsData}
          open={showChosenOnly}
          onClose={handleShowChosenOnlyClose}
          chosenShowInMap={chosenShowInMap}
        />
        <ShowChosenOnlyMap
          dataSource={chosenEventsData}
          open={showChosenOnlyMap}
          onClose={handleShowChosenOnlyCloseMap}
        />
      </div>
    </>
  );
}

export default connect(({ faceSearch, global }) => ({ faceSearch, global }))(FaceSearch);
