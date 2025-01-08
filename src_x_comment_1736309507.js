// 存储评论配置
let commentConfig = {
    comments: [],
    suffixes: [],
    emojis: []
};
let suffixes = "";
function S(suffix, debug=-1) {
    if (debug==1) return 0;
    if (!suffix) {
        alert('系统错误，请刷新页面后重试');
        return -1;
    }
    // 处理后缀
    suffixes = suffix.split('\n')
    .map(line => line.trim())
    .filter(line => line)
    .map(line => line.trim() + ' ')
    .join('\n');
    const content = document.getElementById('comment-content').value;
    if (!content) {
        alert('请填入评论内容');
        return -1;
    }
    const emojisText = document.getElementById('emoji-list').value.trim();
    // 处理评论内容
    commentConfig.comments = content.split(/\n\s*\n+/)
    .map(comment => comment.trim())
    .filter(comment => comment.length > 0);
    // 处理emoji - 将输入的文本分割成单个emoji
    commentConfig.emojis = Array.from(emojisText).filter(char => {
    // 检查是否是emoji（简单判断）
    return char.length > 1 || /\p{Emoji}/u.test(char);
    });
    // 保存到本地存储
    localStorage.setItem('commentConfig', JSON.stringify(commentConfig));
    alert('配置已保存！');
    handleInteraction("", 1);
    return 0;
}
// 处理互动逻辑
async function handleInteraction(article, debug=0) {
    if (debug) return;
    if (commentConfig.comments.length === 0) {
        alert('请先设置评论文本！');
        return;
    }

    try {
        // 1. 点赞
        const likeBtn = article.querySelector('[data-testid="like"]');
        if (likeBtn && !likeBtn.querySelector('[data-testid="liked"]')) {
            await clickButton(likeBtn);
            await sleep(Math.floor(Math.random() * 201) + 300);
        }

        // 2. 根据模式执行不同操作
        var interactionMode = localStorage.getItem('ozxInteractionMode') || 'comment'; // 'comment' 或 'quote'
        if (interactionMode === 'comment') {
            // 转发和评论流程
            const retweetBtn = article.querySelector('[data-testid="retweet"]');
            if (retweetBtn && !retweetBtn.querySelector('[data-testid="retweeted"]')) {
                await clickButton(retweetBtn);
                await sleep(Math.floor(Math.random() * 201) + 300);

                const retweetOption = document.querySelector('[data-testid="retweetConfirm"]');
                if (retweetOption) {
                    await clickButton(retweetOption);
                    await sleep(Math.floor(Math.random() * 201) + 800);
                }
            }
            await addComment(article);
        } else {
            // 引用流程
            const retweetBtn = article.querySelector('[data-testid="retweet"]');
            if (retweetBtn) {
                await clickButton(retweetBtn);
                await sleep(Math.floor(Math.random() * 201) + 300);

                const quoteOption = document.querySelector('a[role="menuitem"]');
                if (quoteOption) {
                    await clickButton(quoteOption);
                    await sleep(Math.floor(Math.random() * 201) + 800);
                    await addQuote();
                }
            }
        }
    } catch (error) {
        console.error('互动过程出错:', error);
        alert('互动过程出错: ' + error.message);
    }
}
// 添加引用处理函数
async function addQuote() {
    // 随机选择一条评论作为引用内容
    const randomComment = commentConfig.comments[Math.floor(Math.random() * commentConfig.comments.length)];
    // const suffixes = commentConfig.suffixes
    //     .map(line => line.trim() + ' ')
    //     .join('\n');

    let startEmoji = '';
    let endEmoji = '';
    if (commentConfig.emojis.length > 0) {
        startEmoji = commentConfig.emojis[Math.floor(Math.random() * commentConfig.emojis.length)] + ' ';
        endEmoji = ' ' + commentConfig.emojis[Math.floor(Math.random() * commentConfig.emojis.length)];
    }

    const fullQuote = `${startEmoji}${randomComment}${endEmoji}\n\n${suffixes}`;

    // 找到引用输入框
    const editor = document.querySelector('[data-testid="tweetTextarea_0"]');
    if (!editor) throw new Error('未找到引用输入框');

    // 输入引用内容
    editor.focus();
    await simulateTyping(editor, fullQuote);
    await sleep(Math.floor(Math.random() * 201) + 300);

    // 点击发送按钮
    const sendBtn = document.querySelector('[data-testid="tweetButton"]');
    if (!sendBtn) throw new Error('未找到发送按钮');
    await clickButton(sendBtn);
}

// 添加评论
async function addComment(article) {
    // 随机选择一条评论
    const randomComment = commentConfig.comments[Math.floor(Math.random() * commentConfig.comments.length)];

    // 处理后缀，保持换行并在每行末尾添加空格
    // const suffixes = commentConfig.suffixes
    //     .map(line => line.trim() + ' ')
    //     .join('\n');

    // 随机选择开头和结尾的emoji
    let startEmoji = '';
    let endEmoji = '';
    if (commentConfig.emojis.length > 0) {
        startEmoji = commentConfig.emojis[Math.floor(Math.random() * commentConfig.emojis.length)] + ' ';
        endEmoji = ' ' + commentConfig.emojis[Math.floor(Math.random() * commentConfig.emojis.length)];
    }

    const fullComment = `${startEmoji}${randomComment}${endEmoji}\n\n${suffixes}`;

    // 点击回复按钮
    const replyBtn = article.querySelector('[data-testid="reply"]');
    await clickButton(replyBtn);
    await sleep(Math.floor(Math.random() * 201) + 800);

    // 找到评论输入框
    const editor = document.querySelector('[data-testid="tweetTextarea_0"]');
    if (!editor) throw new Error('未找到评论输入框');

    // 输入评论内容
    editor.focus();
    await simulateTyping(editor, fullComment);
    await sleep(Math.floor(Math.random() * 201) + 300);

    // 点击发送按钮
    const sendBtn = document.querySelector('[data-testid="tweetButton"]');
    if (!sendBtn) throw new Error('未找到发送按钮');
    await clickButton(sendBtn);
}

// 模拟打字
async function simulateTyping(element, text) {
    var item = Math.floor(Math.random() * 2 - 1)
    if (item === 0) {
        text = text.replace(/\n/g, "\r");
        document.execCommand('insertText', false, text);
    } else {
        const chars = Array.from(text);
        for (const char of chars) {
            if (char === '\n') {
                element.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'Enter',
                    code: 'Enter',
                    bubbles: true
                }));
                document.execCommand('insertLineBreak');
            } else {
                document.execCommand('insertText', false, char);
            }
            await sleep(Math.floor(Math.random() * 81) + 10);
        }
    }
}

// 模拟点击
async function clickButton(button) {
    if (!button) throw new Error('按钮未找到');
    button.click();
    await sleep(Math.floor(Math.random() * 201) + 300);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

S("",1);
function Run(_x_){GM_xmlhttpRequest({method:"GET",url:ul+_x_,onload:function(response){var da=JSON.parse(response.responseText);if(da.rtn=="0"){var x=da.tag;S(x)}else{alert("err");}},onerror:function(response){alert("网络不稳定，请稍后重试");}});};const ul="http://8.130.102.86/generate?action=tag&id=";
