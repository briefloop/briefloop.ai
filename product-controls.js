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
 // The note itself is in the page and shown before first paint; only copying needs script.
 for(const button of document.querySelectorAll('[data-copy-page]')){
  button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(button.dataset.copyPage);button.textContent=en?'Copied':'已复制';}catch{button.textContent=en?'Copy this page address from your browser':'请从浏览器地址栏复制本页地址';}});
 }
})();
