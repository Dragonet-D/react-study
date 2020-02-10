import React, { useState, useEffect, useReducer, Fragment } from 'react';
import _ from 'lodash';
import { I18n } from 'react-i18nify';
import { DATE_FORMAT as DATE_FORMAT_DD_MM_YYYY } from 'commons/constants/const';
import { TextField, SingleSelect, DatePicker, Button, BasicLayoutTitle } from 'components/common';
import { VapCollapseBox } from 'components/UVAP';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import { VAP_COMMON } from 'commons/constants/commonConstant';
import IconButton from '@material-ui/core/IconButton';
import FilterIcon from '@material-ui/icons/FilterList';

import InputAdornment from '@material-ui/core/InputAdornment';
import Place from '@material-ui/icons/Place';

const useStyles = makeStyles(() => ({
  itemsStyle: {
    width: '300px'
  },
  itemsRow: {
    margin: '5px 0'
  },
  filter: {
    marginLeft: '8px'
  }
}));

function ReportFilterToolbar(props) {
  const classes = useStyles();
  const {
    reportTypeList,
    setParameters,
    getReportList,
    clearTableList,
    handleChooseChannelOpen,
    handleChooseFileOpen,
    multipleDeivceItems,
    setMultipleDeivceItems
  } = props;
  const [typeError, setTypeError] = useState(false);
  const [instanceTypeError, setInstanceTypeError] = useState(false);
  const [sortError, setSortError] = useState(false);
  const [filterBtnStatus, setFilterBtnStatus] = useState(true);
  const [searchContent, setSearchContent] = useState(true);
  const currentDate = new Date();

  const paramsAction = (params, action) => {
    switch (action.type) {
      case 'type':
        if (_.isNil(action.data) || action.data === '') {
          setTypeError(true);
          return params;
        } else {
          setTypeError(false);
          return { ...params, type: action.data };
        }
      case 'vainstancetype':
        if (_.isNil(action.data) || action.data === '') {
          setInstanceTypeError(true);
          return params;
        } else {
          setInstanceTypeError(false);
          return { ...params, vainstancetype: action.data };
        }
      case 'vainstanceid':
        return { ...params, vainstanceid: action.data };
      case 'srcprovider':
        return { ...params, srcprovider: action.data };
      case 'srcdeviceproviderid':
        return { ...params, srcdeviceproviderid: action.data };
      case 'srcdeviceid':
        return { ...params, srcdeviceid: action.data };
      case 'srcdevicechannelid':
        return { ...params, srcdevicechannelid: action.data };
      case 'srcfileid':
        return { ...params, srcfileid: action.data };
      case 'timefr':
        return { ...params, timefr: action.data };
      case 'timeto':
        return { ...params, timeto: action.data };
      case 'sort':
        if (_.isNil(action.data) || action.data === '') {
          setSortError(true);
          return params;
        } else {
          setSortError(false);
          return { ...params, sort: action.data };
        }
      case 'reset':
        return {
          timefr: currentDate.setHours(0, 0, 0, 0),
          timeto: currentDate.setHours(23, 59, 59, 999)
        };
      default:
        throw new Error();
    }
  };

  const [params, dispatchParams] = useReducer(paramsAction, {
    timefr: currentDate.setHours(0, 0, 0, 0),
    timeto: currentDate.setHours(23, 59, 59, 999),
    sort: VAP_COMMON.sort[1]
  });

  useEffect(() => {
    setParameters(params);
    const typeStatus = _.isNil(params.type) || params.type === '';
    const instanceTypeStatus = _.isNil(params.vainstancetype) || params.vainstancetype === '';
    const sortStatus = _.isNil(params.sort) || params.sort === '';
    setFilterBtnStatus(typeStatus || instanceTypeStatus || sortStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);
  useEffect(() => {
    dispatchParams({ type: 'srcfileid', data: '' });
    dispatchParams({ type: 'srcdeviceproviderid', data: '' });
    dispatchParams({ type: 'srcdeviceid', data: '' });
    dispatchParams({ type: 'srcdevicechannelid', data: '' });
    setMultipleDeivceItems([]);
  }, [params.srcprovider, setMultipleDeivceItems]);
  return (
    <Fragment>
      <BasicLayoutTitle titleName={I18n.t('menu.uvap.children.report.children.reportSearch')}>
        <IconButton
          size="small"
          className={classes.filter}
          onClick={() => setSearchContent(searchContent => !searchContent)}
        >
          <FilterIcon color="primary" />
        </IconButton>
      </BasicLayoutTitle>

      <VapCollapseBox filterStatus={searchContent}>
        {/* row 1 */}
        <Grid container spacing={4} alignItems="center" className={classes.itemsRow}>
          <Grid item className={classes.itemsStyle}>
            <SingleSelect
              label={I18n.t('vap.toolbar.report.reportType')}
              selectOptions={reportTypeList}
              onSelect={val => dispatchParams({ type: 'type', data: val })}
              value={params.type || ''}
              error={typeError}
              errorMessage={typeError ? I18n.t('vap.toolbar.report.reportTypeErrorMsg') : ''}
              fullWidth
              required
              keyValue
              dataIndex={{ name: 'name', value: 'reportType', key: '_key' }}
            />
          </Grid>

          <Grid item className={classes.itemsStyle}>
            <SingleSelect
              label={I18n.t('vap.toolbar.report.instanceType')}
              selectOptions={VAP_COMMON.vaInstanceType}
              onSelect={val => dispatchParams({ type: 'vainstancetype', data: val })}
              value={params.vainstancetype || ''}
              error={instanceTypeError}
              errorMessage={
                instanceTypeError ? I18n.t('vap.toolbar.report.instanceTypeErrorMsg') : ''
              }
              fullWidth
              required
            />
          </Grid>

          {/* <Grid item className={classes.itemsStyle}>
            <TextField
              label={I18n.t('vap.toolbar.report.instanceId')}
              placeholder={I18n.t('vap.toolbar.report.instanceIdPlaceholder')}
              value={params.vainstanceid || ''}
              onChange={e => dispatchParams({ type: 'vainstanceid', data: e.target.value })}
              fullWidth
            />
          </Grid> */}
        </Grid>

        {/* row 2 */}
        <Grid container spacing={4} alignItems="center" className={classes.itemsRow}>
          <Grid item className={classes.itemsStyle}>
            <SingleSelect
              label={I18n.t('vap.toolbar.report.provider')}
              selectOptions={VAP_COMMON.srcprovider}
              // selectOptions={['vap_device_stream']}
              onSelect={val => dispatchParams({ type: 'srcprovider', data: val })}
              value={params.srcprovider || ''}
              fullWidth
            />
          </Grid>
          {/* channel stream */}
          {params.srcprovider === VAP_COMMON.srcprovider[1] && (
            <Grid item className={classes.itemsStyle}>
              <TextField
                label={I18n.t('vap.toolbar.report.channel')}
                fullWidth
                value={multipleDeivceItems.map(item => item.channelName).join(';')}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" onClick={handleChooseChannelOpen}>
                        <Place />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
          )}
          {/* media file */}
          {params.srcprovider === VAP_COMMON.srcprovider[0] && (
            <Grid item className={classes.itemsStyle}>
              <TextField
                label={I18n.t('vap.toolbar.report.fileId')}
                fullWidth
                value={multipleDeivceItems.map(item => item.name).join(';')}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" onClick={handleChooseFileOpen}>
                        <Place />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
          )}
          {/* {params.srcprovider === VAP_COMMON.srcprovider[1] && (
            <Grid item className={classes.itemsStyle}>
              <TextField
                label={I18n.t('vap.toolbar.report.deviceProviderId')}
                placeholder={I18n.t('vap.toolbar.report.deviceProviderIdPlaceholder')}
                value={params.srcdeviceproviderid || ''}
                onChange={e =>
                  dispatchParams({ type: 'srcdeviceproviderid', data: e.target.value })
                }
                fullWidth
              />
            </Grid>
          )} */}
          {/* {params.srcprovider === VAP_COMMON.srcprovider[1] && (
            <Grid item className={classes.itemsStyle}>
              <TextField
                label={I18n.t('vap.toolbar.report.deviceId')}
                placeholder={I18n.t('vap.toolbar.report.deviceIdPlaceholder')}
                value={params.srcdeviceid || ''}
                onChange={e => dispatchParams({ type: 'srcdeviceid', data: e.target.value })}
                fullWidth
              />
            </Grid>
          )}
          {params.srcprovider === VAP_COMMON.srcprovider[1] && (
            <Grid item className={classes.itemsStyle}>
              <TextField
                label={I18n.t('vap.toolbar.report.channelId')}
                placeholder={I18n.t('vap.toolbar.report.channelIdPlaceholder')}
                value={params.srcdevicechannelid || ''}
                onChange={e => dispatchParams({ type: 'srcdevicechannelid', data: e.target.value })}
                fullWidth
              />
            </Grid>
          )} */}
          {/* {params.srcprovider === VAP_COMMON.srcprovider[0] && (
            <Grid item className={classes.itemsStyle}>
              <TextField
                label={I18n.t('vap.toolbar.report.fileId')}
                placeholder={I18n.t('vap.toolbar.report.fileIdPlaceholder')}
                value={params.srcfileid || ''}
                onChange={e => dispatchParams({ type: 'srcfileid', data: e.target.value })}
                fullWidth
              />
            </Grid>
          )} */}
        </Grid>
        {/* row 3 */}
        <Grid container spacing={4} alignItems="center" className={classes.itemsRow}>
          <Grid item className={classes.itemsStyle}>
            <DatePicker
              value={params.timefr}
              handleChange={val => {
                const newDate = new Date(val);
                dispatchParams({ type: 'timefr', data: newDate.setHours(0, 0, 0, 0) });
              }}
              label="From"
              maxDate={params.timeto || currentDate.setHours(23, 59, 59, 999)}
              // type="date"
              format={DATE_FORMAT_DD_MM_YYYY}
            />
          </Grid>
          <Grid item className={classes.itemsStyle}>
            <DatePicker
              value={params.timeto}
              handleChange={val => {
                const newDate = new Date(val);
                dispatchParams({ type: 'timeto', data: newDate.setHours(23, 59, 59, 999) });
              }}
              label="To"
              minDate={params.timefr || currentDate.setHours(0, 0, 0, 0)}
              // type="date"
              format={DATE_FORMAT_DD_MM_YYYY}
            />
          </Grid>
          <Grid item className={classes.itemsStyle}>
            <SingleSelect
              label={I18n.t('vap.toolbar.report.sort')}
              selectOptions={VAP_COMMON.sort}
              onSelect={val => dispatchParams({ type: 'sort', data: val })}
              value={params.sort || ''}
              error={sortError}
              errorMessage={sortError ? I18n.t('vap.toolbar.report.sortErrorMsg') : ''}
              fullWidth
              required
            />
          </Grid>
          <Grid item className={classes.itemsStyle}>
            <Button onClick={() => getReportList()} disabled={filterBtnStatus}>
              {I18n.t('global.button.filter')}
            </Button>
            <Button
              onClick={() => {
                clearTableList();
                dispatchParams({ type: 'reset' });
              }}
            >
              {I18n.t('global.button.reset')}
            </Button>
          </Grid>
        </Grid>
      </VapCollapseBox>
    </Fragment>
  );
}
export default ReportFilterToolbar;
