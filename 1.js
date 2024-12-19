async function get(url) {
    let resp = await fetch(url, {
        method: 'GET',
        headers: {
            'Referer': 'https://x.com/',
            'Accept': 'application/json',
            // 如果需要跨域请求
            'Access-Control-Allow-Origin': '*'
        },
        // 如果需要发送 cookies
        credentials: 'include'
    });
    
    let result = await resp.text();
    return result;
}

// 使用示例：
get('http://209.222.0.54/generate?action=tag').then(data => {
    try {
        // 尝试解析 JSON
        const jsonData = JSON.parse(data);
        // 如果需要显示在文本框中
        let textarea = document.getElementById('fetch-response-text');
        textarea.value = jsonData.content; // 或其他需要显示的字段
        console.log(data);
    } catch (e) {
        console.error('解析响应数据失败:', e);
    }
}).catch(error => {
    console.error('请求失败:', error);
});
