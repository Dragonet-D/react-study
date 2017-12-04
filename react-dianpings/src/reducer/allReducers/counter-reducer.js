export default function count(state = {
	value:0,
},action){
	switch(action.type){
		case "INCREASE":
			return{
				value:++state.value
			};
		case "DECREASE":
			return{
				value:--state.value
			}
		case "INCREASE_ASYNC":
			return{
				value:state.value + 2,
			}
		// this is required
		default:
			return state;
	}
}
