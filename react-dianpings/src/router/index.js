import React,{ Component } from "react";
import { Router,Route,Link,browserHistory,IndexRoute } from "react-router";
import { Provider } from "react-redux";
import store from "../store";
import {
	App,
	Counter,
	Welcome,
	Paging
} from "./components.js"

export default class ROOT extends Component{
	render(){
		return(
			<Provider store = { store }>
				<Router history={browserHistory}>
					<Route path="/" component = { App }>
						<IndexRoute component = { Welcome } />
						<Route path="counter" component = { Counter }></Route>
						<Route path="welcome" component = { Welcome }></Route>
					</Route>
				</Router>
			</Provider>
		);
	}
}