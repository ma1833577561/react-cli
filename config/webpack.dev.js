const path = require('path')
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const publicCssLoaders = () => {
    return [
            "style-loader", 
            "css-loader", 
            {
                // 兼容问题配合package.json
                loader: 'postcss-loader',
                options: {
                    postcssOptions: {
                        plugins: ["postcss-preset-env"],
                    },
                },
            }
        ]
}

module.exports = {
    entry: './src/main.js',
    output: {
        path: undefined,
        filename: 'static/js/[name].js',
        chunkFilename: 'static/js/[name].chunk.js',
        assetModuleFilename: 'static/media/[hash:10][ext][query]'
    },
    // 加载器
    module: {
        rules: [
            {
                oneOf: [
                    // 处理css
                    {
                        test: /\.css$/,
                        use: [...publicCssLoaders()],
                    },
                    {
                        test: /\.less$/,
                        use: [
                            ...publicCssLoaders(),
                            'less-loader',
                        ],
                    },
                    {
                        test: /\.s[ac]ss$/,
                        use: [
                            ...publicCssLoaders(),
                            'sass-loader',
                        ],
                    },
                    {
                        test: /\.styl$/,
                        use: [
                            ...publicCssLoaders(),
                            'stylus-loader',
                        ],
                    },
                    // 处理图片
                    {
                        test: /\.(png|jpe?g|gif|svg)$/,
                        type: 'asset',
                        parser: {
                            dataUrlCondition: {
                                maxSize: 10 * 1024, // 小于10kb的图片会被base64处理
                            },
                        },
                    },
                    // 其他资源
                    {
                        test: /\.(ttf|woff2?)$/,
                        type: "asset/resource",
                    },
                    // 处理js
                    {
                        test: /\.(jsx|js)$/,
                        include: path.resolve(__dirname, "../src"),
                        loader: "babel-loader",
                        options: {
                            cacheDirectory: true,
                            cacheCompression: false,
                            plugins: [
                                // "@babel/plugin-transform-runtime", // presets中包含了
                                // 开启js的HMR功能
                                "react-refresh/babel", 
                            ],
                        },
                    },
                ]
            }
        ],
    },
    // 插件
    plugins: [
        new ESLintWebpackPlugin({
            context: path.resolve(__filename, '../src'),
            exclude: "node_modules",
            cache: true,
            cacheLocation: path.resolve(__dirname, '../node_modules/.cache/.eslintcache'),
        }),
        new HtmlWebpackPlugin({
          template: path.resolve(__dirname, "../public/index.html"),
        }),
        // 解决js的HMR功能运行时全局变量的问题
        new ReactRefreshWebpackPlugin(), 
        // 将public下面的资源复制到dist目录去（除了index.html）
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "../public"),
                    to: path.resolve(__dirname, "../dist"),
                    toType: "dir",
                    noErrorOnMissing: true, // 不生成错误
                    globOptions: {
                        // 忽略文件
                        ignore: ["**/index.html"],
                    },
                    info: {
                        // 跳过terser压缩js
                        minimized: true,
                    },
                },
            ],
        }),
    ],
    // 压缩🗜️
    optimization: {
        // 分割chunk打包📦代码
        splitChunks: {
            chunks: "all",
        },
        // 对分割的chunk文件📃命名
        runtimeChunk: {
            name: (entrypoint) => `runtime~${entrypoint.name}`,
        },
    },
    // webpack解析模块加载项
    resolve: {
        // 自动补全文件扩展名，让jsx可以使用
        extensions: [".jsx", ".js", ".json"], 
    },
    devServer: {
        open: true,
        host: "localhost",
        port: 3000,
        // 开启🔛HMR
        hot: true,
        compress: true,
        // 解决react-router刷新404问题
        historyApiFallback: true, 
    },
    mode: 'development',
    devtool: "cheap-module-source-map",
    // 关闭性能分析，提示速度
    performance: false, 
};