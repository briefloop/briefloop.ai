/* Enable an asset only after native acceptance and publication of its exact URL. */
(function () {
  'use strict';
  const release = {"version": "0.20.0", "mac": {"ready": true, "url": "https://github.com/Stahl-G/briefloop/releases/download/v0.20.0/BriefLoop-0.20.0-arm64.dmg", "architecture": "arm64"}, "windows": {"ready": true, "url": "https://github.com/Stahl-G/briefloop/releases/download/v0.20.0/BriefLoop-Setup-0.20.0-x64.exe", "architecture": "x64"}};
  function detectPlatform(nav) {
    const ua = nav.userAgent || '';
    const platform = nav.userAgentData?.platform || nav.platform || '';
    if (/Android|iPhone|iPad|iPod/i.test(ua) || (/Mac/i.test(platform) && nav.maxTouchPoints > 1)) return 'other';
    if (/Windows|Win32|Win64/i.test(platform + ' ' + ua)) return 'windows';
    if (/Mac/i.test(platform + ' ' + ua)) return 'mac';
    return 'other';
  }
  function detectArchitecture(nav, hints = {}) {
    if (/arm/i.test(hints.architecture || '')) return 'arm64';
    if (/x86|x64/i.test(hints.architecture || '')) return hints.bitness === '64' ? 'x64' : hints.bitness === '32' ? 'x86' : 'unknown';
    const ua = nav.userAgent || '';
    if (/Windows.*(?:ARM64|aarch64)/i.test(ua)) return 'arm64';
    if (/Windows.*(?:Win64|WOW64|x64)/i.test(ua)) return 'x64';
    // macOS user agents often report Intel even on Apple silicon.
    return 'unknown';
  }
  function selection(platform, architecture, en, catalog = release) {
    const page = en ? 'downloads.en.html' : 'downloads.html';
    const asset = catalog[platform];
    if (!asset) return {href: page, label: en ? 'Choose a desktop installer' : '选择桌面安装包'};
    const name = platform === 'mac' ? 'macOS' : 'Windows';
    if (!asset.ready || !asset.url) return {href: page + '#' + platform, label: en ? `${name} · preparing` : `${name} 版 · 准备中`};
    if (architecture !== asset.architecture) return {href: page + '#' + platform, label: en ? `Choose ${name} installer` : `选择 ${name} 安装包`};
    return {href: asset.url, label: en ? `Download for ${name}` : `下载 ${name} 版`};
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = {detectPlatform, detectArchitecture, selection, release};
  if (typeof document === 'undefined') return;
  const en = document.documentElement.lang === 'en';
  const platform = detectPlatform(navigator);
  function render(hints) {
    const choice = selection(platform, detectArchitecture(navigator, hints), en);
    for (const link of document.querySelectorAll('[data-auto-download]')) {
      link.href = choice.href;
      link.textContent = choice.label;
    }
    for (const link of document.querySelectorAll('[data-platform-download]')) {
      const key = link.dataset.platformDownload;
      const asset = release[key];
      if (asset?.ready && asset.url) {
        link.href = asset.url;
        link.removeAttribute('aria-disabled');
        link.textContent = en ? `Download ${key === 'mac' ? 'DMG · Apple silicon' : 'EXE · x64'}` : `下载 ${key === 'mac' ? 'DMG · Apple 芯片' : 'EXE · x64'}`;
        link.classList.add('available');
      }
    }
  }
  render({});
  // Only OS and architecture hints; no remote fingerprinting service or storage.
  if (platform !== 'other' && navigator.userAgentData?.getHighEntropyValues) {
    navigator.userAgentData.getHighEntropyValues(['architecture', 'bitness']).then(render).catch(() => {});
  }
})();
