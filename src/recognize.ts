import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv';

dotenv.config();

export async function recognizeACRCloud(filePath: string): Promise<any> {
  const timestamp = Math.floor(Date.now() / 1000);
  const stringToSign = [
    'POST',
    '/v1/identify',
    process.env.ACR_KEY,
    'audio',
    '1',
    timestamp
  ].join('\n');

  const signature = crypto
    .createHmac('sha1', process.env.ACR_SECRET!)
    .update(stringToSign)
    .digest('base64');

  const form = new FormData();
  form.append('sample', fs.createReadStream(filePath));
  form.append('access_key', process.env.ACR_KEY!);
  form.append('data_type', 'audio');
  form.append('signature', signature);
  form.append('sample_bytes', fs.statSync(filePath).size);
  form.append('timestamp', timestamp);
  form.append('signature_version', '1');

  const response = await axios.post(`https://${process.env.ACR_HOST}/v1/identify`, form, {
    headers: form.getHeaders(),
    maxBodyLength: Infinity,
  });

  return response.data;
}
