# Table

```javascript
import { IVHTable } from 'components/common';

// no header tooltip
const columns = [
    {
      title: '',
      dataIndex: 'key',
      sorter: {
        order: 'desc',
        active: true
      },
      render: text => text,
      renderItem: item => item,
      noTooltip: true
    }
];

// table header with tooltip
const columns = [
    {
      title: {
        title: '',
        tooltip: ''
      },
      dataIndex: 'key'
    }
]
```