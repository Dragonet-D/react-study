import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { I18n } from 'react-i18nify';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { TextField, Button, MapSearchLocation as MapMiniMap } from 'components/common';

const useStyles = makeStyles(() => {
  return {
    tableContainer: {
      // display: 'flex',
      // alignItems: 'center',
      marginTop: '20px'
    },
    textField_details: {
      flex: 2,
      marginRight: '15px',
      marginTop: '15px',
      width: '400px'
    },
    button_edit: {
      flex: 1,
      marginTop: '20px'
    },
    button_each: {
      marginRight: '15px'
    },
    detailsBox: { display: 'flex', flexDirection: 'row' },
    infoBox: { flex: '1' },
    mapContainer: {
      flex: '2',
      // width: '100%',
      // height: '100%',
      // top: 0,
      // right: '1%',
      position: 'relative',
      backgroundColor: '#23304f'
      // borderRadius: '4px'
    }
  };
});

function ChannelGroupCreateGroup(props) {
  const classes = useStyles();
  const { groupDetails, handleAddPageStatus, handleCreateNewGroup } = props;

  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState(false);
  const [parentGroup, setParentGroup] = useState('');
  const [parentGroupError, setParentGroupError] = useState(false);
  const [parentGroupId, setParentGroupId] = useState('');
  const [address, setAddress] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  useEffect(() => {
    setParentGroup(groupDetails.groupName || '');
    setParentGroupId(groupDetails.groupId || '');
  }, [groupDetails]);
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
  function saveNewGroup() {
    if (name === '') {
      setNameError(true);
    } else setNameError(false);
    if (description === '') {
      setDescriptionError(true);
    } else setDescriptionError(false);
    if (parentGroupId === '') {
      setParentGroupError(true);
    } else setParentGroupError(false);

    if (name !== '' && description !== '' && parentGroupId !== '') {
      const obj = {
        groupDesc: description,
        groupName: name,
        parentGroupId,
        address,
        longitude,
        latitude,
        buildingName
      };
      handleCreateNewGroup(obj);
    } else {
      return false;
    }
  }

  function handleMapInfo(mapInfo) {
    setAddress(mapInfo.address);
    setLatitude(mapInfo.latitude);
    setLongitude(mapInfo.longitude);
  }

  return (
    <div className={classes.tableContainer}>
      <Typography component="h5">
        {I18n.t('uvms.channelGroup.detailsBox.createNewGroupTitle')}
      </Typography>
      <div className={classes.detailsBox}>
        <div className={classes.infoBox}>
          <TextField
            label={I18n.t('uvms.channelGroup.detailsBox.name')}
            fullWidth
            required
            placeholder={I18n.t('uvms.channelGroup.detailsBox.namePlaceholder')}
            value={name}
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
            onChange={e => handleSetDescription(e.target.value)}
            className={classes.textField_details}
            helperText={
              descriptionError ? I18n.t('uvms.channelGroup.detailsBox.descriptionErrorMsg') : ''
            }
            inputProps={{ maxLength: '50' }}
            error={descriptionError}
          />
          <TextField
            label={I18n.t('uvms.channelGroup.detailsBox.parentGroup')}
            placeholder={I18n.t('uvms.channelGroup.detailsBox.parentGroupPlaceholder')}
            fullWidth
            required
            disabled
            value={parentGroup}
            // onChange={handleChange('groupName')}
            className={classes.textField_details}
            helperText={
              parentGroupError ? I18n.t('uvms.channelGroup.detailsBox.parentGroupErrorMsg') : ''
            }
            inputProps={{ maxLength: '50' }}
            error={parentGroupError}
          />
          <TextField
            label={I18n.t('uvms.channelGroup.detailsBox.buildingName')}
            placeholder={I18n.t('uvms.channelGroup.detailsBox.buildingNamePlaceholder')}
            fullWidth
            // required
            value={buildingName}
            onChange={e => setBuildingName(e.target.value)}
            className={classes.textField_details}
            // helperText={
            //   parentGroupError ? I18n.t('uvms.channelGroup.detailsBox.buildingNameErrorMsg') : ''
            // }
            // error={parentGroupError}
          />
          <TextField
            label={I18n.t('uvms.channelGroup.detailsBox.address')}
            placeholder={I18n.t('uvms.channelGroup.detailsBox.addressPlaceholder')}
            fullWidth
            // required
            value={address}
            onChange={e => setAddress(e.target.value)}
            className={classes.textField_details}
            // helperText={
            //   parentGroupError ? I18n.t('uvms.channelGroup.detailsBox.addressErrorMsg') : ''
            // }
            // error={parentGroupError}
          />
          <TextField
            label={I18n.t('uvms.channelGroup.detailsBox.location')}
            placeholder={I18n.t('uvms.channelGroup.detailsBox.locationPlaceholder')}
            fullWidth
            // required
            value={`${longitude} - ${latitude}`}
            disabled
            className={classes.textField_details}
            // helperText={
            //   parentGroupError ? I18n.t('uvms.channelGroup.detailsBox.locationErrorMsg') : ''
            // }
            // error={parentGroupError}
          />
        </div>
        <div className={classes.mapContainer}>
          <MapMiniMap getMapInformation={handleMapInfo} />
        </div>
      </div>
      <div className={classes.button_edit}>
        <Button
          className={classes.button_each}
          onClick={saveNewGroup}
          disabled={name === '' || description === '' || parentGroup === ''}
        >
          {I18n.t('global.button.save')}
        </Button>
        <Button onClick={() => handleAddPageStatus(false)}>{I18n.t('global.button.cancel')}</Button>
      </div>
    </div>
  );
}

ChannelGroupCreateGroup.defaultProps = {
  groupDetails: {},
  handleAddPageStatus: () => {},
  handleCreateNewGroup: () => {}
};

ChannelGroupCreateGroup.propTypes = {
  groupDetails: PropTypes.object,
  handleAddPageStatus: PropTypes.func,
  handleCreateNewGroup: PropTypes.func
};

export default ChannelGroupCreateGroup;
