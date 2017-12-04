import React,{ Component } from "react";
import classNames from "classnames";
import style from "./style.scss";

export default class App extends Component{
	render(){
		const classnames = classNames({
			[style.box]:true,
		});

		return(
			<div className={classnames}>
				<div>A</div>
				<div>B</div>
				<div>C</div>
				<div>D</div>
				<div>E</div>
			</div>
		)
	}
}

