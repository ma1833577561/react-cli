# README


* npm init -y  

```
    初始化package.json
```

* npm i webpack webpack-cli -D  

```
    安装webpack打包📦工具
```

* npm install sass-loader sass --save-dev

```
    npm install --save-dev style-loader
    npm install --save-dev css-loader
    npm install less less-loader --save-dev  
    npm install sass-loader sass --save-dev
    安装css解析器
```

* npm install eslint eslint-webpack-plugin --save-dev

```
    定制js代码规则，规范团队
    eg: 不能使用var 声明变量
```

* npm install -D babel-loader @babel/core @babel/preset-env

```
    把es6 => es5 语法
```

* npm install --save-dev html-webpack-plugin

```
    生成html文件，也可以传入模版，然后加入打包📦后的js以及css文件引入

```


* npm i webpack-dev-server -D 

```
    安装开发服务器
    npx webpack serve --config ./config/webpack.dev.js
    就可以在本地启动服务了，dist目录无文件输出，打包到内存中了。
```

* npx webpack --config ./config/webpack.prod.js系列

```
npx webpack --config ./config/webpack.prod.js
生产环境打包
npx webpack serve --config ./config/webpack.dev.js
开发环境运行✅

```


* npm i mini-css-extract-plugin -D

```
    提取css为单独文件，防止加载首屏闪
    通过link标签引入
```


* npm i postcss-loader postcss postcss-preset-env -D

```
    css 兼容处理
    "last 2 version", // 谷歌、火狐、苹果市面上最近的2个版本
    "> 1%", // 覆盖99%的浏览器小于的不做处理
    "not dead" // 已经停止🤚运行✅的版本不做处理
```

* npm install css-minimizer-webpack-plugin --save-dev

```
    css压缩和优化

```

* webpack优化方向

```
    1、提升开发体验(减少首评闪屏)
    2、提升打包构建速度
    3、减少代码体积(开启、html、css、js压缩)
    4、优化代码运行✅性能(热更新程序)

    //  减少代码体积(开启、html、css、js压缩)
        1、Image Minimizer 图片压缩🗜️
    
    //  优化代码运行✅性能
        1、代码分割Code Split，根据页面生成js文件，按需加载

    // 动态引入
    // /* webpackChunkName: "math" */  webpack 魔法命名
    import(/* webpackChunkName: "math" */ './src/util.js').then(({ add })=>{
        console.log(add(1))
    })

```


`⚠️注意`
```
    TreeShaking-优化代码体积
    1、通过 import { isArray } from 'lodash'引入的isArray方法打包后，只会引入该方法lodash内的其他方法不会被引入打包

```

* HMR(热模块加载HMR - hot module replacement)

```
    更改css、js
    未开启前 会刷新整个页面
    开启后 只加载调整的文件(css支持✅、js不完全支持❌)

注：js文件需要判断是否支持
    vue/react 模块loader中自带🔥hot模块处理

```    
```js
import sum from './js/sum'

if(module.hot){
    // 判断是否支持🔥热模块替换
    module.hot.accept('./js/sum')
}
```

* npm install --save-dev thread-loader

```
    启用多线程

```

* npm install @babel/plugin-transform-runtime -D

```
    npm install -D @babel/plugin-transform-runtime (来把它包含到你的项目中)
    npm install @babel/runtime (把 @babel/runtime 安装为一个依赖)


    babel为了编译每个文件都会插入辅助代码，导致代码体积过大（eg: _extend会被添加到每个需要他的文件中）
    通过✅此该插件对此babel辅助代码进行独立引入
    禁用babel对每个文件自动注入runtime,而是引入
```

* npm i image-minimizer-webpack-plugin imagemin -D


```
    图片压缩🗜️

    // 无损压缩🗜️
    npm install imagemin-gifsicle imagemin-jpegtran imagemin-optipng imagemin-svgo --save-dev
    // 有损压缩🗜️
    npm install imagemin-gifsicle imagemin-mozjpeg imagemin-pngquant imagemin-svgo --save-dev
```

* npm i cross-env -D

```
    定义环境变量预设

```

* npm install copy-webpack-plugin --save-dev

```
    将已存在的单个文件或整个目录复制到生成目录。
    用于复制public下⬇️的公共文件
```