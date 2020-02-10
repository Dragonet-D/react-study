import React, { useState, useEffect, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { I18n } from 'react-i18nify';
import PropTypes from 'prop-types';
import { TextField, Button, MapSearchLocation as MapMiniMap } from 'components/common';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Place from '@material-ui/icons/Place';
import Collapse from '@material-ui/core/Collapse';
import { ROOT_NODE_ID } from '../utils';

const useStyles = makeStyles(() => {
  return {
    infoContainer: {
      display: 'flex',
      alignItems: 'center'
    },
    textField_details: {
      flex: 2,
      marginRight: '15px'
    },
    button_edit: {
      flex: 1
    },
    button_each: {
      marginRight: '15px'
    },
    detailsBox: { marginLeft: '15px', marginRight: '15px', position: 'relative' },
    mapContainer: { width: '100%', height: '400px' }
  };
});

function ChannelGroupInfo(props) {
  const classes = useStyles();
  const { groupDetails, addPageStatus, handleUpdateGroup, userId } = props;

  const [name, setName] = useState('');
  const [oldData, setOldData] = useState({});
  const [nameError, setNameError] = useState(false);
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState(false);
  const [parentGroup, setParentGroup] = useState('');
  // const [parentGroupError, setParentGroupError] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [address, setAddress] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [mapStatus, setMapStatus] = useState(false);

  useEffect(() => {
    setName(groupDetails.groupName || '');
    setDescription(groupDetails.groupDesc || '');
    setParentGroup(groupDetails.parentGroupName || '');
    setAddress(groupDetails.address || '');
    setBuildingName(groupDetails.buildingName || '');
    setLongitude(groupDetails.longitude || '');
    setLatitude(groupDetails.latitude || '');
    setOldData(groupDetails || {});
  }, [groupDetails]);

  useEffect(() => {
    if (
      name !== groupDetails.groupName ||
      description !== groupDetails.groupDesc ||
      address !== groupDetails.address ||
      buildingName !== groupDetails.buildingName ||
      longitude !== groupDetails.longitude ||
      latitude !== groupDetails.latitude
    ) {
      setIsUpdate(true);
    } else {
      setIsUpdate(false);
    }
  }, [name, description, groupDetails, address, buildingName, longitude, latitude]);

  function handleSetName(val) {
    setName(val);
    if (val === '') setNameError(true);
    else setNameError(false);
  }
  function handleSetDescription(val) {
    setDescription(val);
    if (val === '') setDescriptionError(true);
    else setDescriptionError(false);
  }
  function handleOldData() {
    setName(oldData.groupName || '');
    setDescription(oldData.groupDesc || '');
    setAddress(oldData.address || '');
    setBuildingName(oldData.buildingName || '');
    setLongitude(oldData.longitude || '');
    setLatitude(oldData.latitude || '');
    setMapStatus(false);
  }
  function handleUpdate() {
    const obj = {
      ...groupDetails,
      groupDesc: description,
      groupId: groupDetails.groupId,
      groupLevel: groupDetails.groupLevel,
      groupName: name,
      lastUpdatedId: userId,
      parentGroupId: groupDetails.parentGroupId,
      parentGroupName: groupDetails.parentGroupName,
      status: groupDetails.status,
      address,
      buildingName,
      longitude,
      latitude
    };
    handleUpdateGroup(obj, setIsUpdate);
  }

  function handleMapInfo(mapInfo) {
    setAddress(mapInfo.address);
    setLatitude(mapInfo.latitude);
    setLongitude(mapInfo.longitude);
  }

  return (
    <Fragment>
      <div className={classes.infoContainer}>
        {/* <Typography component="h5">{I18n.t('uvms.channelGroup.detailsBox.headTitle')}</Typography> */}
        <TextField
          label={I18n.t('uvms.channelGroup.detailsBox.name')}
          fullWidth
          required
          placeholder={I18n.t('uvms.channelGroup.detailsBox.namePlaceholder')}
          value={name}
          disabled={groupDetails.groupId === ROOT_NODE_ID || addPageStatus}
          onChange={e => handleSetName(e.target.value)}
          className={classes.textField_details}
          helperText={nameError ? I18n.t('uvms.channelGroup.detailsBox.nameErrorMsg') : ''}
          inputProps={{ maxLength: '50' }}
          error={nameError}
        />
        <TextField
          label={I18n.t('uvms.channelGroup.detailsBox.description')}
          placeholder={I18n.t('uvms.channelGroup.detailsBox.descriptionPlaceholder')}
          fullWidth
          required
          value={description}
          disabled={groupDetails.groupId === ROOT_NODE_ID || addPageStatus}
          onChange={e => handleSetDescription(e.target.value)}
          className={classes.textField_details}
          inputProps={{ maxLength: '50' }}
          helperText={
            descriptionError ? I18n.t('uvms.channelGroup.detailsBox.descriptionErrorMsg') : ''
          }
          error={descriptionError}
        />
        <TextField
          label={I18n.t('uvms.channelGroup.detailsBox.parentGroup')}
          placeholder={I18n.t('uvms.channelGroup.detailsBox.parentGroupPlaceholder')}
          fullWidth
          required
          value={parentGroup}
          disabled
          inputProps={{ maxLength: '50' }}
          // onChange={handleChange('groupName')}
          className={classes.textField_details}
          // helperText={validation.name ? I18n.t('uvms.channelGroup.detailsBox.parentGroupErrorMsg') : ''}
          //   error={validation.name}
        />
      </div>
      <div className={classes.infoContainer}>
        <TextField
          label={I18n.t('uvms.channelGroup.detailsBox.buildingName')}
          fullWidth
          placeholder={I18n.t('uvms.channelGroup.detailsBox.buildingNamePlaceholder')}
          value={buildingName}
          disabled={groupDetails.groupId === ROOT_NODE_ID || addPageStatus}
          onChange={e => setBuildingName(e.target.value)}
          className={classes.textField_details}
          helperText={nameError ? I18n.t('uvms.channelGroup.detailsBox.buildingNameErrorMsg') : ''}
          error={nameError}
        />
        <TextField
          label={I18n.t('uvms.channelGroup.detailsBox.address')}
          fullWidth
          placeholder={I18n.t('uvms.channelGroup.detailsBox.addressPlaceholder')}
          value={address}
          disabled={groupDetails.groupId === ROOT_NODE_ID || addPageStatus}
          onChange={e => setAddress(e.target.value)}
          className={classes.textField_details}
          helperText={nameError ? I18n.t('uvms.channelGroup.detailsBox.addressErrorMsg') : ''}
          error={nameError}
        />
        <TextField
          label={I18n.t('uvms.channelGroup.detailsBox.location')}
          fullWidth
          placeholder={I18n.t('uvms.channelGroup.detailsBox.locationPlaceholder')}
          value={`${longitude} - ${latitude}`}
          disabled
          // onChange={e => handleSetName(e.target.value)}
          className={classes.textField_details}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  aria-label={I18n.t('uvms.channelGroup.detailsBox.openLocationMap')}
                  onClick={() => setMapStatus(mapStatus => !mapStatus)}
                  disabled={groupDetails.groupId === ROOT_NODE_ID || addPageStatus}
                >
                  <Place />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </div>
      <Collapse in={mapStatus}>
        <div className={classes.mapContainer}>
          <MapMiniMap getMapInformation={handleMapInfo} />
        </div>
      </Collapse>

      {/* <div className={classes.button_edit}> */}
      <Button
        className={classes.button_each}
        onClick={handleUpdate}
        disabled={addPageStatus || !isUpdate}
      >
        {I18n.t('global.button.edit')}
      </Button>
      <Button onClick={handleOldData} disabled={addPageStatus || !isUpdate}>
        {I18n.t('global.button.cancel')}
      </Button>
      {/* </div> */}
    </Fragment>
  );
}

ChannelGroupInfo.defaultProps = {
  addPageStatus: false,
  groupDetails: {},
  handleUpdateGroup: () => {}
};

ChannelGroupInfo.propTypes = {
  addPageStatus: PropTypes.bool,
  groupDetails: PropTypes.object,
  handleUpdateGroup: PropTypes.func
};

export default ChannelGroupInfo;
