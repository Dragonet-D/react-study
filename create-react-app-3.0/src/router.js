import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// eslint-disable-next-line import/no-unresolved
import ToDo from 'pages/todo';
import App from './App';

function AppRouter() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/todo" component={ToDo} />
      </Switch>
    </BrowserRouter>
  );
}

export default AppRouter;
