import React from 'react';
import ToDo from './components/hooks/ToDo';
import Test from './components/hooks/Test';
import './App.css';

function App() {
  return (
    <React.Fragment>
      <div className="App todoapp">
        <h1 data-reactid=".0.0.0">todos</h1>
        <ToDo/>
      </div>
      <Test/>
    </React.Fragment>
  );
}

export default App;
