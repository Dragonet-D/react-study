import * as React from 'react';
import NameEdit from './NameEdit';

function Callback() {
  const [name, setName] = React.useState('hello')

  const onNameUpdated = (e: string) => {
    setName(e)
  }

  return <NameEdit initialUserName={name} onNameUpdated={onNameUpdated} />
}

export default Callback