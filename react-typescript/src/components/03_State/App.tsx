import * as React from 'react';
import NameEditComponent from './NameState'

const App = () => {

  const [name, setName] = React.useState('initial name')

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target
    setName(value)
  }

  return (
      <NameEditComponent userName={name} onChange={handleNameChange} />
  )
}

export default App