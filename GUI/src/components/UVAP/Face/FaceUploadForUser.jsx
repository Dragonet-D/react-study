import React, { useCallback, useState, useEffect, memo } from 'react';
import Button from '@material-ui/core/Button';
import CardMedia from '@material-ui/core/CardMedia';
import { Translate } from 'react-i18nify';
import { SnapShot, PreviewImage } from 'components/common';
import PropTypes from 'prop-types';
import styles from './FaceUploadForUser.module.less';

const FaceUploadForUser = memo(props => {
  const { getData, avatarSource } = props;
  const [avatarList, setAvatarList] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [uploadStatus, setUploadStatus] = useState(false);

  useEffect(() => {
    getData({
      get
    });
  });

  useEffect(() => {
    if (avatarSource) {
      setAvatarList(avatarSource);
    }
  }, [avatarSource]);

  function get() {
    return avatarList;
  }
  const previewClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handlePreview = useCallback(
    (image, name) => () => {
      setPreviewImage(image);
      setOpen(true);
      setName(name);
    },
    []
  );

  function getAvatarList(e) {
    setAvatarList(e);
    setUploadStatus(false);
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
      <div className={styles.avatar_wrapper}>
        <div className={styles.avatar_item}>
          {avatarList && (
            <div className={styles.avatar} onClick={handlePreview(avatarList, '')}>
              <CardMedia className={styles.image} image={avatarList} />
            </div>
          )}
        </div>
        <Button onClick={() => setUploadStatus(true)} color="primary">
          <Translate value="vap.face.faceEnrollment.uploadFaceImage" />
        </Button>
      </div>
      <PreviewImage open={open} onClose={previewClose} name={name} image={previewImage} />
    </>
  );
});

FaceUploadForUser.defaultProps = {
  getData: () => {},
  avatarSource: []
};

FaceUploadForUser.propTypes = {
  getData: PropTypes.func,
  avatarSource: PropTypes.array
};

export default FaceUploadForUser;
