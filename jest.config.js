module.exports = {
    testEnvironment: 'jsdom',//测试环境设置为jsdom，模拟浏览器环境
    testMatch: ['**/?(*.)(spec|test).ts?(x)'],//匹配测试文件
    setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],//测试环境配置文件
    rootDir: './',//根目录
    transform: {//使用swc-jest转换ts/tsx文件
        '\\.(ts|tsx|js|jsx)$': '@swc/jest',
        // '^.+\\.svg$': 'jest-svg-transformer',
    },
    moduleNameMapper: {
        //路径别名映射
        '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
        '^@utils/(.*)$': '<rootDir>/src/utils/$1',
        '^@components/(.*)$': '<rootDir>/src/components/$1',
        '^@assets/(.*)$': '<rootDir>/src/assets/$1',
        '^@pages/(.*)$': '<rootDir>/src/pages/$1',
        '^@abis/(.*)$': '<rootDir>/src/abis/$1',
        '^@/(.*)$': '<rootDir>/src/$1',

        // CSS Modules
        '\\.module\\.(css|scss|sass)$': 'identity-obj-proxy',
        // 3. 样式文件模拟（CSS/SCSS/LESS）用双反斜杠转义。// 普通 CSS（不需要 identity-obj-proxy）
        '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',

        // 4. 静态资源模拟（图片、字体等）
        '\\.(jpg|jpeg|png|gif|svg|webp)$': '<rootDir>/__mocks__/fileMock.js',
        '\\.(woff|woff2|eot|ttf|otf)$': '<rootDir>/__mocks__/fileMock.js',
        // 其他资源
        '\\.(mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
        // svg单独处理为组件
        '\\.svg$': '<rootDir>/__mocks__/svgMock.js',
        // 5. 第三方库别名重定向,重定向 lodash-es 到 lodash（Jest 不支持 ES 模块）
        '^lodash-es$': 'lodash',
    },
    coverageThreshold: {//覆盖率阈值设置
        global: {//全局覆盖率要求
            branches: 50,//分支覆盖率
            functions: 95,//函数覆盖率
            lines: 95,//行覆盖率
            statements: 95,//语句覆盖率
        },
    },
    watchAll: false,//是否监视所有文件的更改
    collectCoverageFrom: [//指定收集覆盖率信息的文件
        'src/**/*.{ts,tsx}',
        '!src/main.tsx',//排除入口文件
        '!src/**/index.{ts,tsx}',//排除各模块的index文件
        '!src/**/*.d.ts',//排除类型声明文件
    ],
    collectCoverage: true,//启用覆盖率收集
    coverageDirectory: './docs/jest-coverage',//覆盖率报告输出目录
    coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],//排除不需要覆盖率的路径
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx', 'node'],//模块文件扩展名
    reporters: [
        'default',//使用默认报告器
        [
            'jest-stare',//使用 jest-stare 生成测试报告
            {
                "resultDir": "./docs/stare-report",//报告输出目录
                "resultHtml": "index.html",//报告文件名
                "reportTitle": "jest-stare Report",//报告标题
                "additionalResultsProcessors": [],//    额外的结果处理器
                "coverageLink": "../jest-coverage/lcov-report/index.html",//覆盖率报告链接
                "jestStareConfigJson": "jest-stare.json",//配置文件名
            },
        ],
    ],
};


// identity-obj-proxy 使用 ES6 Proxy 实现了一个神奇的对象
// identity-obj-proxy 的核心实现（简化版）
// module.exports = new Proxy({}, {
//   get: function(target, key) {
//     if (key === '__esModule') {
//       return false;
//     }
//     // ✨ 魔法：返回键名本身
//     return key;
//   }
// });

//。identity-obj-proxy名字含义：
// identity = 身份映射（输入什么返回什么）
// obj = 对象
// proxy = ES6 Proxy

// jest 测试执行流程示意图:

// Jest 启动
//     ↓
// 加载 jest.config.js
//     ↓
// setupFiles（可选，在测试框架初始化之前）
//     ↓
// 初始化测试框架（Jest）
//     ↓
// setupFilesAfterEnv ← 这里！
//     ↓
// 运行测试文件
//     ↓
// 执行 beforeEach/afterEach
//     ↓
// 运行具体测试