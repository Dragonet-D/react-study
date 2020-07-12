从v16.3.0开始will相关的生命周期钩子被标记为unsafe

- componentWillMount
- componentWillReceiveProps
- componentWillUpdate

原因

1. 这三个钩子经常被错误使用,并且出现了更好的替代方案(这里指新增的getDerivedStateFromProps与getSnapshotBeforeUpdate);
2. React从Legacy模式迁移到Concurrent模式后, 这些钩子的表现会和之前不一致;

### 被误用的钩子

componentWillReceiveProps不是每次props改变之后都更新

```javascript
if (
    unresolvedOldProps !== unresolvedNewProps ||
    oldContext !== nextContext
) {
  callComponentWillReceiveProps(
  
)
}
```
callComponentWillReceiveProps方法会调用componentWillReceiveProps

