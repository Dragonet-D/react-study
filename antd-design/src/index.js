import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import './index.css';
import App from './App';
import Router1 from "./components/Router1/Router1"
import Router2 from "./components/Router1/Router2"
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render((
  <BrowserRouter basename="/hello">
    <Switch>
      <Route path='/' component={App} exact/>
      <Route path='/router1' component={Router1} exact/>
      <Route path='/router2' component={Router2} exact/>
    </Switch>
  </BrowserRouter>
  ), document.getElementById('root'));
registerServiceWorker();
