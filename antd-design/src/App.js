import React, { Component } from 'react';
import IndexList from './components/List/Index';
import IndexTable from './components/Table/Index';
import Sortable from './components/Drag/Sortable';
import DropDownList from './components/DropDownList/DropDownList';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <IndexList/>
        <IndexTable/>
        <Sortable/>
        <DropDownList/>
      </div>
    );
  }
}

export default App;
