import React,{ Component } from "react";
import { Link } from "react-router";

export default class App extends Component{
	render(){
		let childs = React.Children.toArray(this.props.children);

		return(
			<div>
				<h1>App</h1>
				<ul>
					<li><Link to="/welcome" activeClassName = "active">Welcome</Link></li>
					<li><Link to="/counter" activeClassName = "active">Counter</Link></li>
				</ul>
				{ childs }
			</div>
		)
	}
}

