import * as express from 'express'
import * as dotenv from 'dotenv'
import { connectToMongoDB } from '../db/mongodb'
import { setupMQ } from '../mq/rabbitmq'
import { startAWorker } from '../dispatcher/worker'
import { Callback } from 'mongodb'

dotenv.config({path: './.env'})
const app: express.Express = express()

const PORT = process.env.PORT || 3001
const NAME = process.env.NAME || 'dispatcher'

connectToMongoDB().catch(console.error)
setupMQ().catch(console.error)
startAWorker()


function printDateEachTimePeriod() {
    
    function printCurrentDate() {
        const currentDate = new Date();
        console.log('Current date:', currentDate);
      }
      
      function wait(timeout: number) {
        return new Promise(resolve => {
          setTimeout(resolve, timeout);
        });
      }
      
      function intervalPromise(callback: Callback, interval: number) {
        return new Promise((resolve, reject) => {
          function run() {
            callback();
            wait(interval)
              .then(run)
              .catch(reject);
          }
      
          run();
        });
      }
      
      // Usage: Print current date every 10 seconds
      intervalPromise(printCurrentDate, 10000)
        .catch(error => {
          console.error('An error occurred:', error);
        });
}
app.listen(PORT, () => {
    printDateEachTimePeriod()
    console.log(`${NAME} listening on port ${PORT}`)
})
