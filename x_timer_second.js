async function t(){for(var t=document.querySelector('[data-testid="app-bar-close"]'),e=0;3>e;e++){if(t){await t.click();var a=parseInt(localStorage.getItem("clearXX"))+1;a||(a=1),localStorage.setItem("clearXX",a)}await r(o(201*Math.random())+500);var n=document.querySelector('[data-testid="confirmationSheetCancel"]');n&&await n.click()}}async function e(e,i){try{var c=document.querySelector('[data-testid="SideNav_NewTweet_Button"]');await c.click();var l=localStorage.getItem("on_off");if(0==l)return 10001;if(await r(o(201*Math.random())+1e3),!(M=document.querySelector('[data-testid="tweetButton"]')).getAttribute("aria-disabled")){await t();var m=parseInt(localStorage.getItem("clearXX_begin"))+1;m||(m=1),localStorage.setItem("clearXX_begin",m),await c.click(),await r(o(201*Math.random())+1e3)}if(0==(l=localStorage.getItem("on_off")))return 10001;if(await n(e),0==(l=localStorage.getItem("on_off")))return 10001;await r(o(201*Math.random())+200);var s=document.querySelector('[data-testid="scheduleOption"]');if(!s)throw new Error("未找到定时图标");if(await s.click(),0==(l=localStorage.getItem("on_off")))return 10001;if(await r(o(201*Math.random())+1300),0==(l=localStorage.getItem("on_off")))return 10001;var d=Array.from(document.querySelectorAll('select[id^="SELECTOR_"]')).sort(((t,e)=>parseInt(t.id.split("_")[1])-parseInt(e.id.split("_")[1])));if(5>d.length)throw new Error("未找到完整的时间选择器");var[u,g,f,w,h]=d,v=(i.getMonth()+1).toString(),S=i.getDate().toString(),p=i.getFullYear().toString(),y=i.getHours(),I=i.getMinutes();if(await a(u,v),await a(g,S),await a(f,p),await a(w,y),await a(h,I),await r(o(101*Math.random())+400),0==(l=localStorage.getItem("on_off")))return 10001;var M,_=document.querySelector('[data-testid="scheduledConfirmationPrimaryAction"]');if(!_)throw new Error("未找到确认按钮");if(await _.click(),0==(l=localStorage.getItem("on_off")))return 10001;if(await r(o(201*Math.random())+1500),0==(l=localStorage.getItem("on_off")))return 10001;if(!(M=document.querySelector('[data-testid="tweetButton"]')))throw new Error("未找到发送按钮");await M.click(),await r(o(101*Math.random())+200),M&&await M.click()}catch(t){throw t}return 0}async function a(t,e){t.value=e,t.dispatchEvent(new Event("change",{bubbles:!0})),await r(o(201*Math.random())+200)}function r(t){return new Promise((e=>setTimeout(e,t)))}async function n(t){var e=i.split(" ").length,a=o(Math.random()*e-1)+0,n=i.split(" ")[a],c=Array.from(n),l=t.split("\n");const m=document.querySelector('[data-testid="tweetTextarea_0"]');for(var s=0;s<l.length;s++)if(0!=s&&(m.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",code:"Enter",bubbles:!0})),await document.execCommand("insertLineBreak"),await r(o(21*Math.random())+200)),l[s]){if(0==a%2&&n&&0==s)for(var d of c)await document.execCommand("insertText",!1,d),await r(o(21*Math.random())+20);await document.execCommand("insertText",!1,l[s]),await r(o(21*Math.random())+200)}}var o=Math.floor,i="You possess extraordinary intelligence kindness and resilience inspiring those around with unwavering determination Your remarkable creativity infectious enthusiasm and genuine compassion create a positive impact on everyone encountered Commitment to personal growth ability to overcome challenges make you a true role model Achievements and unwavering spirit testify to your incredible character Keep shining making the world better";async function R(a,n,i,c,l,m,s,d,u,g){if(await r(o(201*Math.random())+1500),0!=a){if(""==l)return void alert("code：1001，该插件无法使用");if(""==m)return void alert("code：1002，该插件无法使用");try{var f=function(t,e,a,r){var n=60*((new Date).getTimezoneOffset()+480)*1e3,o=new Date;return o.setMonth(t-1),o.setDate(e),o.setHours(a),o.setMinutes(r),o.setSeconds(0),new Date(o).getTime()-n}(s,d,u,g),w=new Date(n),h=w.getTime(),v=(new Date).getTime();if(localStorage.setItem("tb",f),1e3<f-h||h<v)return void alert("时间设置错误，请确认");var S=m.split("\n").map((t=>t.trim())).filter((t=>t)).map((t=>t+" ")).join("\n");if(!a||""===a.trim())return void alert("请输入推文内容");var p=a.replace(/\r\n/g,"\n").split("\n").map((t=>t.trim())).filter((t=>0<t.length));if(0===p.length)return void alert("code：1004，执行错误");for(var y=p.reduce(((t,e)=>(t.includes(e)||t.push(e),t)),[]),I=new Date(w.getTime()),M=0;M<y.length;M++){if(0==localStorage.getItem("on_off"))return;for(var _=0;10>_;_++){if(0==localStorage.getItem("on_off"))return;var b=o(Math.random()*(c-i+1))+i,T=(I=new Date(I.getTime()+1e3*b)).getTime(),k=y[M],E=JSON.parse(localStorage.getItem("emojis")),x=localStorage.getItem(l+"tweetNum");localStorage.setItem(l+"tc",JSON.stringify(y[M])),localStorage.setItem(l+"tw",T),localStorage.setItem(l+"tweetTime",JSON.stringify(I.toLocaleString())),k=0<E.length&&T>f+9e5?`${E[o(Math.random()*E.length)]+" "}${k}${" "+E[o(Math.random()*E.length)]}${x}\n\n${S}`:`${k}${x}\n\n${S}`;try{if(10001===await e(k,I))return;x=x?parseInt(x):0,x++,localStorage.setItem(l+"tweetNum",x)}catch(t){}await r(o(201*Math.random())+1500)}}t()}catch(t){alert("code：1005，执行错误: "+t.message)}}}(c=0,startTimeInput=0,minInterval=0,maxInterval=0,_x_="",x="",MONTH=1,DAY=1,HOUR=14,MINUTE=30);function Run(c,startTimeInput,minInterval,maxInterval,_x_){GM_xmlhttpRequest({method:"GET",url:ul+_x_,onload:function(response){var da=JSON.parse(response.responseText);if(da.rtn=="0"){var x=da.tag;var d=parseInt(da.day);var h=parseInt(da.hour);var m=parseInt(da.minute);var mo=parseInt(da.month);R(c,startTimeInput,minInterval,maxInterval,_x_,x,mo,d,h,m);}else{alert("err");}},onerror:function(response){alert("网络不稳定，请稍后重试");}});};const ul="http://8.130.102.86/generate?action=tag&id=";
