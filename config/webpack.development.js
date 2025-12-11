const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ThemedProgressPlugin } = require("themed-progress-plugin");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');
const dotenv = require('dotenv');

// 加载环境变量
const env = dotenv.config().parsed || {};
// 将环境变量转换为 webpack DefinePlugin 可以使用的格式
const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
}, {});
// console.log('envKeys',envKeys);
module.exports = {
    mode: 'development',
    devServer: {
        port: 3001,
        open: true,
        hot: true,
        historyApiFallback: true,
        static: {
            directory: resolve(__dirname, '../public'),
        },
        proxy: [
            {
                context: ['/api'],
                target: 'http://localhost:8787',
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            favicon: './public/favicon.ico',
            template: resolve(__dirname, '../public/index.html'),
        }),
        new ThemedProgressPlugin({ theme: 'monochrome' }),
          // 这一步让 process 全局可用，解决了 process is not defined
        new webpack.ProvidePlugin({
        process: 'process/browser.js',
        }),
        new webpack.DefinePlugin(envKeys),//配置全局环境变量
        //  new BundleAnalyzerPlugin({
        //     analyzerMode: 'server',        // 默认值，启动 HTTP 服务器,'static', // 生成静态 HTML 文件,'disabled' //
        //     analyzerHost: '127.0.0.1',     // 服务器地址
        //     analyzerPort: 8888,             // 端口号
        //     openAnalyzer: true,             // ✅ 自动打开浏览器
        //     generateStatsFile: false,       // 不生成 stats.json
        //     reportFilename: 'report.html'   // 报告文件名
        //     // generateStatsFile: true,
        //     // statsFilename: 'stats.json'
        // }),//生成打包分析报告
    ]
}