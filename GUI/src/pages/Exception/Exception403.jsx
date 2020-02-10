import React from 'react';
import Exception from 'components/Exception';
import { I18n } from 'react-i18nify';

function Exception403() {
  return (
    <Exception
      type={403}
      title="403"
      backText={I18n.t('global.button.backToHome')}
      path="/aaa"
      remind={I18n.t('global.exception.403')}
    />
  );
}

export default Exception403;
