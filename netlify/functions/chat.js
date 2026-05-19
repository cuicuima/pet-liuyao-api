import axios from 'axios';

// ✅ 标准 Netlify 函数格式，参数名必须是 event, context
export const handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    // 处理跨域预检请求
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        // 解析请求体
        const { prompt } = JSON.parse(event.body);
        const response = await axios.post(
            process.env.API_URL,
            {
                model: process.env.MODEL,
                messages: [{ role: 'user', content: prompt }]
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return {
            statusCode: 200,
            headers,
            body: response.data.choices[0].message.content
        };
    } catch (error) {
        console.error('AI请求失败:', error);
        return {
            statusCode: 500,
            headers,
            body: '解读失败，API配置或额度异常'
        };
    }
};
