import * as React from 'react';
import Test from "./components/Test/index";

class App extends React.Component {
  public constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <div className="App">
        <Test index='123' />
      </div>
    );
  }
}

export default App;
