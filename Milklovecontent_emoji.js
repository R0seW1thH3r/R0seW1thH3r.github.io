// ==UserScript==
// @name         重生之我为奶爱定时
// @namespace    https://github.com/ozxslackin/handiFix
// @version      0.1.3
// @description  批量创建定时推文，支持自定义间隔和时间
// @author       ozxslackin
// @match        https://x.com/*
// @updateURL    https://github.com/ozxslackin/handiFix/raw/main/main.js
// @downloadURL  https://github.com/ozxslackin/handiFix/raw/main/main.js
// @grant        none
// ==/UserScript==
(function() {
    'use strict';

    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        .scheduler-btn {
            position: fixed;
            right: 20px;
            top: 20px;
            z-index: 9999;
            padding: 8px 16px;
            background: #e74c3c; /* Red color */
            color: white;
            border: none;
            border-radius: 9999px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
        }

        .scheduler-form {
            position: fixed;
            right: 20px;
            top: 70px;
            background: #ffffff;
            padding: 16px;
            border-radius: 16px;
            box-shadow: rgb(101 119 134 / 20%) 0px 0px 15px, rgb(101 119 134 / 15%) 0px 0px 3px 1px;
            z-index: 9999;
            width: 300px;
            display: none;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        .scheduler-form input, .scheduler-form select, .scheduler-form textarea {
            width: 100%;
            margin-bottom: 12px;
            padding: 8px;
            border: 1px solid rgb(207, 217, 222);
            border-radius: 4px;
            font-size: 14px;
            box-sizing: border-box;
        }

        .scheduler-form label {
            display: block;
            margin-bottom: 6px;
            color: rgb(83, 100, 113);
            font-size: 13px;
            font-weight: 500;
        }

        .scheduler-form button {
            background: #e74c3c; /* Red color */
            color: white;
            border: none;
            border-radius: 9999px;
            padding: 8px 16px;
            font-weight: bold;
            cursor: pointer;
            font-size: 14px;
            margin-top: 8px;
        }

        .scheduler-form button:hover {
            background: #c0392b; /* Darker red on hover */
        }

        .scheduler-form #content {
            min-height: 120px;
            font-family: inherit;
            line-height: 1.5;
        }

        .scheduler-form #suffix {
            min-height: 80px;
            font-family: inherit;
            line-height: 1.5;
        }
    `;
    document.head.appendChild(style);

    // 创建按钮
    const btn = document.createElement('button');
    btn.className = 'scheduler-btn';
    btn.textContent = '定时发文';
    document.body.appendChild(btn);

    // 创建表单
    const form = document.createElement('div');
    form.className = 'scheduler-form';
    form.innerHTML = `
        <label>起始时间（注意你在推特的时区）</label>
        <input type="datetime-local" id="scheduler-startTime">

        <label>最小发布间隔（分钟）</label>
        <input type="number" id="scheduler-minInterval" value="5" min="1">

        <label>最大发布间隔（分钟）</label>
        <input type="number" id="scheduler-maxInterval" value="10" min="1">

        <label>推文内容（每行一条推文）</label>
        <textarea id="scheduler-content" placeholder="输入推文内容，每行代表一条推文（1条变10条）"></textarea>

        <label>推文后缀（每行一个话题or关键词）</label>
        <textarea id="scheduler-suffix" placeholder="#话题1
#话题2
#话题3"></textarea>

        <label>随机Emoji（可不改，直接输入多个emoji，留空不添加）</label>
        <textarea id="emoji-list" class="ozx-emoji-input">😊🥰😍🤗🥳😎🌟✨💫⭐️🌈🎉🎊💝💖💗💓💞💕❤️💜🧡💚💛💙🤍❤️‍🩹🎯🎪🎨🎭🎪🎡🎢🌅🌄☀️🌤️⛅️🌥️🌊🏖️🌿☘️🍀🌸🌺🌼🌻💐🌹🥀🦋🕊️🐣🐥🦄🦁🐯🦊🐨🐼🐷🐝🍎🍓🍒🍑🍊🍋🍍🥝🍇🥭🧁🍰🎂🍮🍪🍨🍧🍦🥤🧃🎈🎆🎇🏆🎖️🏅🥇👑💎💫🌠⚡️💪👊✌️🤝🙌👐🤲🫂🎵🎶🎹🎸🪕🎺📚💡💭💫🌈🎨🎯</textarea>
        <div class="ozx-note">每条推文开头和结尾都会随机选择一个emoji（如果有的话）</div>


        <button id="scheduler-generateBtn">生成定时推文</button>
    `;
    document.body.appendChild(form);

    // 设置默认时间（本周六下午8点）
    function getNextSaturday() {
        const now = new Date();
        const nextSaturday = new Date(now);
        nextSaturday.setDate(now.getDate() + (6 - now.getDay() + 7) % 7);
        nextSaturday.setHours(20, 0, 0, 0);
        return nextSaturday;
    }

    // 显示/隐藏表单并设置默认时间
    btn.addEventListener('click', () => {
        const isVisible = form.style.display === 'block';
        form.style.display = isVisible ? 'none' : 'block';
        if (!isVisible) {
            const defaultTime = getNextSaturday().toISOString().slice(0, 16);
            document.getElementById('scheduler-startTime').value = defaultTime;
        }
    });

    // 修改事件处理部分，使用新的ID
    const generateBtn = form.querySelector('#scheduler-generateBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            try {
                const startTimeInput = document.getElementById('scheduler-startTime').value;
                const startTime = new Date(startTimeInput);
                const minInterval = parseInt(document.getElementById('scheduler-minInterval').value);
                const maxInterval = parseInt(document.getElementById('scheduler-maxInterval').value);

                // 处理后缀
                const suffix = document.getElementById('scheduler-suffix').value;
                const suffixLines = suffix.split('\n')
                    .map(line => line.trim())
                    .filter(line => line)
                    .map(line => line + ' ')  // 在每行末尾添加空格
                    .join('\n');

                // 处理推文内容
                let content = document.getElementById('scheduler-content').value;
                if (!content || content.trim() === '') {
                    alert('请输入推文内容');
                    return;
                }

                const emojisText = document.getElementById('emoji-list').value.trim();
                const emojis = Array.from(emojisText).filter(char => {
                    // 检查是否是emoji（简单判断）
                    return char.length > 1 || /\p{Emoji}/u.test(char);
                });
                // emoji保存到本地存储
                localStorage.setItem('emojis', JSON.stringify(emojis));

                // 规范化换行符
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
                // console.log(123123, tweetsList);

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
                        }
                        tweetContent = `${startEmoji}${tweetContent}${endEmoji}${j}\n\n${suffixLines}`;

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
        });
    }

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
          }
          return "ok";
        } else {
          return "";
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

            // const tweetButton = document.querySelector('[data-testid="tweetButtonInline"]');
            // if (!tweetButton) throw new Error('未找到发推按钮');
            // tweetButton.click();
            // await sleep(Math.floor(Math.random() * 201) + 800);

            // const editorDiv = document.querySelector('[data-testid="tweetTextarea_0"]');
            // if (!editorDiv) throw new Error('未找到推文输入框');

            // editorDiv.focus();
            // await sleep(Math.floor(Math.random() * 121) + 80);

            // const chars = Array.from(content);

            // for (const char of chars) {
            //     console.log(111111,char);
            //     if (char === '\n') {
            //         const enterEvent = new KeyboardEvent('keydown', {
            //             key: 'Enter',
            //             code: 'Enter',
            //             bubbles: true,
            //             cancelable: true
            //         });
            //         editorDiv.dispatchEvent(enterEvent);
            //         document.execCommand('insertLineBreak');
            //         editorDiv.dispatchEvent(new KeyboardEvent('keyup', {
            //             key: 'Enter',
            //             code: 'Enter',
            //             bubbles: true,
            //             cancelable: true
            //         }));
            //     } else {
            //         const keydownEvent = new KeyboardEvent('keydown', {
            //             key: char,
            //             code: `Key${char.toUpperCase()}`,
            //             bubbles: true,
            //             cancelable: true
            //         });
            //         editorDiv.dispatchEvent(keydownEvent);

            //         const inputEvent = new InputEvent('input', {
            //             bubbles: true,
            //             cancelable: true,
            //             data: char,
            //             inputType: 'insertText'
            //         });
            //         editorDiv.dispatchEvent(inputEvent);

            //         document.execCommand('insertText', false, char);

            //         const keyupEvent = new KeyboardEvent('keyup', {
            //             key: char,
            //             code: `Key${char.toUpperCase()}`,
            //             bubbles: true,
            //             cancelable: true
            //         });
            //         editorDiv.dispatchEvent(keyupEvent);
            //     }
            //     await sleep(Math.floor(Math.random() * 81) + 20);
            // }

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
})();
