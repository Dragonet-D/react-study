import fetch from "isomorphic-fetch";
const ACTIONS = {
	increase(){
		return{
			type:"INCREASE"
		}
	},
	decrease(){
		return{
			type:"DECREASE"
		}
	},
	increase_async(){
		return async (dispatch)=>{
			// response is a Promise object
			// to handle the data from server,you should return this Promise object
			try{
				const URL = Math.random()>0.5?
					"http://192.168.2.116:7777/shundai/CoffeeManagementUserList":
					"http://192.168.2.16:7777/shundai/CoffeeManagementUserList";
					
				await fetch(URL).then((response)=>{
					return response.json();
				});

				// success
				dispatch(ACTIONS.increase());
			}catch(e){
				// error
				dispatch(ACTIONS.decrease());
			}
		}
	}
}

export default ACTIONS;