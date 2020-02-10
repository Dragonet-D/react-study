import React, { useState, useCallback } from 'react';
import { I18n } from 'react-i18nify';
import store from '@/index';
import { TextField, Button } from 'components/common';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => {
  return {
    wrapper: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(1),
      width: '70%'
    },
    search_wrapper: {
      display: 'flex',
      alignItems: 'center',
      width: '100%'
    },
    item: {
      margin: `0 ${theme.spacing(1)}px`
    }
  };
});

function EnrollmentHeader() {
  const classes = useStyles();
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');

  const handleUserId = ({ target }) => {
    const { value } = target;
    setUserId(value);
  };

  const handlePersonName = ({ target }) => {
    const { value } = target;
    setUserName(value);
  };

  const handleSearch = useCallback(() => {
    store.dispatch({
      type: 'faceEnrollment/handleSearchPersonInformation',
      payload: { userId, userName }
    });
  }, [userId, userName]);

  return (
    <div className={classes.wrapper}>
      <div className={classes.search_wrapper}>
        <TextField
          label={I18n.t('vap.face.faceEnrollment.identifyNo')}
          fullWidth
          value={userId}
          placeholder={I18n.t('vap.face.faceEnrollment.identifyNo')}
          onChange={handleUserId}
          className={classes.item}
        />
        <TextField
          label={I18n.t('vap.label.personName')}
          placeholder={I18n.t('vap.label.personName')}
          fullWidth
          value={userName}
          className={classes.item}
          onChange={handlePersonName}
        />
        <Button size="small" variant="contained" color="secondary" onClick={handleSearch}>
          {I18n.t('vap.button.search')}
        </Button>
      </div>
    </div>
  );
}

export default EnrollmentHeader;
