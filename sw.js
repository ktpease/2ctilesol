if(!self.define){let e,i={};const n=(n,s)=>(n=new URL(n+".js",s).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(s,r)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(i[c])return;let o={};const t=e=>n(e,c),f={module:{uri:c},exports:o,require:t};i[c]=Promise.all(s.map((e=>f[e]||t(e)))).then((e=>(r(...e),o)))}}define(["./workbox-7cfec069"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/index-Kt2mmaid.css",revision:null},{url:"assets/index-tzK3NGRJ.js",revision:null},{url:"index.html",revision:"0c7b75421445f7d9d190eb08437af30a"},{url:"registerSW.js",revision:"14abd88e449c1782c85e3065eba301c0"},{url:"favicon.ico",revision:"a3c9e90519c56093be5b0ba426f1a506"},{url:"apple-touch-icon.png",revision:"9c70328db58a7cb3cd3562e2de4bdeb3"},{url:"icon-safari-pinned-tab.svg",revision:"833b76f3e7ce86fc943a6c12cfb612eb"},{url:"icon-192.png",revision:"0e75544f1122f7c7a06f6b9bac3b6f92"},{url:"icon-512.png",revision:"da1a8588d118efbd47e00015f21b3a0c"},{url:"icon-512m.png",revision:"248a3f22594d8b6bc33451bd3bd15f3b"},{url:"manifest.webmanifest",revision:"32939eed7a3fb4cc88bf18e644ef72dc"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
