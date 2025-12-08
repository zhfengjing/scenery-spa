const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ThemedProgressPlugin } = require("themed-progress-plugin");//主题类型的进度条插件
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    mode:'development',
    devServer: {
        port: 3001,
        open: true,
        hot: true,
        historyApiFallback: true,
        static: {
            directory: resolve(__dirname, '../public'),
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            favicon: './public/favicon.ico',
            template: resolve(__dirname, '../public/index.html'),
        }),
        new ThemedProgressPlugin({ theme: 'monochrome' }),
        //  new BundleAnalyzerPlugin({
        //     analyzerMode: 'server',        // 默认值，启动 HTTP 服务器,'static', // 生成静态 HTML 文件,'disabled' // 不启动分析器
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