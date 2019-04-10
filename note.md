# React

```javascript
export default class ReactComponent {
  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }
}
```

dark #171717
light #464646
main #1f1f1f