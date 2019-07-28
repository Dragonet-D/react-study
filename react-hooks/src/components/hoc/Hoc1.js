import React, {Component} from "react";

// 高阶组件
const WithStupidCom = (Comp) => {
    // 甚至可以重写生命周期

    class NewComponent extends Component {
        componentDidMount() {
            // console.log("do something");
        }

        render() {
            return <Comp {...this.props} name="高阶组件的使用介绍"/>
        }
    }

    return NewComponent;
};

const HocCom = Comp => {
    return props => <Comp {...props} name="高阶组件"/>
};

const WithLog = Comp => {
    console.log("Component Rendered");
    return props => <Comp {...props}/>
};

export {HocCom, WithLog};
export default WithStupidCom;