// mathUtils.js
const amqp = require('amqplib');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const URL = process.env.mqurl || 'amqp://localhost';
const DISPATHCER_QUEUE = process.env.DISPATHCER_QUEUE || 'dispatcher';
const NOTIFICATIONS_QUEUE = process.env.NOTIFICATIONS_QUEUE || 'notifications';

let connection = null;
let channel = null;

async function setup() {
  try {
    console.log('connecting to RabbitMQ...');
    connection = await amqp.connect(URL);
    channel = await connection.createChannel();
    console.log('RabbitMQ is connected');

    await channel.assertQueue(DISPATHCER_QUEUE);
    await channel.assertQueue(NOTIFICATIONS_QUEUE);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function consumer() {
  try {
    channel.consume(DISPATHCER_QUEUE, (msg) => {
      if (msg !== null) {
        const notification = JSON.parse(msg.content.toString());
        console.log(notification);
        channel.ack(msg);
      }
    });

    console.log('consumer is on');
  } catch (error) {
    console.error('Error:', error);
  }
}

async function producer(todo) {
  try {
    console.log('connecting to RabbitMQ...');
    connection = await amqp.connect(URL);
    channel = await connection.createChannel();
    console.log('RabbitMQ is connected');
    const message = JSON.stringify(todo);
    channel.sendToQueue(NOTIFICATIONS_QUEUE, Buffer.from(message));
    console.log('Message sent:', todo);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function setupMQ() {
  await setup();
}

module.exports = {
  producer,
  setupMQ,
  consumer,
};
