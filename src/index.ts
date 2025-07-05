import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import { recognizeACRCloud } from './recognize';

dotenv.config();

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());

app.post('/recognize', upload.single('audio'), async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await recognizeACRCloud(req.file.path);
    res.json(result);
  } catch (error) {
    console.error('Recognition failed:', error);
    res.status(500).json({ error: 'Recognition failed' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🎧 Recognizer backend running on port ${PORT}`);
});
