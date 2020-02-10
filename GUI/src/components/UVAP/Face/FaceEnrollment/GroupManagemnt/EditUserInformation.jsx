import React, { useState, useEffect, useCallback } from 'react';
import { I18n, Translate } from 'react-i18nify';
import { makeStyles } from '@material-ui/core/styles';
import useTheme from '@material-ui/core/styles/useTheme';
import Button from '@material-ui/core/Button';
import { TextField, Tab, Tabs, TabPanel, SnapShot } from 'components/common';
import SwipeableViews from 'react-swipeable-views';
import _ from 'lodash';
import store from '@/index';
import msg from 'utils/messageCenter';
import { dataUpdatedHandle } from 'utils/helpers';
import ConfidenceScore from '../../ConfidenceScore';
import FaceUploadForUser from '../../FaceUploadForUser';
import PersonImagesList from './PersonImagesList';
import GroupTable from '../FaceEnrollment/GroupTable';
import FaceDialog from '../../FaceDialog';
import { getRequestImageType } from '../../utils';

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      width: 600,
      maxWidth: 600,
      height: 400
    },
    birth_set: {
      width: '100%',
      margin: `8px 0`
    },
    score: {
      margin: '8px 0'
    },
    info_wrapper: {
      display: 'flex',
      alignItems: 'center'
    }
  };
});

function EditUserInformation(props) {
  const moduleName = 'faceEnrollment';
  const theme = useTheme();
  const classes = useStyles();
  const { dispatch } = store;
  const { dataSource, onClose, personImages, searchMode, userId } = props;
  const [name, setName] = useState('');
  const [identityNo, setIdentityNo] = useState('');
  const [groupIDs, setGroupIDs] = useState([]);
  const [score, setScore] = useState(0);
  const [avatarList, setAvatarList] = useState([]);
  const [avatarSource, setAvatarSource] = useState('');
  const [value, setValue] = useState(0);
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(false);

  useEffect(() => {
    if (!_.isEmpty(dataSource)) {
      const avatar = _.get(dataSource, 'info.avatar', '');
      const userName = _.get(dataSource, 'info.fullName', '');
      setName(userName);
      setIdentityNo(_.get(dataSource, 'info.identityNo', ''));
      setScore(_.get(dataSource, 'confidenceThreshold', 0));
      setAvatarSource(`data:image/png;base64,${avatar}`);
    }
  }, [dataSource]);

  function judgeTgroupAssign() {
    if (!dataSource.groupIDs && groupIDs.length) {
      return false;
    } else if (!dataSource.groupIDs && !groupIDs.length) {
      return true;
    } else if (
      dataSource.groupIDs &&
      dataSource.groupIDs.length === groupIDs.length &&
      dataSource.groupIDs.every(item => groupIDs.includes(item))
    ) {
      return true;
    } else {
      return false;
    }
  }

  useEffect(() => {
    switch (value) {
      case 0:
        setIsSaveDisabled(!name || !identityNo);
        break;
      case 2:
        setIsSaveDisabled(judgeTgroupAssign());
        break;
      default:
        break;
    }
  }, [value, name, identityNo, groupIDs, dataSource.groupIDs, judgeTgroupAssign]);

  const handleNameChange = e => {
    const { value } = e.target;
    setName(value);
  };

  const handleAddressChange = e => {
    const { value } = e.target;
    setIdentityNo(value);
  };

  const updateUserList = useCallback(() => {
    if (searchMode === 'person') {
      dispatch({
        type: `${moduleName}/handleSearchPersonInformation`,
        payload: {}
      });
    } else {
      dispatch({
        type: `${moduleName}/handleChoseGroupData`,
        payload: {}
      });
    }
  }, [dispatch, searchMode]);

  const handleSave = useCallback(() => {
    switch (value) {
      case 0:
        dispatch({
          type: `${moduleName}/vapFrsUpdatePerson`,
          payload: {
            userId: dataSource.id,
            info: {
              info: {
                identityNo,
                fullName: name,
                avatar: getRequestImageType(avatarList)
              },
              confidenceThreshold: score
            }
          }
        })
          .then(res => {
            dataUpdatedHandle(res, I18n.t('vap.face.faceEnrollment.updatePerson'), () => {
              updateUserList();
              onClose();
            });
          })
          .catch(e => {
            if (e && e.message) {
              msg.error(e.message, I18n.t('vap.face.faceEnrollment.updatePerson'));
            }
          });
        break;
      case 1:
        break;
      case 2:
        if (!_.isEqual(dataSource.groupIDs, groupIDs)) {
          dispatch({
            type: `${moduleName}/vapFrsUpdatePersonAssignedGroup`,
            payload: {
              userId: dataSource.id,
              groupIDs
            }
          })
            .then(res => {
              dataUpdatedHandle(res, I18n.t('vap.face.faceEnrollment.assignedGroups'), () => {
                updateUserList();
                onClose();
              });
            })
            .catch(e => {
              if (e && e.message) {
                msg.error(e.message, I18n.t('vap.face.faceEnrollment.assignedGroups'));
              }
            });
        }
        break;
      default:
        break;
    }
  }, [
    avatarList,
    value,
    dispatch,
    dataSource.id,
    dataSource.groupIDs,
    identityNo,
    name,
    score,
    groupIDs,
    updateUserList,
    onClose
  ]);

  const getData = useCallback(obj => {
    setGroupIDs(obj.getData());
  }, []);

  const getPersonsImages = useCallback(() => {
    dispatch({
      type: `${moduleName}/vapFrsGetPersonImages`,
      payload: dataSource.id
    });
  }, [dispatch, dataSource.id]);

  const getScoreData = e => {
    setScore(e);
  };

  const getAvatarData = data => {
    setAvatarList(data.get());
  };

  function handleTabChange(event, newValue) {
    setValue(newValue);
  }

  function getImage(e) {
    const imgBase64 = getRequestImageType(e);
    dispatch({
      type: `${moduleName}/vapFrsUpdatePersonImages`,
      payload: {
        userId: dataSource.id,
        imageInfo: {
          imgBase64,
          userId
        }
      }
    })
      .then(res => {
        dataUpdatedHandle(res, 'Upload Images', () => {
          getPersonsImages();
        });
      })
      .catch(e => {
        if (e && e.message) {
          msg.error(e.message, I18n.t('vap.face.faceEnrollment.uploadImages'));
        }
      });
  }

  function getAvatarList(e) {
    setAvatarList(e);
    setUploadStatus(false);
    getImage(e);
  }

  return (
    <>
      {uploadStatus && (
        <SnapShot
          getSnapShotImage={getAvatarList}
          open
          handleClose={() => setUploadStatus(false)}
        />
      )}
      <FaceDialog
        open
        title={I18n.t('vap.face.faceEnrollment.editDetails')}
        dialogWidth={classes.wrapper}
        handleClose={() => onClose()}
        handleSave={handleSave}
        disableSave={isSaveDisabled}
        action={
          value === 1 ? (
            <Button color="primary" onClick={() => setUploadStatus(true)}>
              <Translate value="vap.face.faceEnrollment.uploadFaceImage" />
            </Button>
          ) : (
            ''
          )
        }
        isActionNeed={value !== 1}
      >
        <Tabs value={value} onChange={handleTabChange}>
          <Tab label={I18n.t('vap.face.faceEnrollment.basicInfo')} />
          <Tab label={I18n.t('vap.face.faceEnrollment.faceImages')} />
          <Tab label={I18n.t('vap.face.faceEnrollment.assignedGroups')} />
        </Tabs>
        <SwipeableViews axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}>
          <TabPanel value={value} index={0} dir={theme.direction}>
            {value === 0 && (
              <div className={classes.info_wrapper}>
                <div>
                  <TextField
                    label={I18n.t('vap.face.faceEnrollment.name')}
                    fullWidth
                    value={name}
                    onChange={handleNameChange}
                  />
                  <TextField
                    label={I18n.t('vap.face.faceEnrollment.identifyNo')}
                    fullWidth
                    value={identityNo}
                    onChange={handleAddressChange}
                  />
                  <ConfidenceScore
                    defaultValue={score}
                    getValue={getScoreData}
                    className={classes.score}
                  />
                </div>
                <FaceUploadForUser getData={getAvatarData} avatarSource={avatarSource} />
              </div>
            )}
          </TabPanel>
        </SwipeableViews>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <PersonImagesList id={dataSource.id || ''} dataSource={personImages} />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <GroupTable tableMaxHeight="236px" get={getData} checkedItemIds={dataSource.groupIDs} />
        </TabPanel>
      </FaceDialog>
    </>
  );
}

export default EditUserInformation;
