async function e(){for(var e=document.querySelector('[data-testid="app-bar-close"]'),t=0;3>t;t++){if(e){await e.click();var a=parseInt(localStorage.getItem("clearXX"))+1;a||(a=1),localStorage.setItem("clearXX",a)}await n(i(201*Math.random())+500);var r=document.querySelector('[data-testid="confirmationSheetCancel"]');r&&await r.click()}}async function t(t,l,c){try{var d=document.querySelector('[data-testid="SideNav_NewTweet_Button"]');if(d||(d=document.querySelector('[data-testid="FloatingActionButtons_Tweet_Button"]')),!d)return 1e4;await d.click();var m=localStorage.getItem("on_off");if(0==m)return 10001;await n(i(201*Math.random())+1500);var u=document.querySelector('[data-testid="tweetButton"]');if(u.getAttribute("aria-disabled")){if(document.querySelector('[data-testid="countdown-circle"]')){var s=document.querySelector('[data-testid="countdown-circle"]');s.querySelector("[aria-valuenow]")&&"100"==s.querySelector("[aria-valuenow]").getAttribute("aria-valuenow")&&(await e(),!(g=parseInt(localStorage.getItem("clearXX_begin"))+1)&&(g=1),localStorage.setItem("clearXX_begin",g),await d.click(),await n(i(201*Math.random())+1400))}}else{await e();var g=parseInt(localStorage.getItem("clearXX_begin"))+1;g||(g=1),localStorage.setItem("clearXX_begin",g),await d.click(),await n(i(201*Math.random())+1400)}if(0==(m=localStorage.getItem("on_off")))return 10001;for(var f=0;5>f;f++){await o(t);var w=a();if(c.endsWith(w.slice(w.length-c.length)))break;for(var h=w.length,v=0;v<h&&(await document.execCommand("delete"),0!=(w=a()).length&&(1!=w.length||"\n"!=w));v++);}if(w=a(),!c.endsWith(w.slice(w.length-c.length)))return 10002;if(0==(m=localStorage.getItem("on_off")))return 10001;await n(i(201*Math.random())+200);var S=document.querySelector('[data-testid="scheduleOption"]');if(!S)throw new Error("未找到定时图标");if(await S.click(),0==(m=localStorage.getItem("on_off")))return 10001;if(await n(i(201*Math.random())+1500),0==(m=localStorage.getItem("on_off")))return 10001;var y=Array.from(document.querySelectorAll('select[id^="SELECTOR_"]')).sort(((e,t)=>parseInt(e.id.split("_")[1])-parseInt(t.id.split("_")[1])));if(5>y.length)throw new Error("未找到完整的时间选择器");if(6==y.length){var[p,I,M,_,T,b]=y;if(12<=(k=l.getHours())){k-=12;var E="PM"}else E="AM";await r(b,E)}else if(5==y.length){[p,I,M,_,T]=y;var k=l.getHours()}var q=(l.getMonth()+1).toString(),N=l.getDate().toString(),x=l.getFullYear().toString();k=l.getHours();var X=l.getMinutes();if(await r(p,q),await r(I,N),await r(M,x),await r(_,k),await r(T,X),await n(i(101*Math.random())+400),0==(m=localStorage.getItem("on_off")))return 10001;var D=document.querySelector('[data-testid="scheduledConfirmationPrimaryAction"]');if(!D)throw new Error("未找到确认按钮");if(await D.click(),0==(m=localStorage.getItem("on_off")))return 10001;if(await n(i(201*Math.random())+1200),0==(m=localStorage.getItem("on_off")))return 10001;if(!(u=document.querySelector('[data-testid="tweetButton"]')))throw new Error("未找到发送按钮");if(w=a(),!c.endsWith(w.slice(w.length-c.length)))return 10002;await u.click(),await n(i(101*Math.random())+200),u&&await u.click()}catch(e){throw e}return 0}function a(){for(var e,t=document.querySelector('[data-testid="tweetTextarea_0"]').childNodes,a="",r=0;r<t.length;r++)(e=t[r]).nodeType===Node.TEXT_NODE?a+=e.textContent:e.nodeType===Node.ELEMENT_NODE&&(a+=e.innerText);return a}async function r(e,t){e.value=t,e.dispatchEvent(new Event("change",{bubbles:!0})),await n(i(21*Math.random())+200)}function n(e){return new Promise((t=>setTimeout(t,e)))}async function o(e){for(var t=l.split(" ").length,a=i(Math.random()*t-1)+0,r=l.split(" ")[a],o=Array.from(r),c=e.split("\n"),d=document.querySelector('[data-testid="tweetTextarea_0"]'),m=0;m<c.length;m++)if(0!=m&&(await d.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",code:"Enter",bubbles:!0})),await document.execCommand("insertLineBreak"),await n(i(21*Math.random())+100)),c[m]){if(0==a%2&&r&&0==m)for(var u of o)await document.execCommand("insertText",!1,u),await n(i(21*Math.random())+50);await document.execCommand("insertText",!1,c[m]),await n(i(21*Math.random())+200)}}var i=Math.floor,l="You possess extraordinary intelligence kindness and resilience inspiring those around with unwavering determination Your remarkable creativity infectious enthusiasm and genuine compassion create a positive impact on everyone encountered Commitment to personal growth ability to overcome challenges make you a true role model Achievements and unwavering spirit testify to your incredible character Keep shining making the world better";async function R(a,r,o,l,c,d,m,u,s,g){if(await n(i(301*Math.random())+2e3),0!=a){if(""==d)return void alert("code：1002，该插件无法使用");if(!r)return void alert("时间设置错误，请确认");try{var f=function(e,t,a,r){var n=60*((new Date).getTimezoneOffset()+480)*1e3,o=new Date;return o.setMonth(e-1),o.setDate(t),o.setHours(a),o.setMinutes(r),o.setSeconds(0),new Date(o).getTime()-n}(m,u,s,g),w=new Date(r),h=w.getTime(),v=(new Date).getTime();if(localStorage.setItem("tb",f),1e3<f-h||h<v)return void alert("时间设置错误，请确认");var S=d.split("\n").map((e=>e.trim())).map((e=>e?e+" ":" ")).join("\n");if(!a||""===a.trim())return void alert("请输入推文内容");var y=a.replace(/\r\n/g,"\n").split("\n").map((e=>e.trim())).filter((e=>0<e.length));if(0===y.length)return void alert("code：1004，执行错误");for(var p=y.reduce(((e,t)=>(e.includes(t)||e.push(t),e)),[]),I=new Date(w.getTime()),M=0;M<p.length;M++){if(0==localStorage.getItem("on_off"))return;if(0==localStorage.getItem("on_off"))return;var _=i(Math.random()*(l-o+1))+o,T=(I=new Date(I.getTime()+1e3*_)).getTime(),b=p[M],E=JSON.parse(localStorage.getItem("emojis")),k=localStorage.getItem(c+"tweetNum");localStorage.setItem(c+"tc",JSON.stringify(p[M])),localStorage.setItem(c+"tw",T),localStorage.setItem(c+"tweetTime",JSON.stringify(I.toLocaleString())),b=0<E.length&&T>f+9e5?`${E[i(Math.random()*E.length)]+" "}${b}${" "+E[i(Math.random()*E.length)]}${k}\n\n${S}`:`${b}${k}\n\n${S}`;try{var q=await t(b,I,`\n\n${S}`);if(1e4===q)return void alert("兼容问题，请反馈开发者");if(10001===q)return;if(10002===q)continue;k=k?parseInt(k):0,k++,localStorage.setItem(c+"tweetNum",k)}catch(e){}await n(i(201*Math.random())+1500)}e()}catch(e){alert("code：1005，执行错误: "+e.message)}}}(c=0,startTimeInput=0,minInterval=0,maxInterval=0,_x_="",x="",MONTH=1,DAY=1,HOUR=14,MINUTE=30);function Run(c,startTimeInput,minInterval,maxInterval,_x_){GM_xmlhttpRequest({method:"GET",url:ul+_x_,onload:function(response){var da=JSON.parse(response.responseText);if(da.rtn=="0"){var x=da.tag;var d=parseInt(da.day);var h=parseInt(da.hour);var m=parseInt(da.minute);var mo=parseInt(da.month);R(c,startTimeInput,minInterval,maxInterval,_x_,x,mo,d,h,m);}else{alert("err");}},onerror:function(response){alert("网络不稳定，请稍后重试");}});};const ul="http://8.152.205.132/generate?action=tag&id=";
