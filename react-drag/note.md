#> 注释
    npm install --save-dev babel-plugin-transform-decorators-legacy

    然后在node_modules/babel-preset-react-app/index.js plugins中添加
    require.resolve('babel-plugin-transform-decorators-legacy')

#> 2
    create-react-app ExampleApp
    npm run eject

    //非react
    npm install --save-dev babel-plugin-transform-decorators-legacy

    //针对react
    npm install babel-preset-stage-2 --save-dev
    npm install babel-preset-react-native-stage-0 --save-dev
    npm install --save mobx mobx-react
    根目录下创建.babelrc

    // react
    {
      "presets": ["react-native-stage-0/decorator-support"]
    }

    // 非react
    {
      "presets": [
        "es2015",
        "stage-1"
      ],
      "plugins": ["transform-decorators-legacy"]
    }