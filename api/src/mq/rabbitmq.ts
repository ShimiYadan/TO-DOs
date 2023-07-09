import * as amqp from 'amqplib';
import * as dotenv from 'dotenv'
import { Todo } from '../obj/todo'

dotenv.config({path: './.env'});

const URL = process.env.mqurl || 'amqp://localhost'
const QUEUE_NAME = process.env.QUEUE_NAME || 'dispatcher'

var connection: any = null;
var channel: any = null;

export async function setupMQ() {
  try {

    // Connect to RabbitMQ server
    console.log('connecting to rabbitMQ...')
    connection = await amqp.connect(URL);
    channel = await connection.createChannel();
    console.log('rabbitMQ is connected')

    // Declare a queue
    await channel.assertQueue(QUEUE_NAME);

  } catch (error) {
    console.error('Error:', error);
  }
}

export async function consumer() {
      // Consumer
      channel.consume(QUEUE_NAME, (msg: any) => {
        console.log('Received message:', msg.content.toString());
        channel.ack(msg);
      });
}

export async function producer(todo: Partial<Todo>) {
  try {

    const message = JSON.stringify(todo);

    channel.sendToQueue(QUEUE_NAME, Buffer.from(message));
    console.log('Message sent to queue:', todo);

  } catch (error) {
    console.error('Error:', error);
  }
}
