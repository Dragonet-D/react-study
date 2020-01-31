import * as React from 'react';
import Refactor from './NameEdit';

const App = () => {
  const [name, setName] = React.useState('defaultUserName');
  const [editingName, setEditingName] = React.useState('defaultUserName');

  const loadUsername = () => {
    setTimeout(() => {
      setName('name from async call');
      setEditingName('name from async call');
    }, 500);
  };

  React.useEffect(() => {
    loadUsername();
  }, []);

  const setUsernameState = () => {
    setName(editingName);
  };

  const onEditingNameUpdated = (n: string) => {
    setName(n)
  }

  return (
    <>
      <p>{name}</p>
      <Refactor
        initialUserName={name}
        editingName={editingName}
        onNameUpdated={setUsernameState}
        onEditingNameUpdated={onEditingNameUpdated}
      />
    </>
  );
};

export default App