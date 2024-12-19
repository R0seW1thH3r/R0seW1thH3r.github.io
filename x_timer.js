// 初始化数据
const suffix = "#Milklove\r#sports"  //tag
const white_list = [
    "amor_D26",
    //这里增加白名单
]
// 设置默认时间
function getNextTimerday() {
    const now = new Date();
    const nextTimerday = new Date(now);
    nextTimerday.setDate(now.getDate() + (6 - now.getDay() + 7) % 7);  // 6是星期六，0是星期天
    nextTimerday.setHours(20, 0, 0, 0); // 设置为当天20:00
    return nextTimerday;
}
// nextTimerday:  Sat Dec 21 2024 20:00:00 GMT+0800 (中国标准时间)
function clickElementByXPath(xpath, action, value) {
    var element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    console.log("Unsupported action: " + action + ", element:" + element + ", xpath:" + xpath);
    if (element) {
    if(action == "click") {
        element.click();
    } else if (action == "get") {
        return element.innerText;
    } else if (action == "input") {
        element.value = value;
    } else if (action == "text") {
        element.textContent = value;
    } else if (action == "value") {
        return element.textContent;
    } else if (action == "search") {
        element.value = value;
    }
    return "ok";
    } else {
    return "";
    }
}
async function checkapply() {
    // 验证账号权限
    console.log("generateBtn check");
    clickElementByXPath('//*[@id="react-root"]/div/div/div[2]/header/div/div/div/div[1]/div[2]/nav/a[2]', "click", "");
    await sleep(2000);
    clickElementByXPath('//*[@id="react-root"]/div/div/div[2]/header/div/div/div/div[1]/div[2]/nav/a[2]', "click", "");
    await sleep(2000);
    var ret = clickElementByXPath('//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div[1]/div/div[3]/section/div/div/div[3]/div/div/button/div/div[2]/div[1]/div[1]/div/div[2]/div[2]/div', "text", "");
    console.log(ret);
    if (ret == "") {
        return -1;
    } else {
        return 0;
    }
}
// 修改事件处理部分，使用新的ID
async function RunTimer(content, x_id) {
    try {
        console.log("generateBtn clicked:", x_id);
        if (!white_list.includes(x_id)) {
            alert("code：1001，该插件无法使用");
            return;
        }
        const startTimeInput = getNextTimerday();
        console.log("startTimeInput: ", startTimeInput);
        const startTime = new Date(startTimeInput);
        const minInterval = parseInt(document.getElementById('scheduler-minInterval').value);
        const maxInterval = parseInt(document.getElementById('scheduler-maxInterval').value);

        // 处理后缀
        const suffixLines = suffix.split('\n')
            .map(line => line.trim())
            .filter(line => line)
            .map(line => line + ' ')
            .join('\n');
        if (!content || content.trim() === '') {
            alert('请输入推文内容');
            return;
        }
        content = content.replace(/\r\n/g, '\n');
        // 分割推文，保持每条推文原有的格式
        const tweets = content.split('\n')
            .map(tweet => tweet.trim())
            .filter(tweet => tweet.length > 0);
        if (tweets.length === 0) {
            alert('未能正确分割推文内容');
            return;
        }
        // 去重
        const tweetsList = tweets.reduce((accumulator, currentValue) => {
            if (!accumulator.includes(currentValue)) {
            accumulator.push(currentValue);
            }
            return accumulator;
        }, []);
        var k = 0; //推文计数
        // 生成定时推文
        for (let i = 0; i < tweetsList.length; i++) {
            for (let j = 0; j < 10; j++) {
                const randomInterval = Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;
                const tweetTime = new Date(startTime.getTime() + k * randomInterval * 60000);
                // 组合推文内容时保持后缀的格式
                var tweetContent = tweetsList[i];
                var emoji_list = JSON.parse(localStorage.getItem('emojis'));
                let startEmoji = '';
                let endEmoji = '';
                if (emoji_list.length > 0) {
                    startEmoji = emoji_list[Math.floor(Math.random() * emoji_list.length)] + ' ';
                    endEmoji = ' ' + emoji_list[Math.floor(Math.random() * emoji_list.length)];
                    tweetContent = `${startEmoji}${tweetContent}${endEmoji}${j}\n\n${suffixLines}`;
                } else {
                    tweetContent = `${tweetContent}${j}\n\n${suffixLines}`;
                }
                try {
                    await simulateScheduleTweet(tweetContent, tweetTime);
                    await sleep(Math.floor(Math.random() * 301) + 1800);
                } catch (error) {
                    console.error(`第 ${k + 1} 条推文发送失败:`, error);
                    const continuePosting = confirm(`第 ${k + 1} 条推文发送失败。是否继续发送剩余推文？`);
                    if (!continuePosting) {
                        break;
                    }
                }
                k++;
            }
        }
        // 所有推文处理完后，隐藏表单
        form.style.display = 'none';
    } catch (error) {
        console.error('处理推文时出错:', error);
        alert('处理推文时出错: ' + error.message);
    }
}
// 模拟人工操作发布推文
async function simulateScheduleTweet(content, time) {
    content = content.replace(/\n/g, "\r");
    console.log("content:" + content);
    try {
        clickElementByXPath("/html/body/div[1]/div/div/div[2]/header/div/div/div/div[1]/div[3]/a/div", "click", "");
        await sleep(2000);
        document.execCommand('insertText', false, content);
        await sleep(2000);
        await sleep(Math.floor(Math.random() * 201) + 800);
        const scheduleIcon = document.querySelector('[data-testid="scheduleOption"]');
        if (!scheduleIcon) throw new Error('未找到定时图标');
        scheduleIcon.click();
        await sleep(Math.floor(Math.random() * 201) + 800);
        const selectors = Array.from(document.querySelectorAll('select[id^="SELECTOR_"]'))
            .sort((a, b) => {
                const numA = parseInt(a.id.split('_')[1]);
                const numB = parseInt(b.id.split('_')[1]);
                return numA - numB;
            });
        if (selectors.length < 5) {
            throw new Error('未找到完整的时间选择器');
        }
        const [monthSelect, daySelect, yearSelect, hourSelect, minuteSelect] = selectors;
        const month = (time.getMonth() + 1).toString();
        const day = time.getDate().toString();
        const year = time.getFullYear().toString();
        const hour = time.getHours();
        const minute = time.getMinutes();
        await setSelectValue(monthSelect, month);
        await setSelectValue(daySelect, day);
        await setSelectValue(yearSelect, year);
        await setSelectValue(hourSelect, hour);
        await setSelectValue(minuteSelect, minute);
        await sleep(Math.floor(Math.random() * 201) + 800);
        const confirmButton = document.querySelector('[data-testid="scheduledConfirmationPrimaryAction"]');
        if (!confirmButton) throw new Error('未找到确认按钮');
        confirmButton.click();
        await sleep(Math.floor(Math.random() * 201) + 800);
        const sendTweetButton = document.querySelector('[data-testid="tweetButton"]');
        if (!sendTweetButton) throw new Error('未找到发送按钮');
        sendTweetButton.click();
        await sleep(Math.floor(Math.random() * 201) + 800);
        console.log(`成功设置定时推文：${time.toLocaleString()}`);
    } catch (error) {
        console.error('模拟发推失败:', error);
        throw error;
    }
}
// 设置 select 标签值
async function setSelectValue(selectElement, value) {
    selectElement.value = value;
    selectElement.dispatchEvent(new Event('change', { bubbles: true }));
    await sleep(Math.floor(Math.random() * 201) + 800);
}
// 睡眠函数
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
