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
        // 打印环境变量，确认是否读取成功
        console.log("API_URL:", process.env.API_URL);
        console.log("MODEL:", process.env.MODEL);
        console.log("API_KEY 长度:", process.env.API_KEY?.length);

        const { prompt } = JSON.parse(event.body);
        console.log("收到的prompt:", prompt);

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
        console.log("AI返回成功:", response.data);
        return {
            statusCode: 200,
            headers,
            body: response.data.choices[0].message.content
        };
    } catch (error) {
        // 打印完整错误信息
        console.error("请求失败:", error.response?.data || error.message);
        return {
            statusCode: 500,
            headers,
            body: `解读失败: ${error.response?.data?.error?.message || error.message}`
        };
    }
};
