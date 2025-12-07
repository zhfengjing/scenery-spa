const { Builder, Browser, By, Key, until } = require('selenium-webdriver');
// 在当前文件（Suite）开始前，初始化一个新的驱动和浏览器
let driver;
(async function example() {
   driver = await new Builder().forBrowser(Browser.FIREFOX).build();
  try {
    await driver.get('https://www.google.com/ncr');
    await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
    await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
  } finally {
    await driver.quit();
  }
})();
