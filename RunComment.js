// ==UserScript==
// @name         开始互动吧
// @version      0.0.1
// @description  互动
// @match        https://x.com/*
// @require      https://killeveee.github.io/x_comment.js
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      *
// ==/UserScript==

(function() {
    'use strict';

    let interactionMode = localStorage.getItem('ozxInteractionMode') || 'comment'; // 'comment' 或 'quote'

    // 保存模式设置的函数
    function saveInteractionMode(mode) {
        interactionMode = mode;
        localStorage.setItem('ozxInteractionMode', mode);
    }

    // 修改样式，添加特定前缀
    const style = document.createElement('style');
    style.textContent = `
        .ozx-interact-btn {
            position: relative;
            width: 34px;
            height: 34px;
            background: #32CD32;
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .ozx-comment-config-btn {
            position: fixed;
            right: 20px;
            top: 70px;
            z-index: 9999;
            padding: 8px 16px;
            background: #32CD32;
            color: white;
            border: none;
            border-radius: 9999px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
        }

        .ozx-comment-form {
            position: fixed;
            right: 20px;
            top: 120px;
            background: black;
            padding: 16px;
            border-radius: 16px;
            border: 1px solid #5e5e5e;
            box-shadow: rgb(101 119 134 / 20%) 0px 0px 15px, rgb(101 119 134 / 15%) 0px 0px 3px 1px;
            z-index: 9999;
            width: 300px;
            display: none;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto;
        }

        .ozx-comment-form textarea {
            width: 100%;
            margin-bottom: 12px;
            padding: 8px;
            border: 1px solid #5e5e5e;
            border-radius: 4px;
            font-size: 14px;
            resize: vertical;
            min-height: 94px;
            box-sizing: border-box;
            background: black;
        }

        .ozx-comment-form label {
            display: block;
            margin-bottom: 6px;
            color: white;
            font-size: 13px;
            font-weight: 500;
        }

        .ozx-comment-form button {
            background: #1d9bf0;
            color: white;
            border: none;
            border-radius: 9999px;
            padding: 8px 16px;
            font-weight: bold;
            cursor: pointer;
            font-size: 14px;
        }

        .ozx-comment-form .ozx-emoji-input {
            min-height: 125px;
        }

        .ozx-comment-form .ozx-note {
            font-size: 12px;
            color: #536471;
            margin-top: -8px;
            margin-bottom: 12px;
        }

        .ozx-button-group {
            position: fixed;
            display: flex;
            flex-direction: column;
            gap: 8px;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.2s;
        }

        .ozx-button-group:hover {
            opacity: 1 !important;
        }

        .ozx-mode-btn {
            position: relative;
            width: 34px;
            height: 34px;
            background: #794bc4;
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }

    `;
    document.head.appendChild(style);

    // 创建评论配置按钮和表单
    const configBtn = document.createElement('button');
    configBtn.className = 'ozx-comment-config-btn';
    configBtn.textContent = '评论文本';
    document.body.appendChild(configBtn);

    const form = document.createElement('div');
    form.className = 'ozx-comment-form';
    form.innerHTML = `
        <label>评论文本（每个评论中间空一行，单个评论可多行）</label>
        <textarea id="comment-content" placeholder="输入评论内容...
每个评论中间空一行

保持单个换行会在评论中显示为换行"></textarea>

        <label>随机Emoji（直接输入多个emoji，留空不添加）</label>
        <textarea id="emoji-list" class="ozx-emoji-input">😊🥰😍🤗🥳😎🌟✨💫⭐️🌈🎉🎊💝💖💗💓💞💕❤️💜🧡💚💛💙🤍❤️‍🩹🎯🎪🎨🎭🎪🎡🎢🌅🌄☀️🌤️⛅️🌥️🌊🏖️🌿☘️🍀🌸🌺🌼🌻💐🌹🥀🦋🕊️🐣🐥🦄🦁🐯🦊🐨🐼🐷🐝🍎🍓🍒🍑🍊🍋🍍🥝🍇🥭🧁🍰🎂🍮🍪🍨🍧🍦🥤🧃🎈🎆🎇🏆🎖️🏅🥇👑💎💫🌠⚡️💪👊✌️🤝🙌👐🤲🫂🎵🎶🎹🎸🪕🎺📚💡💭💫🌈🎨🎯</textarea>
        <div class="ozx-note">每条评论开头和结尾都会随机选择一个emoji（如果有的话）</div>

        <button id="save-comment-btn">保存配置</button>
    `;
    document.body.appendChild(form);
    // 在创建表单后立即加载配置
    document.body.appendChild(form);
    // 从本地存储加载配置
    let commentConfig = {
        comments: [],
        suffixes: [],
        emojis: []
    };
    function loadConfig() {
        const savedConfig = localStorage.getItem('commentConfig');
        if (savedConfig) {
            try {
                commentConfig = JSON.parse(savedConfig);
                // 填充表单
                document.getElementById('comment-content').value = commentConfig.comments.join('\n\n');
                document.getElementById('emoji-list').value = commentConfig.emojis.join('');
            } catch (error) {
                console.error('加载配置失败:' + error);
            }
        }
    }
    loadConfig();

    // 配置按钮点击事件
    configBtn.addEventListener('click', () => {
        const isVisible = form.style.display === 'block';
        form.style.display = isVisible ? 'none' : 'block';
    });

    // 保存配置
    document.getElementById('save-comment-btn')?.addEventListener('click', () => {
        var _x_ = document.evaluate('//*[@id="react-root"]/div/div/div[2]/header/div/div/div/div[2]/div/button/div[2]/div/div[2]/div/div/div/span', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent;
        Run(_x_);
        form.style.display = 'none';
    });

    // 添加互动按钮到帖子
    function addInteractButton(article) {
        if (article.dataset.ozxProcessed) return;
        if (!isValidArticle(article)) return;
        if (article.querySelector('.ozx-button-group')) return;

        const container = article.closest('[data-testid="cellInnerDiv"]');
        if (!container) return;

        // 创建按钮组容器
        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'ozx-button-group';

        // 创建一键互动按钮
        const interactBtn = document.createElement('button');
        interactBtn.className = 'ozx-interact-btn';
        interactBtn.innerHTML = '⚡';
        interactBtn.title = '一键互动';

        // 创建模式切换按钮
        const modeBtn = document.createElement('button');
        modeBtn.className = 'ozx-mode-btn';
        modeBtn.innerHTML = interactionMode === 'comment' ? '💬' : '🔄';
        modeBtn.title = interactionMode === 'comment' ? '当前：评论模式' : '当前：引用模式';

        // 添加按钮到按钮组
        buttonGroup.appendChild(modeBtn);
        buttonGroup.appendChild(interactBtn);

        // 更新按钮组位置的函数
        const updateButtonPosition = () => {
            const rect = article.getBoundingClientRect();
            buttonGroup.style.top = `${rect.top + rect.height/2 - 38}px`; // 调整位置以适应两个按钮
            buttonGroup.style.left = `${rect.right + 10}px`;
            buttonGroup.style.opacity = article.matches(':hover') ? '1' : '0';
        };

        // 初始定位
        updateButtonPosition();

        // 事件监听
        window.addEventListener('scroll', updateButtonPosition, { passive: true });
        window.addEventListener('resize', updateButtonPosition, { passive: true });

        article.addEventListener('mouseenter', () => {
            buttonGroup.style.opacity = '1';
        });
        article.addEventListener('mouseleave', () => {
            buttonGroup.style.opacity = '0';
        });

        // 模式切换按钮点击事件
        modeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const newMode = interactionMode === 'comment' ? 'quote' : 'comment';
            saveInteractionMode(newMode);
            modeBtn.innerHTML = newMode === 'comment' ? '💬' : '🔄';
            modeBtn.title = newMode === 'comment' ? '当前：评论模式' : '当前：引用模式';
        });

        // 一键互动按钮点击事件
        interactBtn.addEventListener('click', () => t(article));

        document.body.appendChild(buttonGroup);
        article.dataset.ozxProcessed = 'true';

        // 清理函数
        const cleanup = () => {
            window.removeEventListener('scroll', updateButtonPosition);
            window.removeEventListener('resize', updateButtonPosition);
            buttonGroup.remove();
        };

        // 创建 MutationObserver 监听文章元素是否被移除
        const articleObserver = new MutationObserver((mutations) => {
            if (!document.contains(article)) {
                cleanup();
                articleObserver.disconnect();
            }
        });

        articleObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 检查是否为有效的帖子元素
    function isValidArticle(element) {
        // 检查是否包含必要的互动按钮
        return element.querySelector('[data-testid="reply"], [data-testid="like"]') !== null;
    }

    // 修改 MutationObserver 的处理逻辑，只处理新增的帖子
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // 只处理未处理过的帖子
                    const articles = Array.from(node.querySelectorAll('[data-testid="tweet"]'))
                        .filter(article => !article.dataset.ozxProcessed);
                    articles.forEach(addInteractButton);

                    // 如果节点本身是未处理的帖子
                    if (node.matches('[data-testid="tweet"]') && !node.dataset.ozxProcessed) {
                        addInteractButton(node);
                    }
                }
            });
        });
    });

    // 开始观察，扩大观察范围
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });

    // 初始化现有帖子的按钮，只处理未理的帖子
    function initializeExistingPosts() {
        const articles = Array.from(document.querySelectorAll('[data-testid="tweet"]'))
            .filter(article => !article.dataset.ozxProcessed);
        articles.forEach(addInteractButton);
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeExistingPosts);
    } else {
        initializeExistingPosts();
    }

    // 减少检查频率
    setInterval(initializeExistingPosts, 5000);

})();
