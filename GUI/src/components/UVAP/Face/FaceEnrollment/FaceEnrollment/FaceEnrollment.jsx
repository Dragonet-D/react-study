import React, { useState, useCallback, useEffect } from 'react';
import { I18n } from 'react-i18nify';
import Button from '@material-ui/core/Button';
import CardMedia from '@material-ui/core/CardMedia';
import { TextField, PreviewImage, SnapShot } from 'components/common';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import ConfidenceScore from '../../ConfidenceScore';
import GroupTable from './GroupTable';
import styles from './FaceEnrollment.module.less';

function FaceEnrollment(props) {
  const { faceEnrollment, getData } = props;
  const { groupsData } = faceEnrollment;
  const [avatarList, setAvatarList] = useState('');
  const [groupName, setGroupName] = useState('');
  const [nric, setNric] = useState('');
  const [score, setScore] = useState(0);
  const [groupSelectedItems, setGroupSelectedItems] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(false);
  const [previewStatus, setPreviewStatus] = useState(false);

  useEffect(() => {
    getData({
      groupName,
      faces: avatarList,
      nric,
      groupSelectedItems,
      score
    });
  }, [groupName, nric, avatarList, groupSelectedItems, getData, score]);

  const handleGroupNameChange = useCallback(e => {
    const { value } = e.target;
    setGroupName(value);
  }, []);

  const handleNricChange = useCallback(e => {
    const { value } = e.target;
    setNric(value);
  }, []);

  const getConfidenceScore = useCallback(e => {
    setScore(e);
  }, []);

  const getGroupData = useCallback(e => {
    setGroupSelectedItems(e.getData());
  }, []);

  const getAvatarList = e => {
    setAvatarList(e);
    setUploadStatus(false);
  };

  function handleUpload() {
    setUploadStatus(true);
  }

  function handlePreview() {
    setPreviewStatus(true);
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
      <div className={styles.wrapper}>
        <div className={styles.info_wrapper}>
          <TextField
            label={I18n.t('vap.face.faceEnrollment.name')}
            fullWidth
            value={groupName}
            onChange={handleGroupNameChange}
          />
          <TextField
            label={I18n.t('vap.face.faceEnrollment.identifyNo')}
            fullWidth
            className={styles.item}
            value={nric}
            onChange={handleNricChange}
          />
          <ConfidenceScore
            getValue={getConfidenceScore}
            className={styles.score}
            defaultValue={score}
          />
        </div>
        <div className={styles.upload}>
          {avatarList && (
            <CardMedia onClick={handlePreview} className={styles.image} image={avatarList} />
          )}
          <Button size="small" color="primary" variant="text" onClick={handleUpload}>
            {I18n.t('vap.face.faceSearch.uploadFace')}
          </Button>
        </div>
      </div>
      <PreviewImage
        image={avatarList}
        open={previewStatus}
        onClose={() => setPreviewStatus(false)}
      />
      {false && <GroupTable get={getGroupData} dataSource={groupsData} />}
    </>
  );
}

FaceEnrollment.defaultProps = {
  getData: () => {}
};

FaceEnrollment.propTypes = {
  getData: PropTypes.func
};

export default connect(({ faceEnrollment }) => ({ faceEnrollment }))(FaceEnrollment);
