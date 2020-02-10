import React, { useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { I18n } from 'react-i18nify';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import C from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import _ from 'lodash';
import { Pagination, ConfirmPage, NoData, PreviewImage } from 'components/common';
import { PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
import { dataUpdatedHandle } from 'utils/helpers';
import msg from 'utils/messageCenter';
import styles from './UsersList.module.less';

const useStyles = makeStyles(theme => {
  return {
    wrapper: {
      position: 'relative'
    },
    media: {
      height: 130,
      cursor: 'pointer'
    },
    content: {
      padding: theme.spacing(1),
      paddingTop: 0,
      '&:last-child': {
        paddingBottom: theme.spacing(1)
      }
    },
    card: {
      border: `1px solid ${theme.palette.background.paper}`,
      '&:hover': {
        border: `1px solid ${theme.palette.background.main}`
      }
    },
    card_active: {
      border: `1px solid ${theme.palette.background.main}`
    },
    no_data: {
      padding: theme.spacing(1),
      textAlign: 'center'
    }
  };
});

function UsersList(props) {
  const moduleName = 'faceEnrollment';
  const classes = useStyles();
  const { onEdit, faceEnrollment, dispatch, searchMode } = props;
  const { personsList = {}, choseGroupData, searchPersonInformation } = faceEnrollment;
  const [page, setPage] = useState(PAGE_SIZE);
  const [pageNo] = useState(PAGE_NUMBER);
  const [deletePersonDialogStatus, setDeletePersonDialogStatus] = useState(false);
  const [personNeededToBeDelete, setPersonNeededToBeDelete] = useState({});
  const [previewImage, setPreviewImage] = useState('');
  const [previewImageStatus, setPreviewImageStatus] = useState(false);

  const isPersonsListNotEmpty = personsList.items && personsList.items.length > 0;
  const personsCount = _.toNumber(personsList.totalCount);
  const isPersonMode = searchMode === 'person';
  // searchMode 'person' 'group'
  const tempPageNo = _.get(searchPersonInformation, 'pageNo', pageNo);

  const getPersonsList = useCallback(() => {
    dispatch({
      type: `${moduleName}/vapFrsGetPersons`,
      payload: {
        psize: page,
        pindex: tempPageNo,
        identityno: isPersonMode ? _.get(searchPersonInformation, 'userId', '') : '',
        name: isPersonMode ? _.get(searchPersonInformation, 'userName', '') : '',
        groupId: isPersonMode ? '' : _.get(choseGroupData, 'id', '')
      }
    });
  }, [dispatch, page, tempPageNo, isPersonMode, searchPersonInformation, choseGroupData]);

  useEffect(() => {
    getPersonsList();
  }, [getPersonsList]);
  const handleEdit = useCallback(
    item => e => {
      dispatch({
        type: `${moduleName}/editUserInformation`,
        payload: item
      });
      onEdit(item);
      e.nativeEvent.stopPropagation();
    },
    [dispatch, onEdit]
  );

  const handleDelete = item => () => {
    setDeletePersonDialogStatus(true);
    setPersonNeededToBeDelete(item);
  };

  function onChangeRowsPerPage(e) {
    const { value } = e.target;
    setPage(value);
  }

  function onChangePage(e, page) {
    dispatch({
      type: `${moduleName}/handleSearchPersonInformation`,
      payload: {
        pageNo: page
      }
    });
  }

  function deletePersonConfirm() {
    dispatch({
      type: `${moduleName}/vapFrsDeletePerson`,
      payload: personNeededToBeDelete.id
    })
      .then(res => {
        dataUpdatedHandle(res, I18n.t('vap.face.faceEnrollment.deletePerson'), () => {
          getPersonsList();
          setDeletePersonDialogStatus(false);
          setPersonNeededToBeDelete({});
        });
      })
      .catch(e => {
        if (e && e.message) {
          msg.error(e.message, I18n.t('vap.face.faceEnrollment.deletePerson'));
        }
      });
  }

  function deletePersonCancel() {
    setDeletePersonDialogStatus(false);
    setPersonNeededToBeDelete({});
  }

  function handlePreview(e) {
    setPreviewImage(e);
    setPreviewImageStatus(true);
  }

  return (
    <div className={classes.wrapper}>
      <ConfirmPage
        isConfirmPageOpen={deletePersonDialogStatus}
        message={`${I18n.t('vap.face.faceEnrollment.deletePersonMessage')} "${_.get(
          personNeededToBeDelete,
          'info.fullName',
          ''
        )}"?`}
        messageTitle={I18n.t('vap.face.faceEnrollment.deletePerson')}
        hanldeConfirmMessage={deletePersonConfirm}
        handleConfirmPageClose={deletePersonCancel}
      />
      <div className={`${styles.wrapper}`}>
        {isPersonsListNotEmpty &&
          (() => {
            const result = [];
            const dataList = personsList.items;
            if (!dataList) return null;
            for (let i = personsList.items.length - 1; i >= 0; i--) {
              const item = dataList[i];
              result.push(
                <div
                  key={item.id}
                  className={`${styles.card} ${
                    searchMode === 'person' ? styles.card_5 : styles.card_4
                  }`}
                >
                  <Card className={C(classes.card)}>
                    <CardMedia
                      classes={{ root: classes.media }}
                      image={`data:image/png;base64,${item.info.avatar}`}
                      component="div"
                      onClick={handlePreview.bind(
                        null,
                        `data:image/png;base64,${item.info.avatar}`
                      )}
                    />
                    <CardContent classes={{ root: classes.content }}>
                      <Typography component="div" className={styles.title} variant="h6">
                        {`${I18n.t('vap.face.faceEnrollment.personDetails')}`}
                        <IconButton size="small" className={styles.edit} onClick={handleEdit(item)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          className={styles.delete}
                          size="small"
                          onClick={handleDelete(item)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Typography>
                      <Typography variant="caption" color="textPrimary" component="div">
                        <div className={styles.info_item}>
                          <span className={C(styles.no_wrap)}>
                            {`${I18n.t('vap.face.faceEnrollment.name')}: `}
                          </span>
                          <span className={C(styles.no_wrap)}>{item.info.fullName}</span>
                        </div>
                        <div className={styles.info_item}>
                          <span className={C(styles.no_wrap)}>
                            {`${I18n.t('vap.face.faceEnrollment.identifyNo')}: `}
                          </span>
                          <span className={C(styles.no_wrap)}>{item.info.identityNo}</span>
                        </div>
                        <div className={styles.info_item}>
                          <span className={C(styles.no_wrap)}>
                            {`${I18n.t('vap.face.faceEnrollment.confidenceScore')}: `}
                          </span>
                          <span className={C(styles.no_wrap)}>{item.confidenceThreshold}</span>
                        </div>
                      </Typography>
                    </CardContent>
                  </Card>
                </div>
              );
            }
            return result;
          })()}
      </div>
      {!isPersonsListNotEmpty && <NoData />}
      <PreviewImage
        image={previewImage}
        open={previewImageStatus}
        onClose={() => setPreviewImageStatus(false)}
      />
      <Pagination
        page={tempPageNo}
        rowsPerPage={page}
        count={personsCount}
        onChangeRowsPerPage={onChangeRowsPerPage}
        onChangePage={onChangePage}
      />
    </div>
  );
}

UsersList.defaultProps = {
  onEdit: () => {}
};

UsersList.propTypes = {
  onEdit: PropTypes.func
};

export default connect(({ faceEnrollment }) => ({ faceEnrollment }))(UsersList);
