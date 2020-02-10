import React from 'react';
import { I18n } from 'react-i18nify';
import Exception from 'components/Exception';

function Exception404() {
  return (
    <Exception
      type={404}
      title="404"
      backText="Back to home"
      path="/aaa"
      remind={I18n.t('global.exception.404')}
    />
  );
}

export default Exception404;
