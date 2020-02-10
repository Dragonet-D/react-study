import React, { useState, useCallback } from 'react';
import { I18n } from 'react-i18nify';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@material-ui/core/styles';
import store from '@/index';
import _ from 'lodash';
import makeStyles from '@material-ui/styles/makeStyles';
import { dataUpdatedHandle } from 'utils/helpers';
import msg from 'utils/messageCenter';
import PropTypes from 'prop-types';
import { Tab, Tabs, TabPanel } from 'components/common';
import FaceDialog from '../../FaceDialog';
import FaceEnrollment from './FaceEnrollment';
import BatchEnrollment from './BatchEnrollment';
import TaskListing from './TaskListing';
import { getRequestImageType, getUserIdFromSuccessData } from '../../utils';

const useStyles = makeStyles(() => {
  return {
    dialog: {
      height: 450,
      width: 700
    }
  };
});

function FaceEnrollmentDialog(props) {
  const classes = useStyles();
  const moduleName = 'faceEnrollment';
  const { dispatch } = store;
  const { open, onClose, searchMode, batchHandle, userId } = props;
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [faceEnrollmentData, setFaceEnrollmentData] = useState({});
  const [batchFile, setBatchFile] = useState('');

  const isSaveFaceEnrollmentDisabled =
    value === 0 &&
    (_.isEmpty(faceEnrollmentData.faces) ||
      _.isEmpty(faceEnrollmentData.groupName) ||
      _.isEmpty(faceEnrollmentData.nric));

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  function handleChangeIndex(index) {
    setValue(index);
  }

  const updatePersonsList = useCallback(() => {
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
          type: `${moduleName}/vapFrsAddPerson`,
          payload: {
            info: {
              identityNo: faceEnrollmentData.nric,
              fullName: faceEnrollmentData.groupName,
              avatar: getRequestImageType(_.get(faceEnrollmentData, 'faces', ''))
            },
            userId,
            confidenceThreshold: faceEnrollmentData.score
          }
        })
          .then(res => {
            dataUpdatedHandle(res, 'Add Person', () => {
              dispatch({
                type: `${moduleName}/vapFrsUpdatePersonImages`,
                payload: {
                  userId: getUserIdFromSuccessData(res),
                  imageInfo: {
                    imgBase64: getRequestImageType(_.get(faceEnrollmentData, 'faces', '')),
                    userId
                  }
                }
              });
              updatePersonsList();
              onClose();
            });
          })
          .catch(e => {
            if (e && e.message) {
              msg.error(e.message, 'Add Person');
            }
          });
        break;
      case 1:
        if (!batchFile) return;
        dispatch({
          type: `${moduleName}/vapFrsAddPersonsFileOfZip`,
          payload: {
            file: batchFile,
            createdId: userId
          }
        })
          .then(res => {
            dataUpdatedHandle(res, 'Upload', () => {
              updatePersonsList();
              onClose();
            });
          })
          .catch(e => {
            if (e && e.message) {
              msg.error(e.message, 'Add Person');
            }
          });
        break;
      case 2:
        break;
      default:
        break;
    }
  }, [value, dispatch, faceEnrollmentData, batchFile, userId, updatePersonsList, onClose]);

  const handleFaceEnrollmentData = useCallback(data => {
    setFaceEnrollmentData(data);
  }, []);

  function getFile(e) {
    setBatchFile(e);
  }

  const isTaskShow = false;
  return (
    <FaceDialog
      open={open}
      title={I18n.t('vap.button.faceEnrollment')}
      handleClose={() => onClose()}
      handleSave={handleSave}
      isActionNeed={value !== 2}
      disableSave={isSaveFaceEnrollmentDisabled}
      dialogWidth={classes.dialog}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="standard"
      >
        <Tab label={I18n.t('vap.button.faceEnrollment')} />
        <Tab label={I18n.t('vap.button.batchEnrollment')} />
        {isTaskShow && <Tab label={I18n.t('vap.face.faceEnrollment.taskListing')} />}
      </Tabs>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <FaceEnrollment getData={handleFaceEnrollmentData} />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <BatchEnrollment getFile={getFile} {...batchHandle} />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <TaskListing />
        </TabPanel>
      </SwipeableViews>
    </FaceDialog>
  );
}

FaceEnrollment.defaultProps = {
  searchMode: '',
  batchHandle: {
    handleTempFileDownload: () => {}
  }
};

FaceEnrollment.propTypes = {
  searchMode: PropTypes.string.isRequired
};

export default FaceEnrollmentDialog;
