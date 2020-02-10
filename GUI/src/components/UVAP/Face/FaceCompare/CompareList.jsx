import React, { useState, memo } from 'react';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import { I18n } from 'react-i18nify';
import Dialog from '@material-ui/core/Dialog';
import PropTypes from 'prop-types';
import { SnapShot } from 'components/common';
import styles from './CompareList.module.less';

const CompareList = memo(({ getImageData }) => {
  // const [name, setName] = useState({ one: '', two: '' });
  const [image, setImage] = useState({ one: '', two: '' });
  const [previewImage, setPreviewImage] = useState({ one: '', two: '' });
  const [previewStatus, setPreviewStatus] = useState({ one: false, two: false });
  const [snapShotStatus, setSnapShotStatus] = useState(false);
  const [targetUpload, setTargetUpload] = useState('');

  const handlePreview = target => () => {
    setPreviewStatus(prev => ({ ...prev, ...{ [target]: true } }));
  };

  const previewClose = target => () => {
    setPreviewStatus(prev => ({ ...prev, ...{ [target]: false } }));
  };

  function handleSnapShotClose() {
    setSnapShotStatus(false);
  }

  function handleUpload(target) {
    setSnapShotStatus(true);
    setTargetUpload(target);
  }

  function getSnapShotImage(e) {
    setImage(prev => {
      const data = { ...prev, ...{ [targetUpload]: e } };
      getImageData(data);
      return data;
    });
    setPreviewImage({ ...previewImage, ...{ [targetUpload]: e } });
    setSnapShotStatus(false);
  }

  return (
    <>
      {snapShotStatus && (
        <SnapShot open handleClose={handleSnapShotClose} getSnapShotImage={getSnapShotImage} />
      )}
      <div className={styles.wrapper}>
        <div className={styles.single}>
          {image.one && (
            <CardMedia className={styles.avatar} image={image.one} onClick={handlePreview('one')} />
          )}
          <div className={styles.btn}>
            <Button
              size="small"
              color="secondary"
              variant="contained"
              onClick={handleUpload.bind(null, 'one')}
            >
              {I18n.t('vap.face.faceEnrollment.uploadFaceImage')}
            </Button>
          </div>
        </div>
        <Typography variant="h4" color="textSecondary" className={styles.vs}>
          {I18n.t('vap.face.faceCompare.vs')}
        </Typography>
        <div className={styles.single}>
          {image.two && (
            <CardMedia className={styles.avatar} image={image.two} onClick={handlePreview('two')} />
          )}
          <div className={styles.btn}>
            <Button
              size="small"
              color="secondary"
              variant="contained"
              onClick={handleUpload.bind(null, 'two')}
            >
              {I18n.t('vap.face.faceEnrollment.uploadFaceImage')}
            </Button>
          </div>
        </div>
      </div>
      <Dialog open={previewStatus.one} footer={null} onClose={previewClose('one')}>
        <img alt="Avatar" style={{ width: '100%' }} src={previewImage.one} />
      </Dialog>
      <Dialog open={previewStatus.two} footer={null} onClose={previewClose('two')}>
        <img alt="Avatar" style={{ width: '100%' }} src={previewImage.two} />
      </Dialog>
    </>
  );
});

CompareList.propTypes = {
  getImageData: PropTypes.func.isRequired
};

export default CompareList;
