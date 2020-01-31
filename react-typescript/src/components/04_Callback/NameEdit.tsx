import * as React from 'react';
import {Input, Button} from 'antd'

interface IProps {
  initialUserName: string
  onNameUpdated: (newName: string) => any
}

function NameEdit(props: IProps) {
  const {initialUserName, onNameUpdated} = props
  const [editingName, setEditingName] = React.useState(initialUserName)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingName(e.target.value)
  }

  const onSubmit = (e: any): void => {
    onNameUpdated(editingName)
  }

  return (
      <>
        <Input value={editingName} onChange={onChange} />
        <Button onClick={onSubmit}>Change</Button>
      </>
  )
}

export default NameEdit