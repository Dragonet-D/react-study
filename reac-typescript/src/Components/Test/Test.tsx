import * as React from "react";

export default
class Test extends React.Component {
    public state = {
        a: "hello ts"
    };

    public testClick = () => {
        this.setState({
            a: "hello world!!!"
        })
    };

    public render() {
        const {a} = this.state;
        return (
            <div onClick={this.testClick}>{a}</div>
        );
    }
}