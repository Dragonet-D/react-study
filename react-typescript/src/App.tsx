import * as React from 'react';
import { HashRouter as Router, Link, Route, Switch } from 'react-router-dom';
import './App.css'
import StateTest from './components/03_State/App'
import Test from './components/Test/index';

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
        <Link to='/StateTest'>StateTest</Link>
        <Switch>
          <Route exact path='/' component={TestCom} />
          <Route path='/StateTest' component={StateTest} />
        </Switch>
      </Router>
    );
  }
}

export default App;
