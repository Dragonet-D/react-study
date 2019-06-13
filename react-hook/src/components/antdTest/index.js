import React from "react";
import "./style.scss";

function AFormCreate(Comp) {
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.options = {};
            this.state = {};
        }

        handleChange = e => {
            const {name, value} = e.target;
            this.setState({
                [name]: value
            })
        };

        getFieldDec = (field, option, InputComp) => {
            this.options[field] = option;
            return (
                <div>
                    {
                        React.cloneElement(InputComp, {
                            name: field, // 控件name
                            value: this.state[field] || "", // 控件值
                            onChang: this.handleChange // change 事件
                        })
                    }
                </div>
            );
        };

        render() {
            return (
                <Comp
                    {...this.props}
                    getFieldDec={this.getFieldDec}
                    value={this.state}
                />
            )
        }
    }
}

function AntdTest(props) {

    const onSubmit = () => {
        console.log(props.value);
    };

    const {getFieldDec} = props;
    return (
        <div className="wrapper">
            {
                getFieldDec("username", {
                    rules: [
                        {required: true, message: "请输入用户名"}
                    ]
                }, <input type="text"/>)
            }
            {
                getFieldDec("pwd", {
                    rules: [
                        {required: true, message: "请输入密码"}
                    ]
                }, <input type="password"/>)
            }
            <button onClick={onSubmit}>登录</button>
        </div>
    )
}

export default AFormCreate(AntdTest);