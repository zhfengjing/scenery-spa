const { Builder, Browser, By, Key, until } = require('selenium-webdriver');
// 在当前文件（Suite）开始前，初始化一个新的驱动和浏览器
before(async function() {
  // 创建一个新的浏览器实例
  driver = await new webdriver.Builder().forBrowser('firefox').build();
});

// 在当前文件（Suite）结束后，彻底关闭浏览器和驱动
after(async function() {
  if (driver) {
    await driver.quit(); // 强制关闭浏览器进程
  }
});
// 在每个测试用例（Test）结束后，清理浏览器状态
afterEach(async function() {
  // 1. 清除当前浏览器会话中的所有 Cookie
  await driver.manage().deleteAllCookies();

  // 2. 清除 Local Storage 和 Session Storage (需要执行一段 JS 脚本)
  await driver.executeScript('window.localStorage.clear();');
  await driver.executeScript('window.sessionStorage.clear();');

  // 3. 导航到空白页，防止页面残留影响下一个测试
  await driver.get('about:blank');
});
(async function example() {
  // let driver = await new Builder().forBrowser(Browser.FIREFOX).build();
  try {
    await driver.get('https://www.google.com/ncr');
    await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
    await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
  } finally {
    await driver.quit();
  }
})();
