import React from 'react';
import ToDo from './components/hooks/ToDo';
import './App.css';

function App() {
  return (
    <div className="App todoapp">
      <h1 data-reactid=".0.0.0">todos</h1>
      <ToDo/>
    </div>
  );
}

export default App;
