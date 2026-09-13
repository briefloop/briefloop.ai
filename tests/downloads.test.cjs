const test = require('node:test');
const assert = require('node:assert/strict');
const {detectPlatform, detectArchitecture, selection, release} = require('../downloads.js');
test('Mac desktop is selected, but iPad desktop mode is not mistaken for a Mac', () => {
  assert.equal(detectPlatform({platform:'MacIntel',maxTouchPoints:0}), 'mac');
  assert.equal(detectPlatform({platform:'MacIntel',maxTouchPoints:5}), 'other');
  assert.equal(detectArchitecture({userAgent:'Macintosh; Intel Mac OS X'}), 'unknown');
});
test('Windows x64 and ARM stay distinct; hints with no bitness do not invent x64', () => {
  const nav={userAgent:'Windows NT 10.0; Win64; x64'};
  assert.equal(detectPlatform(nav),'windows');
  assert.equal(detectArchitecture(nav),'x64');
  assert.equal(detectArchitecture({userAgent:'Windows NT 10.0; ARM64'}),'arm64');
  assert.equal(detectArchitecture({}, {architecture:'x86'}),'unknown');
});
test('unpublished assets never produce a download URL', () => {
  for (const platform of ['mac','windows']) {
    assert.match(selection(platform,release[platform].architecture,false).href,/^downloads\.html#/);
    assert.match(selection(platform,release[platform].architecture,false).label,/准备中/);
  }
});
test('accepted published assets select the exact package only on matching architecture', () => {
  const catalog={mac:{ready:true,url:'https://example.test/mac.dmg',architecture:'arm64'},windows:{ready:true,url:'https://example.test/win.exe',architecture:'x64'}};
  assert.equal(selection('mac','arm64',false,catalog).href,catalog.mac.url);
  assert.equal(selection('windows','x64',true,catalog).href,catalog.windows.url);
  assert.equal(selection('mac','x64',false,catalog).href,'downloads.html#mac');
  assert.equal(selection('mac','unknown',false,catalog).href,'downloads.html#mac');
  assert.equal(selection('windows','arm64',true,catalog).href,'downloads.en.html#windows');
  assert.equal(selection('other','unknown',true,catalog).href,'downloads.en.html');
});
