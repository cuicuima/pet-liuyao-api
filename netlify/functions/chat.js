import axios from 'axios';

export default async function handler(req, context) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    if (req.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const { prompt } = JSON.parse(req.body);
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
        return {
            statusCode: 500,
            headers,
            body: '解读失败'
        };
    }
}
