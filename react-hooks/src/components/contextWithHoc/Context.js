import React, {
  createContext,
  Fragment,
  Children,
  cloneElement
} from "react";

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

// children 是任意合法的js表达式, 包括函数
// 模拟接口
const api = {
  getUser: () => ({name: "Jerry", age: 20})
};

function Fetcher(props) {
  const user = api[props.name]();
  return props.children(user);
}

// children 是否可修改 不可修改
function FilterP(props) {
  return (
      <Fragment>
        {React.Children.map(props.children, child => {
          console.log(child);
          // child vdom
          if ("p" !== child.type) { // 过滤非p标签
            return;
          }
          return child;
        })}
      </Fragment>
  )
}

function RadioGroup(props) {
  return (
      <Fragment>
        {
          Children.map(props.children, child => {
            return cloneElement(child, {
              name: props.name
            });
          })
        }
      </Fragment>
  )
}

function Radio({children, ...rest}) {
  return (
      <label htmlFor="">
        <input
            type="radio"
            {...rest}
        />
        {children}
      </label>
  );
}

function Context(props) {
  return (
      <Fragment>
        <Inner1/>
        {/*children 内容可以是任意表达式*/}
        <Fetcher name="getUser">
          {({name, age}) => <p>{name} - {age}</p>}
        </Fetcher>
        {/*操作children*/}
        <FilterP>
          <h3>h3</h3>
          <p>p标签</p>
        </FilterP>
        {/*编辑children*/}
        <RadioGroup name="mvvm">
          <Radio value="vue">vue</Radio>
          <Radio value="react">react</Radio>
          <Radio value="angular">angular</Radio>
        </RadioGroup>
      </Fragment>
  )
}

export default withProvider(Context);