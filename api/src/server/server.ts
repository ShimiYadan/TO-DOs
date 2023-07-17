import * as express from 'express'
import { Todo } from '../obj/todo'
import { setupMQ, producer } from '../mq/rabbitmq'
import { MongoDB } from '../db/mongodb'

const app: express.Express = express()
app.use(express.json())

import * as dotenv from 'dotenv'
dotenv.config({path: './.env'})

const PORT = process.env.PORT || 3000
const NAME = process.env.NAME || 'api'

const mongoDB = new MongoDB

// Create a new todo
app.post('/todo', async (req: express.Request, res: express.Response) => {
  const { userId, title, deadline, completed }: Partial<Todo> = req.body
  const newTodo: Partial<Todo> = { userId, title, deadline , completed }
  const insertInfo = await mongoDB.insertOne(newTodo)
  producer(newTodo)
  res.status(201).json({_id: insertInfo})
})

// Update an existing todo
app.put('/todo', (req: express.Request, res: express.Response) => {
  const todo = req.body
  console.log(todo)
  // edit(todo) TODO
  if (todo) {
    res.status(200).json({ message: 'Todo updated successfully' });
  } else {
    res.status(404).json({ message: 'Todo not found' })
  }
})

// Delete a todo
app.delete('/todo', (req: express.Request, res: express.Response) => {
  const id: string = req.body._id
  console.log(`delete id: ${id}`)
  // deleteOne(id) TODO
  res.status(204).json({message: `Todo: ${id} deleted successfully`})
  if(!id) res.status(404).json({ message: 'Todo not found' })
})

app.listen(PORT, () => {
    console.log(`${NAME} listening on port ${PORT}`)
})

// Graceful shutdown
function closeConnection() {
  if (mongoDB) {
    mongoDB.close()
      .then(() => {
        console.log('MongoDB connection closed');
        process.exit(0); // Exit the process
      })
      .catch(err => {
        console.error('Error closing MongoDB connection', err);
        process.exit(1); // Exit the process with error
      });
  }
}

process.on('SIGINT', closeConnection); // Handle CTRL+C
process.on('SIGTERM', closeConnection); // Handle termination signals