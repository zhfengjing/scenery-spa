const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    mode: 'production',
    output: {
        filename: '[name].[contenthash:8].bundle.js',
        path : resolve(__dirname, '../dist-prod'),
        publicPath: './',
    },
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        'react-dom/client': 'ReactDOM',
        'react-router-dom': 'ReactRouterDOM',
        '@remix-run/router': 'RemixRouter',
        'react-router': 'ReactRouter',
        'react-router-dom': 'ReactRouterDOM',
    },
    plugins: [
        new CleanWebpackPlugin(),//每次构建前清理 /dist 文件夹
        new MiniCssExtractPlugin({//单独打包css文件
            filename: 'styles/[name].[contenthash:8].css',
            chunkFilename: 'styles/[name].[contenthash:8].css',
            ignoreOrder: false,
        }),
        new HtmlWebpackPlugin({//生成html文件，并自动引入打包输出的资源
            filename: 'index.html',
            favicon: './public/favicon.ico',
            template: resolve(__dirname, '../public/index.prod.html'),
            // minify: {//压缩html文件
            //     removeComments: true,
            //     collapseWhitespace: true,
            //     removeRedundantAttributes: true,
            //     useShortDoctype: true,
            //     removeEmptyAttributes: true,
            //     removeStyleLinkTypeAttributes: true,
            //     keepClosingSlash: true,
            //     minifyJS: true,
            //     minifyCSS: true,
            //     minifyURLs: true,
            // },
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',        // 'server':启动http服务器, 'static', // 生成静态 HTML 文件,'disabled' // 不启动分析器
            // analyzerHost: '127.0.0.1',     // 服务器地址
            // analyzerPort: 8888,             // 端口号
            openAnalyzer: false,             // ✅ 不自动打开浏览器
            // generateStatsFile: false,       // 不生成 stats.json
            reportFilename: 'report.html',   // 报告文件名
            // statsFilename: 'stats.json'     //stats文件名
        }),//生成打包分析报告
    ],
    optimization: {
        minimize: false,//不启动代码压缩，在swc中已经配置了压缩
        // TerserPlugin会与swc的压缩功能冲突，导致一些问题，因此这里禁用TerserPlugin,如果swc没有配置压缩，可以启用TerserPlugin进行代码压缩
        // minimizer: [new TerserPlugin({
        //     parallel: true,//启用多线程
        //     // sourceMap: true,//生成source map文件，便于调试
        //     minify: TerserPlugin.terserMinify,//使用terser进行压缩,JavaScript 解析器、压缩器、压缩器和美化工具包。
        //     terserOptions: {//terser压缩选项
        //         compress: false,//不进行代码压缩，因为swc已经处理过压缩了，swc的压缩效果更好
        //         mangle: false,//不进行变量名混淆，因为swc已经处理过混淆了
        //         extractComments: false,//不提取注释到单独文件
        //         // compress: {//压缩相关选项
        //         //     drop_console: true,//去除console.log
        //         //     drop_debugger: true,//去除debugger
        //         // },
        //     },
        // })],
        splitChunks: {
            chunks: 'all',//对所有类型的模块进行分割，包括同步和异步模块,有效的值为 all、async、initial
            minSize: 20000,//模块大于20kb才进行分割
            minRemainingSize: 0,//拆分后文件的最小大小
            minChunks: 1,//模块至少被引用一次才进行分割
            maxAsyncRequests: 30,//按需加载时并行请求的最大数量
            maxInitialRequests: 30,//入口点加载时并行请求的最大数量
            enforceSizeThreshold: 50000,//强制拆分的大小阈值
            cacheGroups: {//缓存组配置
                vendors: {//第三方库模块
                    test: /[\\/]node_modules[\\/]/,//匹配node_modules目录下的模块
                    name: 'vendors',//打包后的文件名
                    priority: -10,//优先级
                },
                default: {//默认模块
                    minChunks: 2,//模块至少被引用两次才进行分割
                    name: 'common',//打包后的文件名
                    priority: -20,//优先级
                    reuseExistingChunk: true,//如果模块已经被打包过，则复用已有的模块
                },
            },
        },
    },
}