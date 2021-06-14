import { useState } from 'react'
import './App.css';

function f() {
  return Promise.resolve(122)
}

function App() {
  const [count, setCount] = useState(0)
  const [count1, setCount1] = useState(0)

  const handleClick = () => {
    f().then(() => {
      setCount(e => e + 1)
      setCount1(e => e + 2)
    })
  }

  console.log('render');

  return (
    <div className="App">
      <header className="App-header">
        {`${count} - ${count1}`}
        <button onClick={handleClick}>test count</button>
      </header>
    </div>
  );
}

export default App;
