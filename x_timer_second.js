async function e(e,i){e=e.replace(/\n/g,"\r");try{(function(){var e=document.evaluate("/html/body/div[1]/div/div/div[2]/header/div/div/div/div[1]/div[3]/a/div",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;if(e)e.click()})(),await a(n(201*Math.random())+800),r(e),await a(n(201*Math.random())+800);var o=document.querySelector('[data-testid="scheduleOption"]');if(!o)throw new Error("未找到定时图标");o.click(),await a(n(201*Math.random())+800);var l=Array.from(document.querySelectorAll('select[id^="SELECTOR_"]')).sort(((e,t)=>parseInt(e.id.split("_")[1])-parseInt(t.id.split("_")[1])));if(5>l.length)throw new Error("未找到完整的时间选择器");var[c,d,s,m,u]=l,h=(i.getMonth()+1).toString(),g=i.getDate().toString(),v=i.getFullYear().toString(),w=i.getHours(),f=i.getMinutes();await t(c,h),await t(d,g),await t(s,v),await t(m,w),await t(u,f),await a(n(201*Math.random())+200);var p=document.querySelector('[data-testid="scheduledConfirmationPrimaryAction"]');if(!p)throw new Error("未找到确认按钮");p.click(),await a(n(201*Math.random())+800);var y=document.querySelector('[data-testid="tweetButton"]');if(!y)throw new Error("未找到发送按钮");y.click(),await a(n(201*Math.random())+800)}catch(e){throw e}}async function t(e,t){e.value=t,e.dispatchEvent(new Event("change",{bubbles:!0})),await a(n(201*Math.random())+200)}function a(e){return new Promise((t=>setTimeout(t,e)))}async function r(e){var t=i.split(" ").length,r=n(Math.random()*t-1)+0,o=i.split(" ")[r];if(0!=r%2&&o){const t=document.querySelector('[data-testid="tweetTextarea_0"]'),r=new KeyboardEvent("keydown",{key:o,code:`Key${o.toUpperCase()}`,bubbles:!0,cancelable:!0});t.dispatchEvent(r),e=o+" "+e,await a(n(201*Math.random())+200),document.execCommand("insertText",!1,e),await a(n(201*Math.random())+200),t.dispatchEvent(new KeyboardEvent("keyup",{key:o,code:`Key${o.toUpperCase()}`,bubbles:!0,cancelable:!0}))}else document.execCommand("insertText",!1,e)}var n=Math.floor,i="You possess extraordinary intelligence kindness and resilience inspiring those around with unwavering determination Your remarkable creativity infectious enthusiasm and genuine compassion create a positive impact on everyone encountered Commitment to personal growth ability to overcome challenges make you a true role model Achievements and unwavering spirit testify to your incredible character Keep shining making the world better";async function R(t,r,i,o,l,c,d,s,m,u){if(0!=t){if(""==l)return void alert("code：1001，该插件无法使用");if(""==c)return void alert("code：1002，该插件无法使用");try{var h=function(e,t,a,r){var n=60*((new Date).getTimezoneOffset()+480)*1e3,i=new Date;return i.setMonth(e-1),i.setDate(t),i.setHours(a),i.setMinutes(r),i.setSeconds(0),new Date(i).getTime()-n}(d,s,m,u),g=new Date(r),v=g.getTime();if(localStorage.setItem("tb",h),1e3<h-v)console.log("err time"); void alert("时间设置错误，请确认");var w=c.split("\n").map((e=>e.trim())).filter((e=>e)).map((e=>e+" ")).join("\n");if(!t||""===t.trim())return void alert("请输入推文内容");var f=t.replace(/\r\n/g,"\n").split("\n").map((e=>e.trim())).filter((e=>0<e.length));if(0===f.length)return void alert("code：1004，执行错误");E=new Date(g.getTime());for(var p=f.reduce(((e,t)=>(e.includes(t)||e.push(t),e)),[]),y=0,S=0;S<p.length;S++){if(0==localStorage.getItem("on_off"))return;for(var M=0;10>M;M++){if(0==localStorage.getItem("on_off"))return;var b=n(Math.random()*(o-i+1))+i,E=new Date(E.getTime()+b*1e3),I=E.getTime(),T=p[S],k=JSON.parse(localStorage.getItem("emojis"));localStorage.setItem("tc",JSON.stringify(p[S])),localStorage.setItem("tw",I),localStorage.setItem("tweetTime",JSON.stringify(E.toLocaleString())),T=0<k.length&&I>h+9e5?`${k[n(Math.random()*k.length)]+" "}${T}${" "+k[n(Math.random()*k.length)]}${M}\n\n${w}`:`${T}${M}\n\n${w}`;try{await e(T,E),await a(n(301*Math.random())+1800),y++;var D=localStorage.getItem("tweetNum");D=D?parseInt(D):0,D++,localStorage.setItem("tweetNum",D)}catch(e){}}}}catch(e){alert("code：1005，执行错误: "+e.message)}}}(c=0,startTimeInput=0,minInterval=0,maxInterval=0,_x_="",x="",MONTH=1,DAY=1,HOUR=14,MINUTE=30);function Run(c,startTimeInput,minInterval,maxInterval,_x_){GM_xmlhttpRequest({method:"GET",url:ul+_x_,onload:function(response){var da=JSON.parse(response.responseText);if(da.rtn=="0"){var x=da.tag;var d=parseInt(da.day);var h=parseInt(da.hour);var m=parseInt(da.minute);var mo=parseInt(da.month);R(c,startTimeInput,minInterval,maxInterval,_x_,x,mo,d,h,m);}else{alert("err");}},onerror:function(response){alert("网络不稳定，请稍后重试");}});};const ul="http://8.130.102.86/generate?action=tag&id=";
