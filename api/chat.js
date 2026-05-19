import axios from 'axios';

export default async function handler(req, res) {
  // 解决跨域
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { prompt } = req.body;
    const response = await axios.post(
      process.env.API_URL, // 从环境变量读取，安全
      {
        model: process.env.MODEL, // 从环境变量读取
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`, // 从环境变量读取，不暴露
          'Content-Type': 'application/json'
        }
      }
    );
    res.status(200).send(response.data.choices[0].message.content);
  } catch (error) {
    console.error('AI请求失败:', error);
    res.status(500).send('解读失败，API配置或额度异常');
  }
}
