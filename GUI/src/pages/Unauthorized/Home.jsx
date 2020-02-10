import React from 'react';
import Unauthorized from 'components/Exception';
import { I18n } from 'react-i18nify';

function UnauthorizedHome() {
  return (
    <Unauthorized
      type={403}
      title={I18n.t('global.unauthorized.homeTitle')}
      backText={I18n.t('global.button.backToLogin')}
      path="/aaa"
      remind={I18n.t('global.unauthorized.home')}
    />
  );
}

export default UnauthorizedHome;
