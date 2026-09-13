(() => {
 'use strict';
 const input=document.getElementById('guide-search');
 if(!input)return;
 const en=document.documentElement.lang==='en';
 const box=document.querySelector('[data-search]');
 const results=document.getElementById('search-results');
 const status=document.getElementById('search-status');
 fetch(`search-index${en?'.en':''}.json`).then(r=>{if(!r.ok)throw Error('search');return r.json();}).then(index=>{
  box.hidden=false;
  input.addEventListener('input',()=>{
   const terms=input.value.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
   results.replaceChildren();status.textContent='';
   if(!terms.length)return;
   const matches=index.filter(x=>terms.every(t=>(x.title+' '+x.text).toLocaleLowerCase().includes(t)));
   status.textContent=en?`${matches.length} matching guides`:`找到 ${matches.length} 篇文档`;
   for(const item of matches){const li=document.createElement('li'),a=document.createElement('a');a.href=item.url;a.textContent=item.title;li.append(a);results.append(li);}
  });
  input.addEventListener('keydown',event=>{if(event.key==='Escape'){input.value='';input.dispatchEvent(new Event('input'));}});
 }).catch(()=>{box.hidden=true;});
})();
