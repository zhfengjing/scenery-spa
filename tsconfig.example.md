# TypeScript 配置文件详解 (tsconfig.json)

## 📋 目录
- [基础选项](#基础选项)
- [模块解析选项](#模块解析选项)
- [输出选项](#输出选项)
- [严格类型检查](#严格类型检查)
- [额外检查](#额外检查)
- [互操作性约束](#互操作性约束)
- [实验性功能](#实验性功能)
- [高级选项](#高级选项)
- [项目配置](#项目配置)
- [常见场景配置](#常见场景配置)

---

## 基础选项

### `target`
**含义：** 指定编译后的 JavaScript 版本
```json
"target": "ES2020"
```
**可选值：**
- `ES3` - 最古老，兼容性最好
- `ES5` - 支持 IE9+
- `ES6/ES2015` - 现代浏览器
- `ES2016` ~ `ES2023` - 不同年份的 ECMAScript 标准
- `ESNext` - 最新特性（不推荐生产环境）

**影响：**
- 决定哪些语法需要转译（如箭头函数、async/await）
- 影响生成代码的兼容性

---

### `module`
**含义：** 指定生成代码的模块系统
```json
"module": "ESNext"
```
**可选值：**
- `CommonJS` - Node.js 默认（require/module.exports）
- `ES6/ES2015/ESNext` - ES 模块（import/export）
- `AMD` - 异步模块定义
- `UMD` - 通用模块定义
- `System` - SystemJS
- `Node16/NodeNext` - Node.js 混合模式

**使用建议：**
- 前端项目 + Webpack/Vite：`ESNext`
- Node.js 项目：`CommonJS` 或 `Node16`
- 库开发：根据目标环境选择

---

### `lib`
**含义：** 编译时包含的类型定义库
```json
"lib": ["ES2020", "DOM", "DOM.Iterable"]
```
**常用值：**
- `ES5/ES6/ES2015` ~ `ES2023` - JavaScript 标准库
- `DOM` - 浏览器 DOM API
- `DOM.Iterable` - DOM 集合的迭代器
- `WebWorker` - Web Worker API
- `ScriptHost` - Windows Script Host

**示例场景：**
```typescript
// 需要 "DOM" 才能使用
document.querySelector('.app')

// 需要 "ES2020" 才能使用
const obj = { a: 1, b: 2 };
const { a, ...rest } = obj; // 对象展开运算符
```

---

### `jsx`
**含义：** JSX 编译模式
```json
"jsx": "react-jsx"
```
**可选值：**
- `preserve` - 保留 JSX，由后续工具处理（`.jsx` 输出）
- `react` - 编译为 `React.createElement`（React 17 之前）
- `react-jsx` - 新的 JSX 转换（React 17+，自动导入）
- `react-jsxdev` - 开发模式（包含调试信息）
- `react-native` - React Native 使用

**对比：**
```tsx
// 源代码
const App = () => <div>Hello</div>

// react 模式输出
React.createElement("div", null, "Hello")

// react-jsx 模式输出（无需导入 React）
import { jsx as _jsx } from "react/jsx-runtime"
_jsx("div", { children: "Hello" })
```

---

## 模块解析选项

### `moduleResolution`
**含义：** 模块解析策略
```json
"moduleResolution": "node"
```
**可选值：**
- `node` - Node.js 风格解析（最常用）
- `classic` - TypeScript 旧版解析（已废弃）
- `node16/nodenext` - Node.js 12+ 的 ESM 解析

**Node 解析规则：**
```typescript
import { foo } from './module'
// 查找顺序：
// 1. ./module.ts
// 2. ./module.tsx
// 3. ./module.d.ts
// 4. ./module/index.ts
// 5. ./module/package.json (查找 types 字段)
```

---

### `baseUrl` 和 `paths`
**含义：** 配置模块解析的基础路径和路径别名
```json
"baseUrl": "./",
"paths": {
  "@/*": ["src/*"],
  "@components/*": ["src/components/*"]
}
```

**使用效果：**
```typescript
// 不使用别名
import Button from '../../../components/Button'

// 使用别名后
import Button from '@components/Button'
```

**注意事项：**
- `baseUrl` 必须设置才能使用 `paths`
- 这只是 TypeScript 编译器的设置
- 构建工具（Webpack/Vite）需要单独配置对应的别名

---

### `resolveJsonModule`
**含义：** 允许导入 JSON 文件
```json
"resolveJsonModule": true
```

**启用后可以：**
```typescript
import config from './config.json'
// config 会有正确的类型推断

// 还可以导入 package.json
import { version } from '../package.json'
console.log(version) // 类型安全
```

---

### `typeRoots` 和 `types`
**含义：** 指定类型声明文件的位置
```json
"typeRoots": ["./node_modules/@types", "./types"],
"types": ["node", "jest"]
```

**区别：**
- `typeRoots`：指定类型定义的根目录
- `types`：指定要包含的类型包（白名单）

**默认行为：**
- 如果不设置，会自动包含 `node_modules/@types` 下所有包
- 设置 `types` 后，只包含列出的类型

---

## 输出选项

### `outDir` 和 `rootDir`
**含义：** 控制输出目录结构
```json
"outDir": "./dist",
"rootDir": "./src"
```

**示例：**
```
项目结构：
src/
  ├── index.ts
  └── utils/
      └── helper.ts

编译后：
dist/
  ├── index.js
  └── utils/
      └── helper.js
```

**注意：**
- `rootDir` 决定输出的目录结构
- 没有 `rootDir` 时，TS 会推断所有输入文件的公共根目录

---

### `declaration` 和 `declarationMap`
**含义：** 生成类型声明文件
```json
"declaration": true,
"declarationMap": true
```

**生成文件：**
```typescript
// src/index.ts
export const greet = (name: string) => `Hello ${name}`

// 编译后生成 dist/index.d.ts
export declare const greet: (name: string) => string;

// declarationMap 生成 dist/index.d.ts.map（用于跳转到源码）
```

**使用场景：**
- 开发 npm 库时必须开启
- 让使用者获得完整的类型提示

---

### `sourceMap`
**含义：** 生成 source map 文件
```json
"sourceMap": true
```

**作用：**
- 在浏览器调试时映射回 TypeScript 源码
- 生成 `.js.map` 文件

**调试效果：**
```
没有 sourceMap：调试器显示编译后的 JS
有 sourceMap：调试器显示原始的 TS 代码（可以断点、查看变量）
```

---

### `removeComments`
**含义：** 删除编译后代码中的注释
```json
"removeComments": true
```

**对比：**
```typescript
// 源码
/** 这是一个函数 */
function greet() { }

// removeComments: false
/** 这是一个函数 */
function greet() { }

// removeComments: true
function greet() { }
```

---

### `noEmit`
**含义：** 不生成输出文件
```json
"noEmit": false
```

**使用场景：**
- `true`：只做类型检查，不生成文件（配合 Babel/esbuild）
- `false`：生成 JS 文件（传统 tsc 编译）

**现代前端常设为 `true`：**
```
TypeScript → 类型检查
Vite/Webpack → 编译和打包
```

---

### `importHelpers`
**含义：** 从 tslib 导入辅助函数
```json
"importHelpers": true
```

**优化效果：**
```typescript
// importHelpers: false（每个文件都有辅助函数）
var __extends = function() { ... }
class Child extends Parent { }

// importHelpers: true（复用 tslib）
import { __extends } from "tslib"
class Child extends Parent { }
```

**需要安装：**
```bash
npm install tslib
```

---

## 严格类型检查

### `strict`
**含义：** 启用所有严格类型检查
```json
"strict": true
```

**等同于开启以下所有选项：**
- `noImplicitAny`
- `strictNullChecks`
- `strictFunctionTypes`
- `strictBindCallApply`
- `strictPropertyInitialization`
- `noImplicitThis`
- `alwaysStrict`

**推荐：** 新项目一定要开启！

---

### `noImplicitAny`
**含义：** 禁止隐式 any 类型
```json
"noImplicitAny": true
```

**示例：**
```typescript
// ❌ noImplicitAny: true 会报错
function log(message) {
  //          ^^^^^^^ 参数隐式具有 any 类型
  console.log(message)
}

// ✅ 必须显式标注
function log(message: string) {
  console.log(message)
}
```

---

### `strictNullChecks`
**含义：** 严格的 null 和 undefined 检查
```json
"strictNullChecks": true
```

**示例：**
```typescript
// strictNullChecks: false
let name: string = null // ✅ 允许

// strictNullChecks: true
let name: string = null // ❌ 不能将类型"null"分配给类型"string"

// 正确做法
let name: string | null = null // ✅
```

---

### `strictFunctionTypes`
**含义：** 严格的函数类型检查
```json
"strictFunctionTypes": true
```

**示例：**
```typescript
interface Animal { name: string }
interface Dog extends Animal { breed: string }

let f1: (x: Animal) => void
let f2: (x: Dog) => void

// strictFunctionTypes: false
f1 = f2 // ✅ 允许（不安全）

// strictFunctionTypes: true
f1 = f2 // ❌ 不允许（类型安全）
```

---

### `strictPropertyInitialization`
**含义：** 严格的类属性初始化检查
```json
"strictPropertyInitialization": true
```

**示例：**
```typescript
class User {
  // ❌ 属性"name"没有初始化，也未在构造函数中明确赋值
  name: string
  
  // ✅ 方案1：初始化
  age: number = 0
  
  // ✅ 方案2：构造函数赋值
  email: string
  constructor(email: string) {
    this.email = email
  }
  
  // ✅ 方案3：声明可能为 undefined
  phone?: string
  
  // ✅ 方案4：明确断言（不推荐）
  id!: string
}
```

---

## 额外检查

### `noUnusedLocals` 和 `noUnusedParameters`
**含义：** 检测未使用的变量和参数
```json
"noUnusedLocals": true,
"noUnusedParameters": true
```

**示例：**
```typescript
function greet(name: string, age: number) {
  //                          ^^^ 未使用的参数
  return `Hello ${name}`
}

const unused = 10 // 未使用的变量
```

**跳过检查：**
```typescript
function greet(name: string, _age: number) {
  // 下划线开头的参数不会报警
  return `Hello ${name}`
}
```

---

### `noImplicitReturns`
**含义：** 所有代码路径都必须有返回值
```json
"noImplicitReturns": true
```

**示例：**
```typescript
// ❌ 并非所有代码路径都返回值
function getValue(x: number): string {
  if (x > 0) {
    return "positive"
  }
  // 缺少 else 分支的返回
}

// ✅ 修复
function getValue(x: number): string {
  if (x > 0) {
    return "positive"
  }
  return "non-positive"
}
```

---

### `noFallthroughCasesInSwitch`
**含义：** 防止 switch 语句的 fallthrough 错误
```json
"noFallthroughCasesInSwitch": true
```

**示例：**
```typescript
function handle(value: number) {
  switch (value) {
    case 1:
      console.log('one')
      // ❌ 缺少 break，会继续执行 case 2
    case 2:
      console.log('two')
      break
  }
}

// ✅ 修复
switch (value) {
  case 1:
    console.log('one')
    break // 添加 break
  case 2:
    console.log('two')
    break
}
```

---

### `noUncheckedIndexedAccess`
**含义：** 索引访问时自动包含 undefined
```json
"noUncheckedIndexedAccess": true
```

**示例：**
```typescript
const arr = [1, 2, 3]

// noUncheckedIndexedAccess: false
const item = arr[10] // 类型：number

// noUncheckedIndexedAccess: true
const item = arr[10] // 类型：number | undefined

// 必须检查
if (item !== undefined) {
  console.log(item.toFixed(2))
}
```

---

## 互操作性约束

### `esModuleInterop`
**含义：** 启用 ES 模块互操作性
```json
"esModuleInterop": true
```

**解决问题：**
```typescript
// CommonJS 模块
// module.exports = function() { }

// 没有 esModuleInterop
import * as foo from 'foo'
foo() // ❌ 错误

// 有 esModuleInterop
import foo from 'foo'
foo() // ✅ 正确
```

**通常配合：**
```json
"allowSyntheticDefaultImports": true
```

---

### `forceConsistentCasingInFileNames`
**含义：** 强制文件名大小写一致
```json
"forceConsistentCasingInFileNames": true
```

**示例：**
```typescript
// 文件：UserProfile.ts

// ❌ 错误的导入（大小写不一致）
import UserProfile from './userprofile'

// ✅ 正确的导入
import UserProfile from './UserProfile'
```

**重要性：**
- macOS/Windows 文件系统不区分大小写
- Linux 区分大小写
- 此选项避免跨平台问题

---

### `isolatedModules`
**含义：** 每个文件作为独立模块
```json
"isolatedModules": true
```

**限制：**
```typescript
// ❌ 不允许（因为 Babel 无法处理）
const enum Direction {
  Up, Down
}

// ✅ 改用普通 enum
enum Direction {
  Up, Down
}
```

**使用场景：**
- 配合 Babel/esbuild 等单文件编译器
- 现代前端项目建议开启

---

## 实验性功能

### `experimentalDecorators`
**含义：** 启用装饰器语法
```json
"experimentalDecorators": true
```

**示例：**
```typescript
function Log(target: any, propertyKey: string) {
  console.log(`${propertyKey} was called`)
}

class Calculator {
  @Log
  add(a: number, b: number) {
    return a + b
  }
}
```

**常用于：**
- Angular 框架
- NestJS 框架
- TypeORM
- MobX

---

### `emitDecoratorMetadata`
**含义：** 为装饰器提供元数据支持
```json
"emitDecoratorMetadata": true
```

**配合使用：**
```typescript
import 'reflect-metadata'

function Injectable(target: any) {
  // 可以获取类型信息
}

@Injectable
class UserService {
  constructor(private db: Database) {}
}
```

---

## 高级选项

### `skipLibCheck`
**含义：** 跳过声明文件的类型检查
```json
"skipLibCheck": true
```

**优点：**
- ✅ 大幅提升编译速度
- ✅ 避免第三方库类型定义冲突

**缺点：**
- ❌ 可能遗漏类型错误

**建议：** 大型项目推荐开启

---

### `allowJs`
**含义：** 允许编译 JavaScript 文件
```json
"allowJs": true
```

**使用场景：**
- 从 JS 项目迁移到 TS
- 混合使用 JS 和 TS 文件

---

### `incremental`
**含义：** 启用增量编译
```json
"incremental": true,
"tsBuildInfoFile": "./buildcache/.tsbuildinfo"
```

**效果：**
- 只编译改动的文件
- 大幅提升二次编译速度

---

## 项目配置

### `include` 和 `exclude`
```json
"include": [
  "src/**/*"
],
"exclude": [
  "node_modules",
  "dist",
  "**/*.spec.ts"
]
```

**规则：**
- `include`：要编译的文件
- `exclude`：要排除的文件
- `exclude` 优先级高于 `include`

---

### `files`
```json
"files": [
  "src/index.ts",
  "src/types.d.ts"
]
```

**区别：**
- `files`：精确指定文件（不支持 glob）
- `include`：使用 glob 模式匹配

---

## 常见场景配置

### 1. React 项目
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "noEmit": true
  }
}
```

### 2. Node.js 项目
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "lib": ["ES2020"],
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

### 3. 库开发
```json
{
  "compilerOptions": {
    "target": "ES2015",
    "module": "ESNext",
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true
  }
}
```

---

## 🎯 推荐配置

### 新项目最佳实践
```json
{
  "compilerOptions": {
    // 基础
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    
    // 严格模式
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    
    // 模块解析
    "moduleResolution": "node",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    
    // 性能优化
    "skipLibCheck": true,
    "incremental": true
  }
}
```

---

## 参考资源
- [官方文档](https://www.typescriptlang.org/tsconfig)
- [TSConfig Bases](https://github.com/tsconfig/bases) - 各种环境的推荐配置
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)