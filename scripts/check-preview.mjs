import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch();const page=await browser.newPage();const errors=[];const layouts=[];
page.on('pageerror',error=>errors.push(error.message));
for(const width of [320,390,768,1440]){
 await page.setViewportSize({width,height:900});
 for(const port of [4321,4322])for(const language of ['en','zh']){
  await page.goto(`http://localhost:${port}/?lang=${language}`,{waitUntil:'networkidle'});
  assert.equal(await page.locator('html').getAttribute('lang'),language==='zh'?'zh-CN':'en');
  const scroll=await page.evaluate(()=>document.documentElement.scrollWidth);assert.ok(scroll<=width+1);
  assert.equal(await page.locator('.primary-nav a[href="/projects/"]').count(),port===4321?1:0);
  assert.equal(await page.locator('[data-research-item], .project-card').count(),0);
  assert.equal(await page.locator('[data-prefill-explorer], [data-load-lab]').count(),0);
  assert.equal(await page.locator('.primary-nav a[href*="4323"]').count(),1);
  if(width===390||width===1440)await page.screenshot({path:`artifacts/${port===4321?'research':'learning'}-${language}-${width}.png`,fullPage:true});
  layouts.push({port,width,language,scroll});
 }
}
await page.goto('http://localhost:4321/projects/',{waitUntil:'networkidle'});
assert.equal(await page.locator('[data-research-item]').count(),5);
assert.equal(await page.getByRole('link', {name:'JittorInfer', exact:true}).count(),0);
await page.goto('http://localhost:4321/projects/moeflow/resources/',{waitUntil:'networkidle'});
assert.equal(await page.locator('h1').innerText(),'MoEFlow');
console.log('Project directory and project detail: PASS');
await page.goto('http://localhost:4321/writing/mini-deepinfer-prefill/',{waitUntil:'networkidle'});
await page.locator('[data-stage="0"]').click();assert.equal(await page.locator('[data-throughput]').innerText(),'1,084.8');
await page.locator('[data-stage="3"]').click();assert.equal(await page.locator('[data-throughput]').innerText(),'4,315.9');
await page.goto('http://localhost:4322/guides/expert-load-imbalance/',{waitUntil:'networkidle'});
await page.locator('[data-load-preset="64"]').click();assert.equal(await page.locator('[data-capacity]').innerText(),'256');
console.log('Article-level interactive experiments retained: PASS');
await page.goto('http://localhost:4321/?lang=zh',{waitUntil:'networkidle'});
await page.locator('.primary-nav a[href*="4323"]').click();await page.waitForLoadState('networkidle');
assert.equal(await page.locator('#projects').count(),1);assert.equal(await page.locator('nav a[href="#projects"]').count(),1);
await page.locator('.site-header [data-learning-link]').click();await page.waitForLoadState('networkidle');
assert.equal(await page.locator('html').getAttribute('lang'),'zh-CN');
await page.locator('.primary-nav a[href*="4323"]').click();await page.waitForLoadState('networkidle');
assert.equal(await page.locator('html').getAttribute('lang'),'zh-CN');
await page.locator('.site-header [data-blog-link]').click();await page.waitForLoadState('networkidle');assert.equal(await page.locator('html').getAttribute('lang'),'zh-CN');
assert.deepEqual(errors,[]);
await writeFile('artifacts/browser-results.json',JSON.stringify({layouts,errors,projects:'restored',projectDetail:'passed',articleInteractions:'passed',homepageRoundTrip:'passed'},null,2));
console.log('16 bilingual viewport checks, two-site homepage round trip, no browser errors: PASS');
await browser.close();
