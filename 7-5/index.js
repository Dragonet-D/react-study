let Hello = React.createClass({
  render:function () {
    return(
      <div>
        <h1>{this.props.name}</h1>
        <Age age={this.props.age}/>
        <LinkButton/>
      </div>
    )
  }
});
let Age = React.createClass({
  render:function () {
    return(
      <span style={{background:'red'}}>My age is {this.props.age}</span>
    )
  }
});
let LinkButton = React.createClass({
  getInitialState:function () {
    return {link:false}
  },
  handleClick:function (event) {
    this.setState({Liked: !this.state.Liked});
  },
  render:function () {
    let text = this.state.Liked ? 'like':'don\'t liked';
    return(
      <p onClick={this.handleClick}>
        you {text} this.click to toggle.
      </p>
    )
  }
});
let props = {};
props.name = "steven";
props.age = 12;




ReactDOM.render(<Hello {...props}/>,document.getElementById('box'));
