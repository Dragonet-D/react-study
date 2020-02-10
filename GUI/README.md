## Developer Document
###### Created by 7 July 2019
#### 1. 基础要求
如果你以前有使用其他SPA框架或库的经验，你应该非常熟悉web开发的基础知识。如果您刚刚开始学习web开发，在学习React之前，你应该学习HTML、CSS和JavaScript ES5， ES6。
- [React 官方文档](https://zh-hans.reactjs.org/docs/getting-started.html)
    - [核心概念](https://zh-hans.reactjs.org/docs/hello-world.html)
    - [高级指引](https://zh-hans.reactjs.org/docs/accessibility.html)
    - [HOOK](https://zh-hans.reactjs.org/docs/hooks-intro.html)
    - [如何构建一个页面](https://zh-hans.reactjs.org/docs/thinking-in-react.html)
- [React模式](https://sangka.github.io/react-in-patterns-cn/)
- [ECMAScript 6](https://es6.ruanyifeng.com/)
#### 2. 编辑器
建议统一使用 *Visual Studio Code* 做为Editor。
- Setting配置参考 *（Tab缩进统一为2个Space）*：
```
{
  // 控制字体系列。
  "editor.fontFamily": "Consolas, 'Courier New', monospace,'宋体'",
  // 以像素为单位控制字号。
  "editor.fontSize": 16,
  // 控制选取范围是否有圆角
  "editor.roundedSelection": false,
  // 建议小组件的字号
  "editor.suggestFontSize": 16,
  // 在“打开的编辑器”窗格中显示的编辑器数量。将其设置为 0 可隐藏窗格。
  "explorer.openEditors.visible": 0,
  // 是否已启用自动刷新
  "git.autorefresh": false,
  // 是否启用了自动提取。
  "git.autofetch": false,
  // 以像素为单位控制终端的字号，这是 editor.fontSize 的默认值。
  "terminal.integrated.fontSize": 14,
  // 控制终端游标是否闪烁。
  "terminal.integrated.cursorBlinking": true,
  // 一个制表符等于的空格数。该设置在 `editor.detectIndentation` 启用时根据文件内容进行重写。
  "editor.tabSize": 2,
  // Tab Size
  "beautify.tabSize": 2,
  //jsx自动补全
  "emmet.syntaxProfiles": {
    "javascript": "jsx"
  }
}
```
- 插件推荐
    - Debugger for Chrome
    - Auto Close Tag
    - Auto Rename Tag
    - ......
#### 3. 规范
- **文件命名规范**
    - 在 components 和 pages 目录中的项目命名: 目录下的子文件以目录名开头，并且组件名和类名遵循大驼峰命名规则（首字母大写）。
    ```
    // Example
    ...
    ...
    |-- script
    `-- src
        |-- api
        |-- commons
        |-- components
        |   |-- Login
        |   |   |-- LoginForm.jsx
        |   |   |-- LoginAD.jsx
        |   |   |-- LoginStatic.jsx
        |   |   |-- LoginHeader.jsx
        |   |   ...
        |   ...
        |
        |-- layouts
        ...
    ```
- [Eslint Rules Document](https://cn.eslint.org/docs/rules/)
    - **已配置的 Eslint 规则**
    ```
    {
        "react/jsx-filename-extension": [
          1,
          {
            "extensions": [".js", ".jsx"]
          }
        ],
        "no-plusplus": "off",                       // 禁用一元操作符 ++ 和 --
        "no-shadow": "off",                         // 禁止变量声明与外层作用域的变量同名
        "react/require-default-props": "off",       // 对不是必需的每个React Props强制执行defaultProps定义
        "guard-for-in": "off",                      // 要求 for-in 循环中有一个 if 语句
        "no-prototype-builtins": "off",             // 禁止直接调用 Object.prototypes 的内置属性
        "no-await-in-loop": "off",                  // 禁止在循环中出现 await
        "react/destructuring-assignment": "off",    // Enforce consistent usage of destructuring assignment of props, state, and context
        "import/no-mutable-exports": "off",         // Forbids the use of mutable exports with var or let
        "import/no-cycle": "off",                   // Ensures that there is no resolvable path back to this module via its dependencies.
        "react/sort-comp": "off",                   // Enforce component methods order
        "no-debugger": "off",                       // 禁用 debugger
        "class-methods-use-this": "off",            // 强制类方法使用 this
        "no-unused-vars": "warn",                   // 禁止出现未使用过的变量
        "indent": ["warn", 2, { "SwitchCase": 1 }], // 强制使用一致的缩进
        "prettier/prettier": ["warn"],              // Auto-format/fix much of your code according to your ESLint config
        "linebreak-style": ["warn", "windows"],     // 强制使用一致的换行风格
        "import/prefer-default-export": "off",      // When there is only a single export from a module, prefer using default export over named export
        "implicit-arrow-linebreak": "off",          // 强制隐式返回的箭头函数体的位置
        "no-trailing-spaces": "off",                // 禁用行尾空格
        "generator-star-spacing": [0],              // 强制 generator 函数中 * 号周围使用一致的空格
        "consistent-return": [0],                   // 要求 return 语句要么总是指定返回的值，要么不指定
        "react/forbid-prop-types": [0],             // Forbid certain propTypes
        "global-require": [1],                      // 要求 require() 出现在顶层模块作用域中
        "react/jsx-no-bind": [0],                   // A bind call or arrow function in a JSX prop will create a brand new function on every single render
        "react/prop-types": [0],                    // Typechecking With PropTypes
        "react/no-multi-comp": [0],                 // Prevent multiple component definition per file
        "react/prefer-stateless-function": [0],     // 强制将无状态的React组件编写为纯函数
        "react/jsx-wrap-multilines": [              // Prevent missing parentheses around multiline JSX 
          "error",
          {
            "declaration": "parens-new-line",
            "assignment": "parens-new-line",
            "return": "parens-new-line",
            "arrow": "parens-new-line",
            "condition": "parens-new-line",
            "logical": "parens-new-line",
            "prop": "ignore"
          }
        ],
        "no-else-return": [0],                      // 禁止 if 语句中 return 语句之后有 else 块
        "no-restricted-syntax": [0],                // 禁用特定的语法
        "import/no-extraneous-dependencies": [0],   // Forbid the use of extraneous packages
        "no-use-before-define": [0],                // 禁止在变量定义之前使用它们
        "jsx-a11y/no-static-element-interactions": [0], // Static HTML elements do not have semantic meaning
        "jsx-a11y/no-noninteractive-element-interactions": [0], // Non-interactive HTML elements and non-interactive ARIA roles indicate content and containers in the user interface
        "jsx-a11y/click-events-have-key-events": [0],   // Enforce onClick is accompanied by at least one of the following: onKeyUp, onKeyDown, onKeyPress. 
        "jsx-a11y/anchor-is-valid": [0],                // The HTML <a> element, with a valid href attribute, is formally defined as representing a hyperlink.
        "jsx-a11y/label-has-for": 0,                // Enforce label tags have associated control.
        "no-nested-ternary": [0],                   // 禁用嵌套的三元表达式
        "arrow-body-style": [0],                    // 要求箭头函数体使用大括号
        "import/extensions": [0],                   // import/extensions - Ensure consistent use of file extension within the import path
        "no-bitwise": [0],                          // 禁用按位运算符
        "no-cond-assign": [0],                      // 禁止条件表达式中出现赋值操作符
        "import/no-unresolved": [0],                // Ensures an imported module can be resolved to a module on the local filesystem, as defined by standard Node require.resolve behavior
        "comma-dangle": "off",                      // 要求或禁止末尾逗号
        "object-curly-newline": [0],                // 强制大括号内换行符的一致性
        "function-paren-newline": [0],              // 强制在函数括号内使用一致的换行
        "no-restricted-globals": [0],               // 禁用特定的全局变量
        "require-yield": [1],                       // 要求 generator 函数内有 yield
        "compat/compat": "off",
        "react/jsx-tag-spacing": 0,                 // Validate whitespace in and around the JSX opening and closing brackets
        "react/jsx-uses-react": "error",            // Prevent React to be incorrectly marked as unused    
        "react/jsx-uses-vars": "error"              // Prevent variables used in JSX to be incorrectly marked as unused
    }
    ```
#### 4. Dependencies
- **@material-ui/core**
- **@material-ui/icons**
- **antd**
- **classnames**
    - 一个简单的JavaScript实用程序，用于有条件地将类名连接在一起
    - [文档](https://github.com/JedWatson/classnames#readme)
- **lodash**
    - 一个现代的 JavaScript 工具库
    - [文档](http://lodash.think2011.net/)
#### 5. 项目框架介绍
dva 是一个基于 redux 和 redux-saga 的数据流方案，为了简化开发体验，dva 还额外内置了 react-router 和 fetch，所以也可以理解为一个轻量级的应用框架。如果你熟悉redux，redux-saga，并且熟悉这一套开发流程。那么在使用当前框架开发页面时，将会很容易理解上手。
- [dva Guide](https://dvajs.com/guide/)
- [dva Tutorial](https://github.com/dvajs/dva-docs/tree/master/v1/zh-cn/tutorial)
- **目录结构**
```
|-- config
|-- mock
|-- public
|   |-- static
|   |   |-- config
|   `-- index.html 
|-- script
`-- src
    |-- api
    |-- commons
    |-- components
    |   |-- Theme
    |       |-- Default
    |       `-- Dark
    |
    |-- layouts
    |-- models
    |-- pages
    |-- utils
    |-- index.css
    |-- index.js
    |-- router.js
    `-- setupProxy.js
```
- *config* : 该目录的文件由框架提供。一般来说，我们不需要修改它。
- *mock* ：配置Mock数据，用于生成随机数据，拦截 Fetch 请求。
- *public* ：该文件夹包含项目构建的所有生产环境文件。最终，我们在src/文件夹中编写的代码将被打包，并在项目构建时置于public之下。
- *script* ：该文件夹用于项目的测试，打包，开发，这是配置好的框架，我们不需要修改它。
- *src* ：该文件夹包含了构建项目时的所有文件，整个项目的业务逻辑都是在该文件夹中实现的，因此非常重要。
    - *api* ：该文件夹包含需要调用api的js文件。通常一个js文件对应一个模块
    - *commons* ：该文件夹主要用于存放项目的一些通用组件，js。
    - *components* ：项目组件目录，用于存放每个模块的相关组件。
    - *layouts* ：存放整个应用布局文件
    - *models* ：dva框架中的核心层，存放每个模块的models文件。
    - *pages* : 存放路由组件（Route Components）, 通常需要 connect Model的组件都是路由组件，也是每个模块页面的数据入口。
    - *utils* ：此文件夹主要用于存放多个组件所需的js文件。
    - *router.js* ：路由配置
    - *setupProxy.js* ：设置代理