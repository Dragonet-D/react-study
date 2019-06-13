import React, {createContext} from "react";

const store = {
    name: "Tom"
};

// 创建上下文
const Context1 = createContext();
const {Provider, Consumer} = Context1;

const withProvider = Comp => props => (
    <Provider value={store}>
        <Comp {...props}/>
    </Provider>
);

const withConsumer = Comp => props => (
    <Consumer>
        {
            value => <Comp {...props} value={value}/>
        }
    </Consumer>
);

class Inner extends React.Component {
    render() {
        return (
            <div>{this.props.value.name}</div>
        )
    }
}

const Inner1 = withConsumer(Inner);

function Context(props) {
    return (
        <Inner1/>
    )
}

export default withProvider(Context);