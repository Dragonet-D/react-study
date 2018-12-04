import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render((
  <BrowserRouter>
    <Switch>
      <Route path='/' component={App}/>
    </Switch>
  </BrowserRouter>
  ), document.getElementById('root'));
registerServiceWorker();
