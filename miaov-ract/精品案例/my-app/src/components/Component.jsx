import React, {Component} from 'react'

class MyComponent extends Component {
  constructor() {
    super()
  }

  componentWillMount() {
    /*componentWillMount()在装配发生之前被立刻调用.其在render()之前被调用,音痴在这方法里同步地设置将不会触发重渲.避免在该方法中加入任何的副作用或订阅.*/
    // 这是唯一的会在服务端渲染调起的生命周期钩子函数.通常地.我们推荐使用constructer()来替代
  }

  componentDidMount() {
    /*componentDidMount() 在组件被装配后立即调用.初始化是的DOM节点应该进行到这里.若你需要从远端加载数据,这个一个适合实现网络请求的地方.在该方法里设置状态会被重渲.*/
  }

  componentWillReceiveProps() {
    /*
    componentWillReceiveProps()在装配了的组件接收到新的属性前调用.若你需要更新状态相应的属性改变(例如, 重置他),你可能需对比this.props和nextProps并在该方法中使用this.setState()处理状态改变.
    注意即使属性唯有任何变化,React可能也会掉用该方法,因此若你想要处理改变,请确保比较当前和之后的值.这可能会发生在当父组件引起你的组件重渲;
    在装配期间,React并不会调用带有初始属性的componentWillReceiveProps方法.其仅会调用该方法若果某些组件的属性可更新.调用this.setState通常不会触发componentWillReceiveProps.
    */
  }
}