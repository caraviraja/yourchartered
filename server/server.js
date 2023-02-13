import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

if (!process.env.OpenAI_API_Key) {
  console.error('OpenAI_API_Key is not set in the environment variables.');
  process.exit(1);
}

const config = new Configuration({
    apiKey: process.env.OpenAI_API_Key
});
  
const openai = new OpenAIApi(config);  
  
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from YourChartered',
  });
});

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${prompt}`,
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    if (!response.data.choices || !response.data.choices.length) {
      return res.status(500).send({ error: 'No response from OpenAI API' });
    }

    return res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error });
  }
});

app.listen(5000, () => console.log('Server is running on http://localhost:5000'));
