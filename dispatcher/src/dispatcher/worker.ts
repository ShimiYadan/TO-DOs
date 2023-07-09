import { connect, Channel, Connection } from 'amqplib'
import { Worker } from 'worker_threads'

const workerScriptName = 'notificationWorker.js'

async function processNotification(notification: any, msg: any, channel: Channel) {
  console.log('Processing notification...\n', notification)

  const workerScriptPath = __dirname + '/' + workerScriptName

  // Create a worker thread to process the notification
  const worker = new Worker(workerScriptPath, {
    workerData: notification,
    transferList: [msg.content.buffer], // Transfer ownership of the message buffer
  })

  // Handle completion of the worker thread
  worker.once('message', async (result) => {
    if (result === 'success') {
      console.log(`Notification processed successfully: ${notification}`)
    } else {
      console.log(`Notification processing failed: ${notification}`)
    }

    // Acknowledge the message to remove it from the queue
    channel.ack(msg)
  })

  // Handle errors in the worker thread
  worker.once('error', (err) => {
    console.error('Error in notification worker:', err)
    channel.reject(msg, false)
  })
}

async function startWorker() {
  console.log('Date now: ', new Date())
  const connection: Connection = await connect('amqp://localhost')
  const channel: Channel = await connection.createChannel()
  const queue = 'dispatcher'

  await channel.assertQueue(queue, { durable: true }) // a msg backup (write to disk)
  await channel.prefetch(1)

  console.log('Notification Worker Node started. Waiting for notifications...')

  channel.consume(queue, async (msg: any) => {
    if (msg !== null) {
      const notification = JSON.parse(msg.content.toString())

      console.log(`proccess ${notification}`)
      await processNotification(notification, msg, channel)
    
    }
  })
}

export function startAWorker() {
  startWorker().catch((err) => {
    console.error('Error starting Notification Worker Node:', err)
  })
}