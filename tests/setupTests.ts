import '@testing-library/jest-dom';//导入 jest-dom 扩展匹配器


// Mock 全局对象
// Mock window.matchMedia（响应式测试需要）
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// ===== localStorage =====
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// ===== sessionStorage =====
Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock, // 可以复用
});


// ===== navigator =====
Object.defineProperty(window.navigator, 'clipboard', {
  value: {
    writeText: jest.fn().mockResolvedValue(undefined),
    readText: jest.fn().mockResolvedValue(''),
  },
  writable: true,
});

// ===== URL.createObjectURL =====
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

// ===== File API =====
global.FileReader = class FileReader {
  readAsDataURL = jest.fn();
  readAsText = jest.fn();
  onload = jest.fn();
  onerror = jest.fn();
  result = null;
} as any;

// ===== Mock axios =====
// jest.mock('axios');

// Mock fetch（如果需要）
// global.fetch = jest.fn();

// ===== 4. 配置控制台警告 =====
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    // 忽略 React 18 的某些警告
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(async () => {
  console.error = originalError;
  //  if (driver) {
  //   await driver.quit();
  // }
  // jest.resetAllMocks();
});

// ===== 5. 设置测试超时 =====
jest.setTimeout(10000); // 10秒超时

