import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import Place from '@material-ui/icons/Place';
import Update from '@material-ui/icons/Update';
import NumberFormat from 'react-number-format';
import PlaylistAdd from '@material-ui/icons/PlaylistAdd';
import {
  Permission,
  TextField,
  DialogTitle,
  ToolTip,
  MapSearchLocation as Map
} from 'components/common';
import Sector from 'components/common/OtherComponents/Sector';
import materialKeys from 'utils/materialKeys';
import * as constant from 'commons/constants/commonConstant';
import _ from 'lodash';
import { I18n } from 'react-i18nify';
import msg from 'utils/messageCenter';
import style from './VMSChannel.module.less';

const initialVerificationObject = {
  isVerified: true,
  streamType: {
    invalid: false,
    message: ''
  },
  resolution: {
    invalid: false,
    message: ''
  },
  groupName: {
    invalid: false,
    message: ''
  },
  channelType: {
    invalid: false,
    message: ''
  },
  description: {
    invalid: false,
    message: ''
  },
  scheduleName: {
    invalid: false,
    message: ''
  },
  retentions: {
    invalid: false,
    message: ''
  },
  location: {
    invalid: false,
    message: ''
  },
  fieldOfView: {
    invalid: false,
    message: ''
  },
  fieldOfCoverage: {
    invalid: false,
    message: ''
  },
  address: {
    invalid: false,
    message: ''
  },
  direction: {
    invalid: false,
    message: ''
  },
  distance: {
    invalid: false,
    message: ''
  }
};
const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500
  },
  toolbarBG: {},
  toolbarLeft: {
    flex: '0 0 auto',
    paddingLeft: '15px',
    width: '90%'
  },
  toolbarSpace: {
    flex: '1 1 100%'
  },
  toolbarTitle: {
    fontSize: '16px'
  },

  tabsRoot: {},
  tabsIndicator: {},
  fovSector: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  maincolor: {
    color: theme.palette.primary.main
  },
  ruler: {
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    height: '5px'
  },
  rulerMark: {
    height: '100%',
    width: '1px',
    backgroundColor: theme.palette.primary.main,
    float: 'left'
  },
  tabRoot: {
    textTransform: 'initial',
    minWidth: 72,
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    // marginRight: theme.spacing.unit * 4,
    '&:hover': {
      opacity: 1
    },
    '&$tabSelected': {
      fontWeight: theme.typography.fontWeightMedium
    },
    '&:focus': {}
  }
});

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}
TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired
};

function TextMaskCustomDays(props) {
  const { inputRef, onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value
          }
        });
      }}
    />
  );
}
class DetailDialog extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      resultItem: {},
      scheduleList: [],
      scheduleItem: {},
      value: 0,
      flagShowMap: false,
      // flag_showViewAngle: false,
      ...initialVerificationObject
    };
    this.c_x = '';
    this.c_y = '';
    this.ctx = '';
    this.isMouseDown = false;
    this.oldData = {};
    this.oldScheduleItem = {};
  }

  handleChange = (e, value) => {
    this.setState({ value });
  };

  componentWillUnmount() {
    this.channelInfo = null;
  }

  componentWillReceiveProps(nextprops) {
    const { scheduleList, itemData } = this.props;
    const { resultItem } = this.state;
    if (!_.isEqual(nextprops.itemData, itemData)) {
      this.initResultItem(nextprops.itemData);
    }
    if (nextprops.scheduleList !== scheduleList && nextprops.scheduleList.length >= 0) {
      const scheduleList = nextprops.scheduleList.slice();
      scheduleList.push({
        scheduleId: '',
        name: '-- Please Select --'
      });
      if (resultItem && resultItem !== {} && resultItem.scheduleName) {
        const scheduleItem = scheduleList.filter(item => item.name === resultItem.scheduleName)[0];
        this.setState({ scheduleItem, resultItem });
      }
      this.setState({
        scheduleList
      });
    }
    // if (nextprops.isDelSchedule && nextprops.isDelSchedule !== isDelSchedule) {
    //   resultItem.scheduleName = '';
    //   this.setState({ resultItem });
    // }
    // if (nextprops.openEditDialog && !nextprops.openEditDialog) {
    //   this.clean();
    // }
  }

  componentDidMount() {
    const { itemData } = this.props;
    if (itemData && !_.isEqual(itemData, {})) this.initResultItem(itemData);
  }

  initResultItem = dataSouece => {
    const { scheduleList } = this.props;
    const item = Object.assign({}, dataSouece);
    const tempItem = {};
    tempItem.retentions = item.retention ? (item.retention / 86400 / 1000).toString() : '';
    tempItem.retentions = tempItem.retentions === '0' ? '' : tempItem.retentions;
    tempItem.groupName = item.groupName;
    tempItem.description = item.description;
    if (item.schedule && item.schedule.name) {
      tempItem.scheduleName = item.schedule.name;
      const scheduleItem = scheduleList.slice().filter(i => i.name === item.schedule.name)[0];
      this.oldScheduleItem = scheduleItem;
      this.setState({ scheduleItem });
    } else {
      tempItem.scheduleName = '';
    }
    const itemData = item.installation;
    if (itemData) {
      tempItem.address = itemData.address;
      tempItem.direction = itemData.direction;
      tempItem.distance = itemData.distance;
      tempItem.fieldOfCoverage = itemData.fieldOfCoverage;
      tempItem.fieldOfView = itemData.fieldOfView;
      if (itemData.latitude && itemData.longitude) {
        // tempItem.location = this.toDecimal16(parseFloat(itemData.longitude)) + ' - ' +  this.toDecimal16(parseFloat(itemData.latitude))
        tempItem.location = ` ${parseFloat(itemData.longitude)} - ${parseFloat(itemData.latitude)}`;
      }
      this.oldData = Object.assign({}, tempItem);
      this.setState({ resultItem: tempItem });
    }
  };
  onLocationKeydown = (prop, event) => {
    if (prop !== 'location') return;
    const { resultItem } = this.state;
    const this1 = this;
    const ee = event || window.event;
    if (ee && (ee.keyCode === 39 || ee.keyCode === 32)) {
      if (location.trim() !== '' && location.split('-').length < 2) {
        location = `${event.target.value} - `;
        resultItem[prop] = location;
        this1.setState({
          resultItem,
          isVerified: true,
          [prop]: {
            invalid: false,
            message: ''
          }
        });
      }
    }
  }; // check

  // save values inputed
  handleInput = prop => e => {
    const { resultItem, scheduleList } = this.state;
    const targetVal = e.target.value;
    if (prop === 'scheduleName') {
      let scheduleItem = [];
      if (targetVal !== '-- Please Select --') {
        resultItem[prop] = targetVal;
        for (const k in scheduleList) {
          if (scheduleList[k].name === targetVal) scheduleItem = scheduleList[k];
        }
      } else {
        resultItem[prop] = '';
      }
      this.setState({ scheduleItem });
    } else if (prop === 'location' && targetVal.trim() !== '') {
      const p1 = /[^\d.]/g;
      const p2 = /(\.\d{16})\d*$/g;
      const p4 = /(\.)(\d*)\1/g;
      const arr = targetVal.trim().split('-');
      let location = '';
      if (arr.length < 2) {
        location = targetVal
          .replace(p1, '')
          .replace(p2, '$1')
          .replace(p4, '$1$2');
        if (parseInt(location, 0) > 180) {
          return;
        }
        if (location.split('.')[1] && location.split('.')[1].length >= 16) {
          location += ' - ';
        }
      } else {
        const lon = arr[0]
          .replace(p1, '')
          .replace(p2, '$1')
          .replace(p4, '$1$2');
        if (parseInt(lon, 0) > 180 || (lon.split('.')[1] && lon.split('.')[1].length > 16)) {
          return;
        }
        const lat = arr[1]
          .replace(p1, '')
          .replace(p2, '$1')
          .replace(p4, '$1$2');
        if (parseInt(lat, 0) > 90 || (lat.split('.')[1] && lat.split('.')[1].length > 16)) {
          return;
        }
        location = `${lon} - ${lat}`;
      }
      resultItem[prop] = location;
    } else if (
      prop === 'fieldOfView' ||
      prop === 'fieldOfCoverage' ||
      prop === 'direction' ||
      prop === 'distance'
    ) {
      const keepNum = targetVal.replace(/[^\d.]/g, '');
      const keepFirst = keepNum.replace(/\.{2,}/g, '.');
      const val = keepFirst
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.');
      resultItem[prop] = val.replace(/^()*(\d+)\.(\d\d).*$/, '$1$2.$3');
    } else if (prop === 'retentions') {
      const r = /^\+?[1-9][0-9]*$/;
      if ((r.test(targetVal) && targetVal <= 90 && targetVal >= 0) || targetVal === '') {
        resultItem[prop] = targetVal;
      }
    } else {
      resultItem[prop] = targetVal;
    }
    this.setState({
      resultItem,
      isVerified: true,
      [prop]: {
        invalid: false,
        message: ''
      }
    });
  };

  isValid = temp => {
    for (const key in temp) {
      if (key === 'location') {
        if (temp.location.trim() !== '') {
          const arr = temp.location.split('-');
          const longrg = /^(-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,16})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/;
          const latreg = /^(-|\+)?([0-8]?\d{1}\.\d{0,16}|90\.0{0,6}|[0-8]?\d{1}|90)$/;
          if (arr.length > 1 && arr[0].trim() && arr[1].trim()) {
            if (!longrg.test(arr[0].trim()) || !latreg.test(arr[1].trim())) {
              this.setState({
                isVerified: false,
                [key]: {
                  invalid: true,
                  message: 'Out of Range'
                }
              });
            }
          } else {
            this.setState({
              isVerified: false,
              [key]: {
                invalid: true,
                message: 'Please enter complete'
              }
            });
          }
        }
      } else if (key === 'retentions') {
        if (temp.retentions === '' && temp.scheduleName.trim() !== '') {
          this.setState({
            isVerified: false,
            retentions: {
              invalid: true,
              message: constant.VALIDMSG_NOTNULL
            }
          });
        }
        if ((temp.retentions !== '' && temp.retentions <= 0) || temp.retentions > 90) {
          this.setState({
            isVerified: false,
            retentions: {
              invalid: true,
              message: 'Out of Range 1~90'
            }
          });
        }
      }
    }
  };

  toDecimal2(x) {
    const validX = parseFloat(x);
    if (isNaN(validX)) {
      return false;
    }
    const f = Math.round(x * 100) / 100;
    let s = f.toString();
    let rs = s.indexOf('.');
    if (rs < 0) {
      rs = s.length;
      s += '.';
    }
    while (s.length <= rs + 2) {
      s += '0';
    }
    return s;
  }

  toDecimal16(x) {
    const validX = parseFloat(x);
    if (isNaN(validX)) {
      return false;
    }
    // const f = Math.round(x * 100) / 100;
    // let s = f.toString();
    let s = x.toString();
    let rs = s.indexOf('.');
    if (rs < 0) {
      rs = s.length;
      s += '.';
    }
    while (s.length <= rs + 16) {
      s += '0';
    }
    return s;
  }

  showMap = () => {
    this.setState(state => ({ flagShowMap: !state.flagShowMap }));
  };

  clean = () => {
    this.setState({
      resultItem: {},
      flagShowMap: false,
      value: 0,
      // flag_showViewAngle: false,
      ...initialVerificationObject
    });
  };

  cancel = () => {
    const { closeDialog } = this.props;
    closeDialog();
    this.clean();
  };

  handleLocate = mapInfo => {
    if (mapInfo) {
      const { resultItem } = this.state;
      resultItem.address = mapInfo.address;
      resultItem.location = `${mapInfo.longitude.toFixed(16)} -  ${mapInfo.latitude.toFixed(16)}`;
      this.setState({ resultItem });
    }
  };

  save = () => {
    const { scheduleItem, resultItem } = this.state;
    const { handleSubmit, itemData } = this.props;
    // NOT CHANGE VALIDATION
    // console.log(_.isEqual(this.oldData, resultItem), this.oldData, resultItem);
    if (_.isEqual(this.oldData, resultItem)) {
      // if schedule is same
      if (
        this.oldScheduleItem &&
        this.oldScheduleItem.weekPeriod &&
        scheduleItem.weekPeriod &&
        (_.isEqual(this.oldScheduleItem, scheduleItem) ||
          _.isEqual(this.oldScheduleItem.weekPeriod, scheduleItem.weekPeriod))
      ) {
        msg.warn(constant.VALIDMSG_NOTCHANGE, '');
        return;
      }
      if (!this.oldScheduleItem || !this.oldScheduleItem.weekPeriod || !scheduleItem.weekPeriod) {
        msg.warn(constant.VALIDMSG_NOTCHANGE, '');
        return;
      }
    }
    const tempValid = {
      scheduleName: resultItem.scheduleName || '',
      location: resultItem.location || '',
      retentions: resultItem.retentions || ''
    };
    const temp = {
      scheduleName: resultItem.scheduleName || '',
      description: resultItem.description || '',
      location: resultItem.location || '',
      retentions: parseInt(resultItem.retentions, 0) * 86400 * 1000 || '',
      fieldOfView: resultItem.fieldOfView || '',
      fieldOfCoverage: resultItem.fieldOfCoverage || '',
      address: resultItem.address || '',
      direction: resultItem.direction || '',
      distance: resultItem.distance || ''
    };
    // NOT NULL VALIDATION
    this.isValid(tempValid);
    setTimeout(() => {
      const { isVerified } = this.state;
      if (!isVerified) return;
      const locationArr = temp.location.split('-');
      temp.deviceId = itemData.deviceId;
      temp.channelId = itemData.channelId;
      if (temp.location) {
        // temp.latitude = this.toDecimal16(locationArr[1].trim());
        // temp.longitude = this.toDecimal16(locationArr[0].trim());
        temp.latitude = locationArr[1].trim();
        temp.longitude = locationArr[0].trim();
      }
      temp.fieldOfView = temp.fieldOfView ? this.toDecimal2(temp.fieldOfView) : '';
      temp.fieldOfCoverage = temp.fieldOfCoverage ? this.toDecimal2(temp.fieldOfCoverage) : '';
      temp.direction = temp.direction ? this.toDecimal2(temp.direction) : '';
      temp.distance = temp.distance ? this.toDecimal2(temp.distance) : '';
      handleSubmit(temp);
    }, 0);
  };

  render() {
    const { classes, itemData, openDialog, openStorageDialog } = this.props;
    const {
      scheduleName,
      description,
      location,
      retentions,
      fieldOfView,
      fieldOfCoverage,
      direction,
      address,
      distance,
      resultItem,
      flagShowMap,
      scheduleItem,
      scheduleList,
      value
    } = this.state;
    let streamInfos = itemData && itemData.streamInfos;
    let resolution = '';
    if (streamInfos) {
      if (typeof streamInfos === 'string') {
        streamInfos = JSON.parse(streamInfos);
      }
      resolution = streamInfos && streamInfos[0] ? streamInfos[0].resolution : '';
    }
    return (
      <Dialog fullWidth open={openDialog}>
        <DialogTitle>{I18n.t('uvms.channel.channelDetails')}</DialogTitle>
        <DialogContent style={{ maxHeight: 500 }}>
          <div className={classes.root}>
            <Tabs
              value={value}
              onChange={this.handleChange}
              indicatorColor="secondary"
              textColor="secondary"
              classes={{ root: classes.tabsRoot }}
            >
              <Tab
                disableRipple
                classes={{
                  root: classes.tabRoot,
                  selected: classes.tabSelected
                }}
                label={I18n.t('uvms.channel.basicInfo')}
              />
              <Tab
                disableRipple
                classes={{
                  root: classes.tabRoot,
                  selected: classes.tabSelected
                }}
                label={I18n.t('uvms.channel.install')}
              />
            </Tabs>
          </div>
          <SwipeableViews axis="x-reverse" index={value}>
            <TabContainer dir="x">
              <Typography color="textPrimary" variant="subtitle2" component="div">
                {I18n.t('uvms.channel.basicInfo')}
              </Typography>
              <FormControl fullWidth>
                <TextField
                  disabled
                  label={I18n.t('uvms.channel.parentDevice')}
                  placeholder={I18n.t('uvms.channel.parentDevice')}
                  defaultValue={itemData && itemData.parentDevice}
                  margin="dense"
                />
                <TextField
                  disabled
                  label={I18n.t('uvms.channel.deviceUri')}
                  placeholder={I18n.t('uvms.channel.deviceUri')}
                  inputProps={{ maxLength: '50' }}
                  defaultValue={itemData && itemData.deviceUri}
                  margin="dense"
                />
                <TextField
                  disabled
                  label={I18n.t('uvms.channel.channelName')}
                  placeholder={I18n.t('uvms.channel.channelName')}
                  defaultValue={itemData && itemData.channelName}
                  margin="dense"
                />
                <TextField
                  disabled
                  label={I18n.t('uvms.channel.streamType')}
                  value={resultItem.streamType ? resultItem.streamType : 'Main'}
                  margin="normal"
                />
                <TextField
                  disabled
                  label={I18n.t('uvms.channel.resolution')}
                  placeholder={I18n.t('uvms.channel.resolution')}
                  inputProps={{ maxLength: '50' }}
                  value={resolution}
                  onChange={this.handleInput('direction')}
                  margin="dense"
                />
                <TextField
                  disabled
                  label={I18n.t('uvms.channel.channelType')}
                  placeholder={I18n.t('uvms.channel.channelType')}
                  inputProps={{ maxLength: '50' }}
                  value={
                    itemData && itemData.capabilities && itemData.capabilities.indexOf('ptz') >= 0
                      ? 'PTZ'
                      : 'Fix Camera'
                  }
                  onChange={this.handleInput('direction')}
                  margin="dense"
                />
                {/* <TextField
                  disabled
                  label="Group Name"
                  value={resultItem.groupName ? resultItem.groupName : ''}
                  margin="normal"
                /> */}

                <TextField
                  error={description.invalid}
                  helperText={description.message}
                  label={I18n.t('uvms.channel.description')}
                  placeholder={I18n.t('uvms.channel.description')}
                  inputProps={{ maxLength: '50' }}
                  value={resultItem.description ? resultItem.description : ''}
                  onChange={this.handleInput('description')}
                  margin="dense"
                />

                <Permission materialKey={materialKeys['M4-73']}>
                  <Typography
                    color="textPrimary"
                    variant="subtitle2"
                    component="div"
                    style={{ marginTop: 35 }}
                  >
                    {I18n.t('uvms.channel.storageInfo')}
                  </Typography>
                  <TextField
                    select
                    error={scheduleName.invalid}
                    helperText={scheduleName.message}
                    label={I18n.t('uvms.channel.storagePlan')}
                    value={scheduleItem && scheduleItem.name ? scheduleItem.name : ''}
                    onChange={this.handleInput('scheduleName')}
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <div
                          style={{
                            width: resultItem.scheduleName ? 120 : 60
                          }}
                        >
                          <Permission materialKey={materialKeys['M5-2']}>
                            <ToolTip title="Update Schedule">
                              <IconButton
                                aria-label="View"
                                onClick={() => openStorageDialog('update', scheduleItem)}
                                style={{
                                  float: 'left',
                                  padding: 7,
                                  display: resultItem.scheduleName ? 'block' : 'none'
                                }}
                              >
                                <Update />
                              </IconButton>
                            </ToolTip>
                          </Permission>
                          <Permission materialKey={materialKeys['M5-1']}>
                            <ToolTip title="Add New Schedule">
                              <IconButton
                                aria-label="Add New"
                                onClick={() => openStorageDialog('create')}
                                style={{ float: 'left', padding: 7 }}
                              >
                                <PlaylistAdd />
                              </IconButton>
                            </ToolTip>
                          </Permission>
                        </div>
                      )
                    }}
                  >
                    {scheduleList &&
                      scheduleList.map(option => (
                        <MenuItem key={option.scheduleId} value={option.name}>
                          {option.name}
                        </MenuItem>
                      ))}
                  </TextField>
                  <FormControl error={retentions.invalid}>
                    <InputLabel>{I18n.t('uvms.channel.videoFileStorageExpiredTime')}</InputLabel>
                    <Input
                      value={resultItem.retentions ? resultItem.retentions : ''}
                      onChange={this.handleInput('retentions')}
                      endAdornment={
                        <InputAdornment
                          position="end"
                          className={retentions.invalid ? style.errIpt : ''}
                        >
                          <label className={retentions.invalid ? style.errIpt : ''}>
                            {I18n.t('uvms.channel.days')}
                          </label>
                        </InputAdornment>
                      }
                    />
                    <FormHelperText>{retentions.message || '1~90'}</FormHelperText>
                  </FormControl>
                </Permission>
              </FormControl>
            </TabContainer>
            <TabContainer dir="x">
              <FormControl fullWidth>
                <Typography color="textPrimary" variant="subtitle2" component="div">
                  {I18n.t('uvms.channel.installationInfo')}
                </Typography>
                <FormControl error={address.invalid}>
                  <InputLabel htmlFor="adornment-password">
                    {I18n.t('uvms.channel.address')}
                  </InputLabel>
                  <Input
                    inputProps={{ maxLength: '50' }}
                    value={resultItem.address ? resultItem.address : ''}
                    onChange={this.handleInput('address')}
                    margin="dense"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton onClick={this.showMap}>
                          <Place />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText>{address.message}</FormHelperText>
                </FormControl>
                <div
                  style={{
                    display: flagShowMap ? 'block' : 'none',
                    height: 200,
                    backgroundColor: '#23304f'
                  }}
                >
                  <Map getMapInformation={this.handleLocate} />
                </div>

                <FormControl error={location.invalid}>
                  <InputLabel htmlFor="formatted-text-mask-input">
                    {I18n.t('uvms.channel.location')}
                  </InputLabel>
                  <Input
                    value={resultItem.location ? resultItem.location : ''}
                    onChange={this.handleInput('location')}
                    id="formatted-text-mask-input"
                    // inputComponent={TextMaskCustom}
                    style={{ width: '100%' }}
                    onKeyDown={this.onLocationKeydown}
                    autoComplete="off"
                  />
                  <FormHelperText>{location.message}</FormHelperText>
                </FormControl>
                {/* <TextField
                  error={fieldOfView.invalid}
                  helperText={fieldOfView.message}
                  label="Field of view"
                  placeholder="Field of view"
                  inputProps={{ maxLength: "50" }}
                  value={resultItem.fieldOfView ? resultItem.fieldOfView : ""}
                  onChange={this.handleInput("fieldOfView")}
                  margin="dense"
                /> */}
                <FormControl error={fieldOfView.invalid}>
                  <InputLabel>{I18n.t('uvms.channel.fieldOfView')}</InputLabel>
                  <Input
                    placeholder={I18n.t('uvms.channel.fieldOfView')}
                    inputProps={{ maxLength: '50' }}
                    value={resultItem.fieldOfView ? resultItem.fieldOfView : ''}
                    onChange={this.handleInput('fieldOfView')}
                    margin="dense"
                    endAdornment={
                      <InputAdornment
                        position="end"
                        className={fieldOfView.invalid ? style.errIpt : ''}
                      >
                        <label className={fieldOfView.invalid ? style.errIpt : ''}>。</label>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText>{fieldOfView.message}</FormHelperText>
                </FormControl>
                <FormControl error={fieldOfCoverage.invalid}>
                  <InputLabel>{I18n.t('uvms.channel.fieldOfCoverage')}</InputLabel>
                  <Input
                    placeholder={I18n.t('uvms.channel.fieldOfCoverage')}
                    inputProps={{ maxLength: '50' }}
                    value={resultItem.fieldOfCoverage ? resultItem.fieldOfCoverage : ''}
                    onChange={this.handleInput('fieldOfCoverage')}
                    margin="dense"
                    endAdornment={
                      <InputAdornment
                        position="end"
                        className={fieldOfCoverage.invalid ? style.errIpt : ''}
                      >
                        <label className={fieldOfCoverage.invalid ? style.errIpt : ''}>。</label>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText>{fieldOfCoverage.message}</FormHelperText>
                </FormControl>
                <FormControl error={direction.invalid}>
                  <InputLabel>{I18n.t('uvms.channel.direction')}</InputLabel>
                  <Input
                    placeholder={I18n.t('uvms.channel.direction')}
                    inputProps={{ maxLength: '50' }}
                    value={resultItem.direction ? resultItem.direction : ''}
                    onChange={this.handleInput('direction')}
                    margin="dense"
                    endAdornment={
                      <InputAdornment
                        position="end"
                        className={direction.invalid ? style.errIpt : ''}
                      >
                        <label className={direction.invalid ? style.errIpt : ''}>。</label>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText>{direction.message}</FormHelperText>
                </FormControl>
                <FormControl error={address.invalid}>
                  <InputLabel>{I18n.t('uvms.channel.distance')}</InputLabel>
                  <Input
                    inputProps={{ maxLength: '50' }}
                    value={resultItem.distance ? resultItem.distance : ''}
                    onChange={this.handleInput('distance')}
                    margin="dense"
                    endAdornment={
                      <InputAdornment
                        position="end"
                        className={distance.invalid ? style.errIpt : ''}
                      >
                        <label className={distance.invalid ? style.errIpt : ''}>m</label>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText>{address.message}</FormHelperText>
                </FormControl>
                <div className={classes.fovSector}>
                  <Sector
                    radius={parseFloat(resultItem.distance, 0)} // 150
                    offsetAngle={
                      parseInt(resultItem.direction, 10) 
                      // 270 -
                      // parseInt(resultItem.fieldOfView, 10) / 2
                    }
                    angle={parseInt(resultItem.fieldOfView, 10)}
                    color={classes.maincolor.color}
                  />
                  <div
                    className={classes.ruler}
                    style={{ width: resultItem.distance * 2 || 0 }}
                    hidden={!resultItem.distance || resultItem.distance < 40}
                  >
                    <div className={classes.rulerMark} style={{ position: 'relative', left: '0%' }}>
                      <div style={{ position: 'absolute', width: '50px', top: '-20px' }}>0 m</div>
                    </div>
                    <div
                      className={classes.rulerMark}
                      style={{ position: 'relative', left: 'calc(100% - 2px)' }}
                    >
                      <div style={{ position: 'absolute', width: '50px', top: '-20px' }}>
                        {`${resultItem.distance * 2} m`}
                      </div>
                    </div>
                  </div>
                </div>
              </FormControl>
            </TabContainer>
          </SwipeableViews>
        </DialogContent>
        <DialogActions>
          <Permission materialKey={materialKeys['M4-72']}>
            <Button onClick={this.save} color="primary">
              {I18n.t('global.button.save')}
            </Button>
          </Permission>
          <Button onClick={this.cancel} color="primary" autoFocus>
            {I18n.t('global.button.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
export default withStyles(styles)(DetailDialog);
