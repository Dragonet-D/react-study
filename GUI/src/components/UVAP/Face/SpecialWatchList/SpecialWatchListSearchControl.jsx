import React, { memo, useCallback, useEffect, useState } from 'react';
import { I18n } from 'react-i18nify';
import CardMedia from '@material-ui/core/CardMedia';
import { PreviewImage, Button, SnapShot } from 'components/common';
import ConfidenceScore from '../ConfidenceScore';
import styles from './SpecialWatchListSearchControl.module.less';

const SpecialWatchListSearchControl = memo(props => {
  const { getSearchControlData, get } = props;

  // const [referenceNo, setReferenceNo] = useState('');
  const [uploadImage, setUploadImage] = useState('');
  const [previewStatus, setPreviewStatus] = useState(false);
  const [score, setScore] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(false);

  // function handleReferenceChange(e) {
  //   const { value } = e.target;
  //   setReferenceNo(value);
  // }

  function getImage(e) {
    setUploadImage(e);
    toggleUploadStatus(false);
  }

  function previewClose() {
    setPreviewStatus(false);
  }

  const clear = useCallback(() => {
    // setReferenceNo('');
    setUploadImage('');
    setScore(0);
  }, []);

  useEffect(() => {
    get(clear);
  }, [get, clear]);

  const handleAction = target => () => {
    getSearchControlData({ target, referenceNo: '', uploadImage, score });
  };

  function getScoreValue(e) {
    setScore(e);
  }

  function toggleUploadStatus(target) {
    setUploadStatus(target);
  }

  const isUploadDisabled = !uploadImage;
  return (
    <>
      {uploadStatus && (
        <SnapShot
          open
          getSnapShotImage={getImage}
          handleClose={toggleUploadStatus.bind(null, false)}
        />
      )}
      <div className={styles.item}>
        {/* <TextField
          value={referenceNo}
          label={I18n.t('vap.face.faceSearch.referenceNo')}
          placeholder={I18n.t('vap.face.faceSearch.referenceNo')}
          onChange={handleReferenceChange}
          className={styles.no}
        /> */}
        <ConfidenceScore getValue={getScoreValue} defaultValue={score} className={styles.score} />
        <div className={styles.upload}>
          <Button
            className={styles.upload_btn}
            onClick={toggleUploadStatus.bind(null, true)}
            color="secondary"
            variant="contained"
            size="small"
          >
            {I18n.t('vap.face.faceSearch.uploadFace')}
          </Button>
          {uploadImage && (
            <CardMedia
              onClick={() => setPreviewStatus(true)}
              image={uploadImage}
              className={styles.image}
            />
          )}
        </div>
        <PreviewImage open={previewStatus} onClose={previewClose} image={uploadImage} />
        <Button
          onClick={handleAction('startWatch')}
          color="secondary"
          variant="contained"
          size="small"
          disabled={isUploadDisabled}
        >
          {I18n.t('vap.face.specialWatchList.startWatch')}
        </Button>
        <Button
          onClick={handleAction('viewSpecialWatchList')}
          color="secondary"
          variant="contained"
          size="small"
          className={styles.view}
        >
          {I18n.t('vap.face.specialWatchList.viewSpecialWatchList')}
        </Button>
      </div>
    </>
  );
});

SpecialWatchListSearchControl.defaultProps = {
  getSearchControlData: () => {},
  get: () => {}
};

export default SpecialWatchListSearchControl;
