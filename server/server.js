import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { OpenAI } from 'openai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({ key: process.env.OPENAI_API_KEY });

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello from CodeX!' });
});

app.post('/', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim() === '') {
      return res.status(400).json({ error: 'Invalid or empty prompt' });
    }

    const response = await openai.createCompletion({
      engine: 'text-davinci-003', // Cambiado de 'model' a 'engine'
      prompt: `${prompt}`,
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    const botResponse = response.data.choices[0].text;

    res.status(200).json({ bot: botResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(PORT, () => {
  console.log(`AI server started on http://localhost:${PORT}`);
});
