import React,{ Component } from "react";
import PropTypes from "prop-types";

export default class Counter extends Component{
	componentDidMount() {
		let { increase_async } = this.props;
		increase_async();
	}
	render(){
		const { 
			value, 
			user,
			increase,
			decrease,
			increase_async
		} = this.props;

		return(
			<div>
				<h2>{ value }</h2>
				<button onClick = {increase}>Increase</button>
				<span dangerouslySetInnerHTML = {{__html:"<-->"}}></span>
				<button onClick = {decrease}>Decrease</button>
				<span dangerouslySetInnerHTML = {{__html:"<-->"}}></span>
				<button onClick = {increase_async}>Increase_Async</button>
				
			</div>
		)
	}
}

Counter.propTypes = {
	value: PropTypes.number.isRequired,
	increase: PropTypes.func.isRequired,
	decrease: PropTypes.func.isRequired,
	increase_async: PropTypes.func.isRequired,
}