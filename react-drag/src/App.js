import React, {Component} from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import {DragDropContext} from 'react-dnd';
// import Test1 from './components/test/test1';
// import Test2 from './components/test/test2';
// import DustbinMultipleTargets from "./components/Multiple Targets";
import DustbinSingleTarget from "./components/Single Target";

class App extends Component {
  render() {
    return (
        <div className="App">
          {/*<Test1 text="你好,世界"/>*/}
          {/*<Test2 text="Hello World"/>*/}
          {/*<DustbinMultipleTargets/>*/}
          <DustbinSingleTarget/>
        </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);
