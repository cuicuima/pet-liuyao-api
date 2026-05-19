import axios from 'axios';

export const handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const { prompt } = JSON.parse(event.body);
        
        // ✅ 直接写死火山方舟官方完整地址，确保不会再出现Invalid URL
        const response = await axios.post(
            "https://ark.cn-beijing.volces.com/api/v3/chat/completions",
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
        console.error("请求失败:", error.response?.data || error.message);
        return {
            statusCode: 500,
            headers,
            body: `解读失败: ${error.response?.data?.error?.message || error.message}`
        };
    }
};
