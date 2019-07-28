import React, {Fragment} from "react";

function AFormCreate(Comp) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.options = {};
      this.state = {};
    }

    // 处理表单项输入事件
    handleChange = e => {
      const {name, value} = e.target;
      this.setState({
        [name]: value
      }, () => {
        this.validateField(name);
      });
    };

    validateField = field => {
      const rules = this.options[field].rules;
      const result = rules.some(rule => {
        if (rule.required) {
          if (!this.state[field]) {
            // 校验失败
            this.setState({
              [field + 'Message']: rule.message
            });
            // 若有校验失败
            return true;
          }
        }
        return false;
      });
      // 没失败, 校验成功
      if (!result) {
        this.setState({
          [field + 'Message']: ""
        })
      }
      return !result;
    };

    // 校验所有字段
    validate = cb => {
      const result = Object.keys(this.options).map(field => {
        return this.validateField(field)
      }).every(item => item === true);
      // 如果校验结果全部为true 校验成功
      cb(result);
    };

    getFieldDec = (field, option, InputComp) => {
      this.options[field] = option;
      return (
        <div>
          {
            React.cloneElement(InputComp, {
              name: field, // 控件name
              value: this.state[field] || "", // 控件值
              onChange: this.handleChange, // change 事件
              onFocus: this.handleFocus
            })
          }
        </div>
      );
    };

    // 焦点
    handleFocus = (e) => {
      const field = e.target.name;
      this.setState({
        [field + 'Focus']: true
      });
    };

    // 判断是否被点过
    isFieldTouched = field => {
      return !!this.state[field + 'Focus']
    };

    getFieldError = field => this.state[field + "Message"];

    render() {
      return (
        <Comp
          {...this.props}
          getFieldDec={this.getFieldDec}
          value={this.state}
          validate={this.validate}
          isFieldTouched={this.isFieldTouched}
          getFieldError={this.getFieldError}
        />
      )
    }
  }
}

class FormItem extends React.Component {
  render() {
    return (
      <Fragment>
        {
          this.props.children
        }
        {
          this.props.validateStatus === "error" && (
            <p>{this.props.help}</p>
          )
        }
      </Fragment>
    )
  }
}

function Input(props) {
  return (
    <Fragment>
      {
        props.prefix
      }
      <input type="text" {...props}/>
    </Fragment>
  )
}

function AntdTest(props) {
  const {
    getFieldDec,
    validate,
    isFieldTouched,
    getFieldError
  } = props;

  const usernameError = isFieldTouched("username") && getFieldError("username");
  const passwordError = isFieldTouched("pwd") && getFieldError("pwd");

  const onSubmit = () => {
    validate((isValid => {
      if (isValid) {
        console.log(props.value);
      }
    }))
  };

  return (
    <div className="wrapper">
      <FormItem
        validateStatus={usernameError ? "error" : ""}
        help={usernameError || ""}
      >
        {
          getFieldDec("username", {
            rules: [
              {required: true, message: "请输入用户名"}
            ]
          }, <Input type="text" prefix={"123"}/>)
        }
      </FormItem>
      <FormItem
        validateStatus={passwordError ? "error" : ""}
        help={passwordError || ""}
      >
        {
          getFieldDec("pwd", {
            rules: [
              {required: true, message: "请输入密码"}
            ]
          }, <Input type="password"/>)
        }
      </FormItem>
      <button onClick={onSubmit}>登录</button>
    </div>
  )
}

export default AFormCreate(AntdTest);