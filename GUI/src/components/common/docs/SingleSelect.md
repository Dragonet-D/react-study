# SingleSelect

you will get data by the **onSelct** function and the you need to give the data back by **value**

```js
import { SingleSelect } from 'components/common';

export function Test() {

  const [value, setValue] = useState('');

  function selectedDataRange(e) {
    setValue(e);
  }

  return (
    <SingleSelect
      label="Date range"
      value={value}
      selectOptions={["Hello", "World"]}
      onSelect={selectedDataRange}
      disabled={false}
    />
  )
}
```
