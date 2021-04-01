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

所以不是每次props的更新都会执行

unsafe的原因是react换了架构; 可能会导致多次更新;

### Concurrent (同时) 调度模式

特点是任何一个更新任务都可以被更高优先级中断插队, 在高优先级任务执行之后再执行;

"同时执行多个更新任务"指的是同时将多个更新任务添加到React调度的任务队列中,然后React会一个个执行, 而不是类似多线程同时工作那种方式;
