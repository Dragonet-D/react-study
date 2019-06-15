import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import ToDo from './components/hooks/ToDo';
import Test from './components/hooks/Test';
import LeafLet from './components/leaflet';
import CssTest from './components/cssTest';
import Hoc1 from "./components/hoc";
import ContextTest from "./components/contextWithHoc";
import AntdTest from "./components/antdTest";
import ReduxTest from "./components/reduxTest";
import NoMatch from "./components/noMatch";

import {Provider} from "react-redux";
import store from "./store";

import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/" component={ToDo}/>
          <Route path="/test" component={Test}/>
          <Route path="/leaflet" component={LeafLet}/>
          <Route path="/css" component={CssTest}/>
          <Route path="/hoc" component={Hoc1}/>
          <Route path="/context" component={ContextTest}/>
          <Route path="/antd-test" component={AntdTest}/>
          <Route path="/redux-test" component={ReduxTest}/>
          <Route component={NoMatch}/>
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
