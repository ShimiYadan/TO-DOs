import axios, { AxiosResponse } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const endpoint = process.env.API_ENDPOINT || 'http://localhost:3000';
const numRequests = parseInt(process.env.NUM_REQUESTS || '1000', 10);

async function sendRequests() {
  const requests: Promise<AxiosResponse<any>>[] = [];

  for (let i = 0; i < numRequests; i++) {
    requests.push(axios.get(`${endpoint}/todos`));
  }

  try {
    const responses = await Promise.all(requests);
    console.log(`Successfully sent ${responses.length} requests.`);
  } catch (error) {
    console.error('Error sending requests:', error);
  }
}

sendRequests();
