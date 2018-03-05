import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import todoApp from './reducers';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

let store = createStore(todoApp);

ReactDOM.render(
    <Provider store={store}>
      <App/>
    </Provider>, document.getElementById('root'));
registerServiceWorker();
