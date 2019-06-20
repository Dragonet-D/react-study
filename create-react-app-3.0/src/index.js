import '@babel/polyfill';
import 'url-polyfill';
import dva from 'dva';
import { createBrowserHistory } from 'history';
import createLoading from 'dva-loading';
import global from './models/global';
import './index.css';

// 1. Initialize
const app = dva({
  history: createBrowserHistory()
});

// 2. Plugins
app.use(createLoading());

// 3. Register global model
app.model(global.default);

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
