import React, {useState} from 'react';
import {BrowserRouter, Link, Route, Switch, Redirect} from 'react-router-dom';
import ToDo from './components/hooks/ToDo';
import Test from './components/hooks/Test';
import LeafLet from './components/leaflet';
import CssTest from './components/cssTest';
import Hoc1 from "./components/hoc";
import ContextTest from "./components/contextWithHoc";
import AntdTest from "./components/antdTest";
import ReduxTest from "./components/reduxTest";
import NoMatch from "./components/noMatch";
import RouterTest from "./components/reactRouter";
import HooksOptimization from './components/hooks/HooksOptimization';
import Resizeable from './components/hooks/Resizeable';

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
      <Link to="/router">
        <Button>router-test</Button>
      </Link>
    </div>
  )
}

// 路由守卫: 定义可以验证的高阶组件
function PrivateRoute({component: Com, ...rest}) {
  return (
    <Route {...rest} render={
      (props) => auth.isLogin ? <Com {...props}/> :
        <Redirect to={{
          pathname: "/login",
          state: {
            from: props.location.pathname
          }
        }}/>
    }/>
  )
}

// 接口
const auth = {
  isLogin: false,
  login(cb) {
    this.isLogin = true;
    setTimeout(cb("成功"), 300)
  }
};

// 登录组件
function Login(props) {
  const [isLogin, setIsLogin] = useState(false);

  function loginIn() {
    auth.login(() => {
      setIsLogin(true)
    })
  }

  const {from } = props.location.state;
  if (isLogin) {
    return <Redirect to={from}/>
  }
  return (
    <React.Fragment>
      <p>请登录</p>
      <button onClick={loginIn}>登录</button>
    </React.Fragment>
  )
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <TestApp/>
        <Switch>
          <Route exact path="/" component={ToDo}/>
          <Route path="/test" component={Test}/>
          <Route path="/leaflet" component={LeafLet}/>
          <Route path="/css" component={CssTest}/>
          <Route path="/hoc" component={Hoc1}/>
          <Route path="/context" component={ContextTest}/>
          <Route path="/antd-test" component={AntdTest}/>
          <Route path="/redux-test" component={ReduxTest}/>
          <PrivateRoute path="/router" component={RouterTest}/>
          <Route path="/login" component={Login}/>
          <Route path="/hooks-optimization" component={HooksOptimization}/>
          <Route path="/resizeable" component={Resizeable}/>
          <Route component={NoMatch}/>
        </Switch>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
