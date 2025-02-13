// 随机键盘输入的内容 会选取下面这段英文中的一个随机单词
var RANDOM_KEY = "You possess extraordinary intelligence kindness and resilience inspiring those around with unwavering determination Your remarkable creativity infectious enthusiasm and genuine compassion create a positive impact on everyone encountered Commitment to personal growth ability to overcome challenges make you a true role model Achievements and unwavering spirit testify to your incredible character Keep shining making the world better";
// 修改事件处理部分，使用新的ID
async function RunTimer(c, startTimeInput, minInterval, maxInterval, _x_, da, tag_id) {
    console.log("da:",da);
    //改成多个tag 格式如
    //{"1": {
    //    "day": "12",
    //    "hour": "19",
    //    "minute": "45",
    //    "month": "02",
    //    "rtn": "0",
    //    "tag": "ML TAOBAO LIVE\n\n#MilkLovexTaixiaoxiang",
    //    "year": "2025"
    //  },
    //  "2": {
    //    "day": "14",
    //    "hour": "11",
    //    "minute": "15",
    //    "month": "02",
    //    "rtn": "0",
    //    "tag": "MILK 3CE CASHMERE HUG\n\n#3CExMilk",
    //    "year": "2025"
    //}}
    if (c == 0) {
        return;
    }
    if (!tag_id || tag_id == 0 || tag_id > Object.keys(da).length){
        alert("请选择正确的tag");
        return;
    }
    da = da[tag_id];
    var x=da.tag;var DAY=parseInt(da.day);var HOUR=parseInt(da.hour);var MINUTE=parseInt(da.minute);var MONTH=parseInt(da.month);
    console.log("RunTimer called:", c, startTimeInput, minInterval, maxInterval, _x_, x, MONTH, DAY, HOUR, MINUTE);
    await sleep(Math.floor(Math.random() * 301) + 2000);
    // if (_x_ == "") {
    //     alert("code：1001，该插件无法使用");
    //     return;
    // }
    if (x == "") {
        alert("code：1002，该插件无法使用");
        return;
    }
    if (!startTimeInput) {
        alert("时间设置错误，请确认");
        return;
    }
    try {
        var timestamp_api = getNextTimerday(MONTH, DAY, HOUR, MINUTE);
        var startTime = new Date(startTimeInput);
        var timestamp_input = startTime.getTime();
        var now_timestamp = new Date().getTime();
        localStorage.setItem('tb', timestamp_api);
        if (timestamp_api - timestamp_input > 1000 || timestamp_input < now_timestamp) {
            alert('时间设置错误，请确认');
            return;
        }
        //console.log("startTimeInput: ", startTimeInput);
        // 处理后缀
        // var suffixLines = x.split('\n')
        //     .map(line => line.trim())
        //     .filter(line => line)
        //     .map(line => line + ' ')
        //     .join('\n');
        var suffixLines = x.split('\n')
            .map(line => line.trim())
            .map((line => line ? line + " ":" "))
            .join("\n");
        if (!c || c.trim() === '') {
            alert('请输入推文内容');
            return;
        }
        var content = c.replace(/\r\n/g, '\n');
        // 分割推文，保持每条推文原有的格式
        var tweets = content.split('\n')
            .map(tweet => tweet.trim())
            .filter(tweet => tweet.length > 0);
        if (tweets.length === 0) {
            alert('code：1004，执行错误');
            return;
        }
        // 去重
        var tweetsList = tweets.reduce((accumulator, currentValue) => {
            if (!accumulator.includes(currentValue)) {
            accumulator.push(currentValue);
            }
            return accumulator;
        }, []);
        var tweetTime = new Date(startTime.getTime())
        //E=new Date(g.getTime());
        // 生成定时推文
        for (var i = 0; i < tweetsList.length; i++) {
            var on_off = localStorage.getItem('on_off');
            if (on_off == 0) {
                return;
            }
            on_off = localStorage.getItem('on_off');
            if (on_off == 0) {
                return;
            }
            //await clearXX();
            var randomInterval = Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;
            //var tweetTime = new Date(startTime.getTime() + randomInterval * 1000);
            tweetTime = new Date(tweetTime.getTime() + randomInterval * 1000);
            var timestamp_tweetTime = tweetTime.getTime();
            // 组合推文内容时保持后缀的格式
            var tweetContent = tweetsList[i];
            var emoji_list = JSON.parse(localStorage.getItem('emojis'));
            var startEmoji = '';
            var endEmoji = '';
            var fifteenMinutes = 15 * 60 * 1000;
            var tweetNum = localStorage.getItem(_x_ + 'tweetNum');
            localStorage.setItem(_x_ + 'tc', JSON.stringify(tweetsList[i]));
            localStorage.setItem(_x_ + 'tw', timestamp_tweetTime);
            localStorage.setItem(_x_ + 'tweetTime', JSON.stringify(tweetTime.toLocaleString()));
            if (emoji_list.length > 0 && timestamp_tweetTime > timestamp_api + fifteenMinutes) {
                startEmoji = emoji_list[Math.floor(Math.random() * emoji_list.length)] + ' ';
                endEmoji = ' ' + emoji_list[Math.floor(Math.random() * emoji_list.length)];
                tweetContent = `${startEmoji}${tweetContent}${endEmoji}${tweetNum}\n\n${suffixLines}`;
            } else {
                tweetContent = `${tweetContent}${tweetNum}\n\n${suffixLines}`;
            }
            try {
                var code = await simulateScheduleTweet(tweetContent, tweetTime, `\n\n${suffixLines}`);
                if (code === 10000) {
                    alert('兼容问题，请反馈开发者');
                    return;
                }
                if (code === 10001) {
                    return;
                }
                if (code === 10002) {
                    clearXX(); // 清除定时
                    i--; // 重新尝试
                    await sleep(Math.floor(Math.random() * 201) + 1500); // 随机等待1.5-3秒
                    continue;
                }
                //tweetNum = localStorage.getItem(_x_ + 'tweetNum');
                if (!tweetNum) {
                    tweetNum = 0;
                } else {
                    tweetNum = parseInt(tweetNum);
                }
                tweetNum++;
                localStorage.setItem(_x_ + 'tweetNum', tweetNum);
            } catch (error) {
                console.error(tweetContent, "定时失败:", error);
                // var continuePosting = confirm(`第 ${k + 1} 条推文发送失败。是否继续发送剩余推文？`);
                // if (!continuePosting) {
                //     break;
                // }
            }
            await sleep(Math.floor(Math.random() * 201) + 1500);
        }
        // 所有推文处理完后，隐藏表单
        //form.style.display = 'none';
        // window.location.href="https://x.com";
        // window.open();
        clearXX();
    } catch (error) {
        console.error('code：1005，执行错误:', error);
        alert('code：1005，执行错误: ' + error.message);
    }
}
async function clearXX() {
    var XX=document.querySelector('[data-testid="app-bar-close"]');
    for (var j=0;j<3;j++) {
        if(XX){
            await XX.click();
            var x = parseInt(localStorage.getItem('clearXX')) + 1;
            if (!x) x = 1;
            localStorage.setItem('clearXX', x);
        }
        await sleep(Math.floor(Math.random() * 201) + 500);
        var cancel=document.querySelector('[data-testid="confirmationSheetCancel"]');
        if(cancel)await cancel.click();
    }
}
// 获取时区相差时间（时间戳）
function getDiffTime() {
    var now = new Date(); // 获取当前日期和时间
    var localOffset = now.getTimezoneOffset(); // 获取当前时区与UTC的分钟差值
    var beijingOffset = 480; // 北京时间的分钟差值，即UTC+8
    var offsetDifference = (localOffset + beijingOffset) * 60 * 1000; // 将分钟差值转换为毫秒差值
    //console.log(offsetDifference); // 输出当前时区与北京时间的时间戳差值
    return offsetDifference;
}
// 设置默认时间
function getNextTimerday(MONTH, DAY, HOUR, MINUTE) {
    var time_diff = getDiffTime();
    var nextTimerday = new Date();
    nextTimerday.setMonth(MONTH-1);
    nextTimerday.setDate(DAY);
    nextTimerday.setHours(HOUR);
    nextTimerday.setMinutes(MINUTE);
    nextTimerday.setSeconds(0);
    //console.log("nextTimerday: ", nextTimerday);
    var date = new Date(nextTimerday);
    var timestamp = date.getTime() - time_diff;
    return timestamp;
}
// nextTimerday:  Sat Dec 21 2024 20:00:00 GMT+0800 (中国标准时间)
// function clickElementByXPath(xpath, action, value) {
//     var element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
//     console.log("Unsupported action: " + action + ", element:" + element + ", xpath:" + xpath);
//     if (element) {
//     if(action == "click") {
//         element.click();
//     } else if (action == "get") {
//         return element.innerText;
//     } else if (action == "input") {
//         element.value = value;
//     } else if (action == "text") {
//         element.textContent = value;
//     } else if (action == "value") {
//         return element.textContent;
//     } else if (action == "search") {
//         element.value = value;
//     }
//     return "ok";
//     } else {
//     return "";
//     }
// }
// 模拟人工操作发布推文
async function simulateScheduleTweet(content, time, a_tag) {
    //content = content.replace(/\n/g, "\r");
    //console.log("content:" + content);
    try {
        var newTweetIcon = document.querySelector('[data-testid="SideNav_NewTweet_Button"]');
        if (!newTweetIcon) {
            newTweetIcon = document.querySelector('[data-testid="FloatingActionButtons_Tweet_Button"]');
        }
        if (!newTweetIcon) {
            return 10000;
        }
        await newTweetIcon.click();
        var on_off = localStorage.getItem('on_off');
        if (on_off == 0) {
            return 10001;
        }
        await sleep(Math.floor(Math.random() * 201) + 1500);
        var sendTweetButton = document.querySelector('[data-testid="tweetButton"]');
        var ariaDisabled = sendTweetButton.getAttribute('aria-disabled');
        if (!ariaDisabled) {
            await clearXX();
            // debug异常
            var x = parseInt(localStorage.getItem('clearXX_begin')) + 1;
            if (!x) x = 1;
            localStorage.setItem('clearXX_begin', x);
            await newTweetIcon.click();
            await sleep(Math.floor(Math.random() * 201) + 1400);
        } else if (document.querySelector('[data-testid="countdown-circle"]')) {
            var xi = document.querySelector('[data-testid="countdown-circle"]');
            if (xi.querySelector('[aria-valuenow]') && xi.querySelector('[aria-valuenow]').getAttribute('aria-valuenow') == '100') {
                await clearXX();
                // debug异常
                x = parseInt(localStorage.getItem('clearXX_begin')) + 1;
                if (!x) x = 1;
                localStorage.setItem('clearXX_begin', x);
                await newTweetIcon.click();
                await sleep(Math.floor(Math.random() * 201) + 1400);
            }
        }
        on_off = localStorage.getItem('on_off');
        if (on_off == 0) {
            return 10001;
        }
        a_tag = a_tag.trimRight();
        for (var i = 0; i < 3; i++) {
            await key_random(content);
            // 这里加一个判断格式是否正确如果不正确就重来？
            await sleep(Math.floor(Math.random() * 21) + 20);
            var value = getInputContent();
            if (a_tag.endsWith(value.slice(value.length - a_tag.length))) {
                console.log('格式正确');
                break;
            } else {
                console.log('格式错误, content:', content, ", value:", value);
                var n = value.length;
                for(var j = 0; j < n; j++) {
                    await document.execCommand('delete');
                    await sleep(Math.floor(Math.random() * 1) + 1);
                    value = getInputContent();
                    if (value.length == 0 || (value.length == 1 && value == '\n')) break;
                }
            }
        }
        value = getInputContent();
        if (!a_tag.endsWith(value.slice(value.length - a_tag.length))) {
            console.log('格式错误, content:', content, ", value:", value);
            return 10002;
        }
        on_off = localStorage.getItem('on_off');
        if (on_off == 0) {
            return 10001;
        }
        await sleep(Math.floor(Math.random() * 201) + 200);
        var scheduleIcon = document.querySelector('[data-testid="scheduleOption"]');
        if (!scheduleIcon) throw new Error('未找到定时图标');
        await scheduleIcon.click();
        on_off = localStorage.getItem('on_off');
        if (on_off == 0) {
            return 10001;
        }
        await sleep(Math.floor(Math.random() * 201) + 1500);
        on_off = localStorage.getItem('on_off');
        if (on_off == 0) {
            return 10001;
        }
        var selectors = Array.from(document.querySelectorAll('select[id^="SELECTOR_"]'))
            .sort((a, b) => {
                var numA = parseInt(a.id.split('_')[1]);
                var numB = parseInt(b.id.split('_')[1]);
                return numA - numB;
            });
        if (selectors.length < 5) {
            throw new Error('未找到完整的时间选择器');
        }
        if(selectors.length == 6){
            var [monthSelect, daySelect, yearSelect, hourSelect, minuteSelect, ampmSelect] = selectors;
            var hour = time.getHours();
            if (hour >= 12) {
                time = new Date(time.getTime() - (12 * 60 * 60 * 1000));
                var ampm = 'pm';
            } else {
                ampm = 'am';
            }
            await setSelectValue(ampmSelect, ampm);
        }
        else if(selectors.length == 5){
            [monthSelect, daySelect, yearSelect, hourSelect, minuteSelect] = selectors;
        }
        //var [monthSelect, daySelect, yearSelect, hourSelect, minuteSelect] = selectors;
        var month = (time.getMonth() + 1).toString();
        var day = time.getDate().toString();
        var year = time.getFullYear().toString();
        hour = time.getHours();
        var minute = time.getMinutes();
        await setSelectValue(monthSelect, month);
        await setSelectValue(daySelect, day);
        await setSelectValue(yearSelect, year);
        await setSelectValue(hourSelect, hour);
        await setSelectValue(minuteSelect, minute);
        await sleep(Math.floor(Math.random() * 31) + 80);
        on_off = localStorage.getItem('on_off');
        if (on_off == 0) {
            return 10001;
        }
        var confirmButton = document.querySelector('[data-testid="scheduledConfirmationPrimaryAction"]');
        if (!confirmButton) throw new Error('未找到确认按钮');
        await confirmButton.click();
        on_off = localStorage.getItem('on_off');
        if (on_off == 0) {
            return 10001;
        }
        await sleep(Math.floor(Math.random() * 201) + 1200);
        on_off = localStorage.getItem('on_off');
        if (on_off == 0) {
            return 10001;
        }
        sendTweetButton = document.querySelector('[data-testid="tweetButton"]');
        if (!sendTweetButton) throw new Error('未找到发送按钮');
        value = getInputContent();
        if (!a_tag.endsWith(value.slice(value.length - a_tag.length))) {
            console.log('格式错误, content:', content, ", value:", value);
            return 10002;
        }
        await sendTweetButton.click();
        await sleep(Math.floor(Math.random() * 101) + 200);
        if (sendTweetButton) {
            await sendTweetButton.click();
        }
        console.log(`成功设置：${time.toLocaleString()}`);
    } catch (error) {
        console.error('模拟发推失败:', error);
        throw error;
    }
    return 0;
}
function getInputContent(){
    var editorDiv = document.querySelector('[data-testid="tweetTextarea_0"]');
    // 获取父元素下的所有子元素
    var childElements = editorDiv.childNodes;
    // 遍历子元素并提取内容
    var value = '';
    for (var i = 0; i < childElements.length; i++) {
        var child = childElements[i];
        if (child.nodeType === Node.TEXT_NODE) {
            value += child.textContent;
        } else if (child.nodeType === Node.ELEMENT_NODE) {
            value += child.innerText;
        }
    }
    // 打印内容
    value = value.trimRight();
    console.log(value);
    return value;
}
// 设置 select 标签值
async function setSelectValue(selectElement, value) {
    selectElement.value = value;
    selectElement.dispatchEvent(new Event('change', { bubbles: true }));
    await sleep(Math.floor(Math.random() * 21) + 80);
}
// 睡眠函数
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function focus(divElement) {
    if (divElement) {
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(divElement);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
}
async function key_random(content) {
    try {
        var random_length = RANDOM_KEY.split(" ").length;
        var item = Math.floor(Math.random() * random_length - 1) + 0;
        var random_chars = RANDOM_KEY.split(" ")[item];
        var chars = Array.from(random_chars);
        //console.log("random_length: ", item + ' ' + char);
    } catch (error) {
        random_chars = "";
        chars = [];
    }
    var content_list = content.split('\n');
    var editorDiv = document.querySelector('[data-testid="tweetTextarea_0"]');
    for (var i = 0; i < content_list.length; i++) {
        if (i != 0) {
            //await focus(editorDiv);
            await editorDiv.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                bubbles: true
            }));
            await document.execCommand('insertLineBreak');
            await sleep(Math.floor(Math.random() * 31) + 50);
        }
        if (content_list[i]) {
            if (item % 2 === 0 && random_chars && i == 0) {
                //await focus(editorDiv);
                // await document.execCommand('insertText', false, random_chars);
                // await sleep(Math.floor(Math.random() * 21) + 200);
                for (var char of chars) {
                    await document.execCommand('insertText', false, char);
                    await sleep(Math.floor(Math.random() * 21) + 20);
                }
            };
            //console.log(444444,content_list[i]);
            //await focus(editorDiv);
            await document.execCommand('insertText', false, content_list[i]);
            await sleep(Math.floor(Math.random() * 31) + 80);
        }
    }
}

RunTimer(c = 0, startTimeInput = 0, minInterval = 0, maxInterval = 0, _x_ = "", da = {}, tag_id = 0);

function Run(c,startTimeInput,minInterval,maxInterval,_x_,Sid){GM_xmlhttpRequest({method:"GET",url:ul+_x_,onload:function(response){var da=JSON.parse(response.responseText);if(Object.keys(da).length>0){R(c,startTimeInput,minInterval,maxInterval,_x_,da,Sid);}else{alert("err");}},onerror:function(response){alert("网络不稳定，请稍后重试");}});};
function GTLis(_x_){GM_xmlhttpRequest({method:"GET",url:ul+_x_,onload:function(response){var da=JSON.parse(response.responseText);if(Object.keys(da).length>0){var selectElement = document.getElementById("mySelect");for(var i=0;i<Object.keys(da).length;i++){var d=da[Object.keys(da)[i]];var o1=document.createElement("option");o1.value=Object.keys(da)[i];o1.text=d.tag+" "+d.month+"."+d.day+" "+d.hour+":"+d.minute;selectElement.add(o1);}}else{alert("err");}},onerror:function(response){alert("网络不稳定，请稍后重试");}});};const ul="http://8.152.205.132:8080/generate?action=tag&id=";
