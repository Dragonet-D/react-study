import React, { memo, useState } from 'react';
import { SingleSelect, TextField, TableToolbar, Input, SnapShot } from 'components/common';
import Button from '@material-ui/core/Button';
import { I18n } from 'react-i18nify';
import _ from 'lodash';
import IconButton from '@material-ui/core/IconButton';
import LocationIcon from '@material-ui/icons/LocationOn';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import C from 'classnames';
import CardMedia from '@material-ui/core/CardMedia';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import Collapse from '@material-ui/core/Collapse';
import InputAdornment from '@material-ui/core/InputAdornment';
import Clear from '@material-ui/icons/Clear';
import ConfidenceScore from '../ConfidenceScore';
import DatePicker from './DatePicker';
import EnrolledFace from './EnrolledFace';
import { getRequestImageType, getGroupIdByName } from '../utils';
import styles from './SearchControl.module.less';

const SearchControl = memo(props => {
  const {
    handleChooseChannelControl,
    getSearchHandle,
    groupsData,
    getData,
    searchResult,
    filterStatus,
    getPersonInformation,
    personImages,
    handleDateAccept,
    handleDataChange,
    startTime,
    endTime
  } = props;

  const [resultStatus, setResultStatus] = useState(true);
  const [image, setImage] = useState('');
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [userName, setUserName] = useState('');
  const [nric, setNric] = useState('');
  const [score, setScore] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(false);

  const isSearchDisabled = _.isEmpty(image) && _.isEmpty(nric) && _.isEmpty(userName);

  const showChooseChannelControl = () => {
    handleChooseChannelControl(true);
    getSearchHandle('channelControl');
  };

  const handleSearch = () => {
    setResultStatus(true);
    getData({
      groupId: getGroupIdByName(groupsData, groupName, 'id'),
      confidenceThreshold: score,
      identityNo: nric,
      imgBase64: getRequestImageType(image),
      name: userName
    });
  };

  const previewClose = () => {
    setOpen(false);
  };

  const getImageData = image => {
    setImage(image);
    setUploadStatus(false);
  };

  const handlePreview = () => {
    setOpen(true);
  };

  const handleDelete = () => {
    setImage('');
  };

  const handleNricChange = e => {
    const { value } = e.target;
    setNric(value);
  };

  const getScore = e => {
    setScore(e);
  };

  const handleClearGroup = () => {
    setGroupName('');
  };

  function handleUpload() {
    setUploadStatus(true);
  }

  function handlePersonName(e) {
    const { value } = e.target;
    setUserName(value);
  }
  return (
    <div className={styles.wrapper}>
      {uploadStatus && (
        <SnapShot getSnapShotImage={getImageData} open handleClose={() => setUploadStatus(false)} />
      )}
      <Collapse in={filterStatus} className={styles.search_control}>
        <div className={styles.top}>
          <SingleSelect
            classes={{ icon: groupName ? styles.select_icon_hide : styles.select_icon_show }}
            label={I18n.t('vap.face.faceSearch.group')}
            className={styles.flex_1}
            selectOptions={groupsData.map(item => item.name)}
            value={groupName}
            onSelect={e => setGroupName(e)}
            input={
              <Input
                endAdornment={
                  <InputAdornment
                    position="end"
                    className={groupName ? styles.clear_show : styles.clear_hide}
                  >
                    <IconButton size="small" onClick={handleClearGroup}>
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                }
              />
            }
          />
          <TextField
            label={I18n.t('vap.label.personName')}
            placeholder={I18n.t('vap.label.personName')}
            fullWidth
            value={userName}
            className={styles.rnic}
            onChange={handlePersonName}
          />
          <TextField
            label={I18n.t('vap.face.faceEnrollment.identifyNo')}
            placeholder={I18n.t('vap.face.faceEnrollment.identifyNo')}
            fullWidth
            value={nric}
            onChange={handleNricChange}
            className={styles.rnic}
          />
        </div>
        <div className={styles.middle}>
          <ConfidenceScore className={styles.flex_1} getValue={getScore} defaultValue={score} />
          <div className={C(styles.flex_1, styles.image_wrapper)}>
            <div className={styles.upload}>
              <Button size="small" color="secondary" variant="contained" onClick={handleUpload}>
                {I18n.t('vap.face.faceSearch.uploadFace')}
              </Button>
            </div>
            {image && (
              <div className={styles.image_content}>
                <div className={styles.mask}>
                  <IconButton size="small" onClick={handlePreview}>
                    <VisibilityIcon color="primary" />
                  </IconButton>
                  <IconButton size="small" onClick={handleDelete}>
                    <DeleteIcon color="primary" />
                  </IconButton>
                </div>
                <CardMedia image={image} className={styles.image} />
              </div>
            )}
          </div>
          <Button
            disabled={isSearchDisabled}
            size="small"
            color="secondary"
            variant="contained"
            onClick={handleSearch}
          >
            {I18n.t('vap.button.search')}
          </Button>
        </div>
        <div className={styles.bottom}>
          <div className={styles.bottom_left}>
            <div className={styles.date}>
              <Typography color="textSecondary" component="span" className={styles.date_label}>
                {I18n.t('vap.face.faceSearch.period')}
              </Typography>
              <DatePicker
                handleDataChange={handleDataChange}
                startTime={startTime}
                endTime={endTime}
                handleDateAccept={handleDateAccept}
              />
            </div>
            <div className={styles.search_wrapper}>
              <Typography color="textSecondary" className={styles.search_label}>
                {I18n.t('vap.face.faceSearch.faceAttributes')}
              </Typography>
              <div>
                <TableToolbar
                  isSearchButtonNeed={false}
                  handleGetDataByPage={() => {}}
                  fieldList={[
                    [I18n.t('vap.face.faceSearch.gender'), 'gender', 'iptType'],
                    [I18n.t('vap.face.faceSearch.region'), 'region', 'iptType'],
                    [I18n.t('vap.face.faceSearch.age'), 'age', 'iptType']
                  ]}
                />
              </div>
            </div>
            <div className={styles.channel}>
              <Typography color="textSecondary">
                {I18n.t('vap.face.faceSearch.channelID')}
              </Typography>
              <IconButton size="medium" onClick={showChooseChannelControl}>
                <LocationIcon />
              </IconButton>
            </div>
          </div>
        </div>
      </Collapse>
      {resultStatus && !_.isEmpty(searchResult) ? (
        <EnrolledFace
          getPersonInformation={getPersonInformation}
          personImages={personImages}
          searchResult={searchResult}
          className={styles.result}
        />
      ) : (
        <div className={styles.result} />
      )}
      <Dialog open={open} onClose={previewClose}>
        <img alt="Avatar" style={{ width: '100%' }} src={image} />
      </Dialog>
    </div>
  );
});

SearchControl.defaultProps = {
  handleChooseChannelControl: () => {},
  getSearchHandle: () => {},
  groupsData: [],
  getData: () => {},
  searchResult: {},
  filterStatus: false,
  getPersonInformation: () => {},
  handleDateAccept: () => {}
};

SearchControl.propTypes = {
  handleChooseChannelControl: PropTypes.func,
  getSearchHandle: PropTypes.func,
  groupsData: PropTypes.array,
  getData: PropTypes.func,
  searchResult: PropTypes.any,
  filterStatus: PropTypes.bool,
  getPersonInformation: PropTypes.func,
  handleDateAccept: PropTypes.func
};

export default SearchControl;
