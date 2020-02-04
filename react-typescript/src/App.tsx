import * as React from 'react';
import { HashRouter as Router, Link, Route, Switch } from 'react-router-dom';
import {Button} from 'antd'
import './App.css'
import StateTest from './components/03_State/App'
import Test from './components/Test/index';
import Callback from './components/04_Callback/App';
import Refactor from './components/05_Refactor/App';

class App extends React.Component {
  public constructor(props: any) {
    super(props);
  }

  public handleDataGet = (data: string) => {
    console.log(data);
  };

  public render() {
    const TestCom = () => <Test getData={this.handleDataGet} index='1' />;
    return (
      <Router>
        <Button type='link'>
          <Link to='/StateTest'>StateTest</Link>
        </Button>
        <Button type='link'>
          <Link to='/Callback'>Callback</Link>
        </Button>
        <Button type='link'>
          <Link to='/Refactor'>Refactor</Link>
        </Button>
        <Switch>
          <Route exact path='/' component={TestCom} />
          <Route path='/StateTest' component={StateTest} />
          <Route path='/Callback' component={Callback} />
          <Route path='/Refactor' component={Refactor} />
        </Switch>
      </Router>
    );
  }
}

export default App;
