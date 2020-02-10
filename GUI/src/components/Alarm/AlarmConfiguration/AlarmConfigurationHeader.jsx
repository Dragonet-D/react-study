import React from 'react';
import { Button, Permission } from 'components/common';
import materialKeys from 'utils/materialKeys';
import { Translate } from 'react-i18nify';
import styles from './AlarmConfigurationHeader.module.less';

function AlarmConfigurationHeader(props) {
  const { handleAction, open } = props;
  const handleHeaderAction = target => () => {
    handleAction(target);
  };

  return (
    <div className={`${styles.wrapper} ${open ? styles.show : ''}`}>
      {open && (
        <div className={styles.btns}>
          <Button color="primary" onClick={handleHeaderAction('updateAlarm')}>
            <Translate value="alarm.config.updateAlarm" />
          </Button>
          <Permission materialKey={materialKeys['M4-61']}>
            <Button color="primary" onClick={handleHeaderAction('setting')}>
              <Translate value="alarm.config.settings" />
            </Button>
          </Permission>
          <Permission materialKey={materialKeys['M4-62']}>
            <Button color="primary" onClick={handleHeaderAction('deliveryTo')}>
              <Translate value="alarm.config.deliveryTo" />
            </Button>
          </Permission>
        </div>
      )}
    </div>
  );
}

export default AlarmConfigurationHeader;
