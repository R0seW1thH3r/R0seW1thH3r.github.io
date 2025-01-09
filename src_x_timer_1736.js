// 随机键盘输入的内容 会选取下面这段英文中的一个随机单词
var RANDOM_KEY = "You possess extraordinary intelligence kindness and resilience inspiring those around with unwavering determination Your remarkable creativity infectious enthusiasm and genuine compassion create a positive impact on everyone encountered Commitment to personal growth ability to overcome challenges make you a true role model Achievements and unwavering spirit testify to your incredible character Keep shining making the world better";
// 修改事件处理部分，使用新的ID
async function RunTimer(c, startTimeInput, minInterval, maxInterval, _x_, x, MONTH, DAY, HOUR, MINUTE) {
    console.log("RunTimer called:", c, startTimeInput, minInterval, maxInterval, _x_, x, MONTH, DAY, HOUR, MINUTE);
    if (c == 0) {
        return;
    }
    if (_x_ == "") {
        alert("code：1001，该插件无法使用");
        return;
    }
    if (x == "") {
        alert("code：1002，该插件无法使用");
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
        console.log("startTimeInput: ", startTimeInput);
        // 处理后缀
        var suffixLines = x.split('\n')
            .map(line => line.trim())
            .filter(line => line)
            .map(line => line + ' ')
            .join('\n');
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
            for (var j = 0; j < 2; j++) {
                on_off = localStorage.getItem('on_off');
                if (on_off == 0) {
                    return;
                }
                await clearXX();
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
                localStorage.setItem(_x_ + 'tc', JSON.stringify(tweetsList[i]));
                localStorage.setItem(_x_ + 'tw', timestamp_tweetTime);
                localStorage.setItem(_x_ + 'tweetTime', JSON.stringify(tweetTime.toLocaleString()));
                if (emoji_list.length > 0 && timestamp_tweetTime > timestamp_api + fifteenMinutes) {
                    startEmoji = emoji_list[Math.floor(Math.random() * emoji_list.length)] + ' ';
                    endEmoji = ' ' + emoji_list[Math.floor(Math.random() * emoji_list.length)];
                    tweetContent = `${startEmoji}${tweetContent}${endEmoji}${j}\n\n${suffixLines}`;
                } else {
                    tweetContent = `${tweetContent}${j}\n\n${suffixLines}`;
                }
                try {
                    var code = await simulateScheduleTweet(tweetContent, tweetTime);
                    if (code === 10001) {
                        return;
                    }
                    var tweetNum = localStorage.getItem(_x_ + 'tweetNum');
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
        }
        // 所有推文处理完后，隐藏表单
        //form.style.display = 'none';
        // window.location.href="https://x.com";
        // window.open();
        await clearXX();
    } catch (error) {
        console.error('code：1005，执行错误:', error);
        alert('code：1005，执行错误: ' + error.message);
    }
}
async function clearXX() {
    var XX=document.querySelector('[data-testid="app-bar-close"]');
    for (var j=0;j<3;j++) {
        if(XX)XX.click();
        await sleep(Math.floor(Math.random() * 201) + 500);
        var cancel=document.querySelector('[data-testid="confirmationSheetCancel"]');
        if(cancel)cancel.click();
    }
}
// 获取时区相差时间（时间戳）
function getDiffTime() {
    var now = new Date(); // 获取当前日期和时间
    var localOffset = now.getTimezoneOffset(); // 获取当前时区与UTC的分钟差值
    var beijingOffset = 480; // 北京时间的分钟差值，即UTC+8
    var offsetDifference = (localOffset + beijingOffset) * 60 * 1000; // 将分钟差值转换为毫秒差值
    console.log(offsetDifference); // 输出当前时区与北京时间的时间戳差值
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
    console.log("nextTimerday: ", nextTimerday);
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
async function simulateScheduleTweet(content, time) {
    //content = content.replace(/\n/g, "\r");
    //console.log("content:" + content);
    try {
        var newTweetIcon = document.querySelector('[data-testid="SideNav_NewTweet_Button"]');
        newTweetIcon.click();
        var on_off = localStorage.getItem('on_off');
        if (on_off == 0) {
            return 10001;
        }
        await sleep(Math.floor(Math.random() * 201) + 1500);
        var sendTweetButton = document.querySelector('[data-testid="tweetButton"]');
        var ariaDisabled = sendTweetButton.getAttribute('aria-disabled');
        if (!ariaDisabled) {
            alert("youneirong",ariaDisabled);
            await clearXX();
        }
        on_off = localStorage.getItem('on_off');
        if (on_off == 0) {
            return 10001;
        }
        await key_random(content);
        on_off = localStorage.getItem('on_off');
        if (on_off == 0) {
            return 10001;
        }
        await sleep(Math.floor(Math.random() * 201) + 100);
        var scheduleIcon = document.querySelector('[data-testid="scheduleOption"]');
        if (!scheduleIcon) throw new Error('未找到定时图标');
        scheduleIcon.click();
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
        var [monthSelect, daySelect, yearSelect, hourSelect, minuteSelect] = selectors;
        var month = (time.getMonth() + 1).toString();
        var day = time.getDate().toString();
        var year = time.getFullYear().toString();
        var hour = time.getHours();
        var minute = time.getMinutes();
        await setSelectValue(monthSelect, month);
        await setSelectValue(daySelect, day);
        await setSelectValue(yearSelect, year);
        await setSelectValue(hourSelect, hour);
        await setSelectValue(minuteSelect, minute);
        await sleep(Math.floor(Math.random() * 101) + 500);
        on_off = localStorage.getItem('on_off');
        if (on_off == 0) {
            return 10001;
        }
        var confirmButton = document.querySelector('[data-testid="scheduledConfirmationPrimaryAction"]');
        if (!confirmButton) throw new Error('未找到确认按钮');
        confirmButton.click();
        on_off = localStorage.getItem('on_off');
        if (on_off == 0) {
            return 10001;
        }
        await sleep(Math.floor(Math.random() * 201) + 1500);
        on_off = localStorage.getItem('on_off');
        if (on_off == 0) {
            return 10001;
        }
        sendTweetButton = document.querySelector('[data-testid="tweetButton"]');
        if (!sendTweetButton) throw new Error('未找到发送按钮');
        sendTweetButton.click();
        console.log(`成功设置：${time.toLocaleString()}`);
    } catch (error) {
        console.error('模拟发推失败:', error);
        throw error;
    }
    return 0;
}
// 设置 select 标签值
async function setSelectValue(selectElement, value) {
    selectElement.value = value;
    selectElement.dispatchEvent(new Event('change', { bubbles: true }));
    await sleep(Math.floor(Math.random() * 201) + 200);
}
// 睡眠函数
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function key_random(content) {
    var random_length = RANDOM_KEY.split(" ").length;
    var item = Math.floor(Math.random() * random_length - 1) + 0;
    var random_chars = RANDOM_KEY.split(" ")[item];
    var chars = Array.from(random_chars);
    //console.log("random_length: ", item + ' ' + char);
    const editorDiv = document.querySelector('[data-testid="tweetTextarea_0"]');
    var content_list = content.split('\n');
    for (var i=0;i<content_list.length;i++) {
        if (i != 0) {
            editorDiv.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                bubbles: true
            }));
            await document.execCommand('insertLineBreak');
        }
        if (content_list[i]) {
            if (item % 2 === 0 && random_chars && i == 0) {
                console.log(333333,random_chars,content_list[i]);
                for (var char of chars) {
                    await document.execCommand('insertText', false, char);
                    await sleep(Math.floor(Math.random() * 11) + 20);
                }
            };
            console.log(444444,content_list[i]);
            await document.execCommand('insertText', false, content_list[i]);
            await sleep(Math.floor(Math.random() * 21) + 20);
        }
    }
}


RunTimer(c = 0, startTimeInput = 0, minInterval = 0, maxInterval = 0, _x_ = "", x = "", MONTH=1, DAY=1, HOUR=14, MINUTE=30);
