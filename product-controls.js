(() => {
 'use strict';
 const en=document.documentElement.lang==='en';
 for(const code of document.querySelectorAll('details code')){
  if(!/^[a-f0-9]{64}$/.test(code.textContent.trim()))continue;
  const button=document.createElement('button');button.type='button';button.textContent=en?'Copy SHA256':'复制 SHA256';
  button.style.cssText='display:block;margin-top:12px;padding:10px 14px;min-height:44px;border:1px solid #dedfd8;border-radius:8px;background:#fff;color:#006838;cursor:pointer';
  button.addEventListener('click',async()=>{
   try{await navigator.clipboard.writeText(code.textContent.trim());button.textContent=en?'Copied':'已复制';}
   catch{button.textContent=en?'Select the checksum above to copy':'请选中上方校验值复制';}
  });code.after(button);
 }
 const mobile=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)||(navigator.maxTouchPoints>1&&/Mac/.test(navigator.platform));
 if(mobile){
  const main=document.querySelector('main');if(!main)return;
  const p=document.createElement('p');p.textContent=en?'Install on a desktop computer. Save this download-page link to open there.':'请在电脑上安装。可以复制下载页链接，稍后在电脑上打开。';
  const button=document.createElement('button');button.type='button';button.textContent=en?'Copy download-page link':'复制电脑下载页链接';button.style.cssText='display:block;min-height:44px;padding:10px 16px;margin:12px 0';
  button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText('https://briefloop.ai/downloads'+(en?'.en':'')+'.html');button.textContent=en?'Copied':'已复制';}catch{button.textContent=en?'Copy this page address from your browser':'请从浏览器地址栏复制本页地址';}});
  p.append(button);main.prepend(p);
 }
})();
