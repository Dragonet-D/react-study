import React from 'react';
import { I18n } from 'react-i18nify';
import Exception from 'components/Exception';

function Exception500() {
  return (
    <Exception
      type={500}
      title="500"
      backText="Back to home"
      path="/aaa"
      remind={I18n.t('global.exception.500')}
    />
  );
}

export default Exception500;
