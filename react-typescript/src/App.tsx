import * as React from 'react';
import { HashRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Button from '@material-ui/core/Button'
import StateTest from './components/03_State/App';
import Test from './components/Test/index';
import Callback from './components/04_Callback/App';
import Refactor from './components/05_Refactor/App';
import ToDo from './pages/todo/ToDo';
import './App.css'

class App extends React.Component {
  public constructor(props: any) {
    super(props);
  }

  public handleDataGet = (data: string) => {
    console.log(data)
  };

  public render() {
    const TestCom = () => <Test getData={this.handleDataGet} index='1' />;
    return (
      <Router>
        <Button>
          <Link to='todo'>todo</Link>
        </Button>
        <Switch>
          <Route exact path='/' component={TestCom} />
          <Route path='/StateTest' component={StateTest} />
          <Route path='/Callback' component={Callback} />
          <Route path='/Refactor' component={Refactor} />
          <Route path='/ToDo' component={ToDo} />
        </Switch>
      </Router>
    );
  }
}

export default App;
