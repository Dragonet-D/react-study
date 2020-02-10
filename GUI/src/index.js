import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'url-polyfill';
import dva from 'dva';
import { createBrowserHistory } from 'history';
import createLoading from 'dva-loading';
import _ from 'lodash';
import { I18n } from 'react-i18nify';
import enUS from './locales/en-US.js';
import zhCN from './locales/zh-CN.js';
import { autoUpdateSession, clearAutoUpdateSession } from './utils/helpers';
import userLoginInfo from './utils/userHelper';
import * as serviceWorker from './serviceWorker';
import './index.css';

I18n.setTranslations({
  enUS,
  zhCN
});

I18n.setLocale('enUS');

// 1. Initialize
const app = dva({
  history: createBrowserHistory()
});

// 2. Plugins
app.use(createLoading());

// 3. Register global model
app.model(require('./models/global').default);
app.model(require('./models/messageCenter').default);
app.model(require('./models/dialogWindow').default);

// 4. Router
app.router(require('./router').default);

const userInfo = JSON.parse(userLoginInfo.get());

// 5. Start
app.start('#INTEGRATED_VIDEO_HUB');

if (userInfo) {
  const { dispatch } = app._store; // eslint-disable-line
  const userId = _.get(userInfo, 'userInfo.userId', '');
  dispatch({
    type: 'global/connectCommonWebSocket',
    payload: userId
  });
  dispatch({
    type: 'global/getUserInfo',
    payload: {
      userId
    }
  });
  dispatch({
    type: 'global/setUserId',
    payload: {
      userId
    }
  });
  autoUpdateSession();
} else {
  clearAutoUpdateSession();
}

export default app._store;  // eslint-disable-line
export { app };

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
