import React, { Component } from 'react';
import IndexList from './components/List/Index';
import IndexTable from './components/Table/Index';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <IndexList/>
        <IndexTable/>
      </div>
    );
  }
}

export default App;
