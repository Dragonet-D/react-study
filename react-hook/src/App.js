import React from 'react';
import {BrowserRouter, Link, Route, Switch} from 'react-router-dom';
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

import {Button} from "antd";

import './App.css';

function TestApp(props) {
  return (
    <div>
      <Link to="/">
        <Button>Home</Button>
      </Link>
      <Link to="/test">
        <Button>test</Button>
      </Link>
      <Link to="/leaflet">
        <Button>leaflet</Button>
      </Link>
      <Link to="/css">
        <Button>css</Button>
      </Link>
      <Link to="/hoc">
        <Button>hoc</Button>
      </Link>
      <Link to="/context">
        <Button>context</Button>
      </Link>
      <Link to="/antd-test">
        <Button>antd-test</Button>
      </Link>
      <Link to="/redux-test">
        <Button>redux-test</Button>
      </Link>
    </div>
  )
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <TestApp/>
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
      </BrowserRouter>
    </Provider>
  );
}

export default App;
