import React, { memo, useState } from 'react';
import { I18n } from 'react-i18nify';
import { Button } from 'components/common';
import store from '@/index';
import makeStyles from '@material-ui/core/styles/makeStyles';
import SwitchControl from '../SwitchControl';

const useStyles = makeStyles(theme => {
  return {
    wrapper: {
      display: 'flex',
      alignItems: 'center',
      marginLeft: 'auto'
    },
    btn_wrapper: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginLeft: theme.spacing(1)
    },
    face_enroll: {
      marginLeft: theme.spacing(1)
    }
  };
});

const ManagementHandle = memo(({ handleClick, getMode }) => {
  const moduleName = 'faceEnrollment';
  const classes = useStyles();
  const [trigger, setTrigger] = useState(false);
  const [label, setLabel] = useState(I18n.t('vap.face.faceEnrollment.searchByPerson'));

  function handleTrigger(e) {
    const { checked } = e.target;
    setTrigger(checked);
    store.dispatch({
      type: `${moduleName}/handleChoseGroupData`,
      payload: {}
    });
    store.dispatch({
      type: `${moduleName}/handleSearchPersonInformation`,
      payload: {}
    });
    if (checked) {
      getMode('group');
      setLabel(I18n.t('vap.face.faceEnrollment.searchByGroup'));
    } else {
      setLabel(I18n.t('vap.face.faceEnrollment.searchByPerson'));
      getMode('person');
    }
  }
  return (
    <div className={classes.wrapper}>
      <SwitchControl trigger={trigger} handleTrigger={handleTrigger} label={label} />
      <div className={classes.btn_wrapper}>
        <Button
          size="small"
          color="secondary"
          onClick={() => handleClick('groupManagement')}
          variant="contained"
        >
          {I18n.t('vap.button.groupManagement')}
        </Button>
        <Button
          size="small"
          color="secondary"
          variant="contained"
          onClick={() => handleClick('faceEnrollment')}
          className={classes.face_enroll}
        >
          {I18n.t('vap.button.faceEnrollment')}
        </Button>
      </div>
    </div>
  );
});

ManagementHandle.whyDidYouRender = true;

ManagementHandle.defaultProps = {
  handleClick: () => {},
  getMode: () => {}
};

export default ManagementHandle;
