import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import store from '@/index';
import _ from 'lodash';
import { NoData, ConfirmPage } from 'components/common';
import { dataUpdatedHandle } from 'utils/helpers';
import { I18n } from 'react-i18nify';
import msg from 'utils/messageCenter';
import FaceShow from '../../FaceShow';
import styles from './PersonImagesList.module.less';

const PersonImagesList = memo(props => {
  const moduleName = 'faceEnrollment';
  const { dispatch } = store;
  const { dataSource, id } = props;

  const [deleteImageStatus, setDeleteImageStatus] = useState(false);
  const [deleteImageInfo, setDeleteImageInfo] = useState(false);

  const isImageListEmpty = _.isEmpty(dataSource);

  useEffect(() => {
    dispatch({
      type: `${moduleName}/vapFrsGetPersonImages`,
      payload: id
    });
  }, [dispatch, id]);

  function handleDelete(e) {
    setDeleteImageStatus(true);
    setDeleteImageInfo(e);
  }

  function deletePersonConfirm() {
    dispatch({
      type: `${moduleName}/vapFrsDeletePersonImage`,
      payload: {
        userId: deleteImageInfo.personId,
        imageId: deleteImageInfo.id
      }
    })
      .then(res => {
        dataUpdatedHandle(res, I18n.t('vap.face.faceEnrollment.deleteImage'), () => {
          dispatch({
            type: `${moduleName}/vapFrsGetPersonImages`,
            payload: id
          });
          setDeleteImageStatus(false);
        });
      })
      .catch(e => {
        if (e && e.message) {
          msg.error(e.message, I18n.t('vap.face.faceEnrollment.deleteImage'));
        }
      });
  }
  function deletePersonCancel() {
    setDeleteImageStatus(false);
  }
  return (
    <>
      <ConfirmPage
        isConfirmPageOpen={deleteImageStatus}
        message={`${I18n.t('vap.remindInformation.deleteImageRemind')}`}
        messageTitle={I18n.t('vap.face.faceEnrollment.deleteImage')}
        hanldeConfirmMessage={deletePersonConfirm}
        handleConfirmPageClose={deletePersonCancel}
      />
      <div className={styles.wrapper}>
        <div className={styles.avatar_list}>
          {dataSource.map(item => (
            <div key={item.id} className={styles.item}>
              <FaceShow
                isDeleteNeed
                index={item}
                onDelete={handleDelete}
                image={`data:image/png;base64,${item.imgBase64}`}
              />
            </div>
          ))}
        </div>
        {isImageListEmpty && <NoData />}
      </div>
    </>
  );
});

PersonImagesList.defaultProps = {
  dataSource: [],
  id: ''
};

PersonImagesList.propTypes = {
  dataSource: PropTypes.array,
  id: PropTypes.string
};

export default PersonImagesList;
