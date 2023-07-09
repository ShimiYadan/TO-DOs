import * as express from 'express'
import * as dotenv from 'dotenv'
import { connectToMongoDB } from '../db/mongodb'
import { setupMQ } from '../mq/rabbitmq'

dotenv.config({path: './.env'})
const app: express.Express = express()

const PORT = process.env.PORT || 3001
const NAME = process.env.NAME || 'notifications'

connectToMongoDB().catch(console.error)
setupMQ().catch(console.error)

app.listen(PORT, () => {
    console.log(`${NAME} listening on port ${PORT}`)
})
