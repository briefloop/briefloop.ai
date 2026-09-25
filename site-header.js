// Narrow-screen menu for the shared site header, as on the home page: the toggle
// opens the links, Esc closes them and returns focus, following a link closes them.
(() => {
 'use strict';
 const toggle=document.getElementById('menu-toggle'),links=document.getElementById('nav-links');
 if(!toggle||!links)return;
 const close=()=>{links.classList.remove('open');toggle.setAttribute('aria-expanded','false');};
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&links.classList.contains('open')){close();toggle.focus();}});
 toggle.addEventListener('click',()=>toggle.setAttribute('aria-expanded',String(links.classList.toggle('open'))));
 for(const link of links.querySelectorAll('a'))link.addEventListener('click',close);
})();
