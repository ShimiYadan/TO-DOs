import * as amqp from 'amqplib';
import * as dotenv from 'dotenv'
import { sendNotifications } from '../notification/send'

dotenv.config({path: './.env'});

const URL = process.env.mqurl || 'amqp://localhost'
const NOTIFICATIONS_QUEUE = process.env.NOTIFICATIONS_QUEUE || 'notifications'

var connection: any | null
var channel: any | null

export async function setup() {
  try {
    
    // Connect to RabbitMQ server
    console.log('connecting to rabbitMQ...')

    connection = await amqp.connect(URL);
    channel = await connection.createChannel();

    console.log('RabbitMQ is connected')
    
    await channel.assertQueue(NOTIFICATIONS_QUEUE);

  } catch (error) {
    console.error('Error:', error);
  }
}


export async function consumer() {

  try {
    channel.consume(NOTIFICATIONS_QUEUE, (msg: any) => {
      if (msg !== null) {
        const notification = JSON.parse(msg.content.toString());
        console.log(notification)
        sendNotifications(notification)
        channel.ack(msg)
      }
    })
    console.log('consumer is on')

  }catch (error) {
    console.error('Error:', error)
  }
}

export async function producer(todo: any) {
  try {

    const message = JSON.stringify(todo);

    channel.sendToQueue(NOTIFICATIONS_QUEUE, Buffer.from(message))
    console.log('Message sent:', todo);

  } catch (error) {
    console.error('Error:', error);
  }
}

export async function setupMQ() {
  await setup()
  consumer()
}