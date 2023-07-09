import * as express from 'express'
import * as dotenv from 'dotenv'
import { Todo } from '../obj/todo'
import { connectToMongoDB } from '../db/mongodb'
import { insertOne, deleteOne, edit } from '../db/mongodb'
import { setupMQ, producer } from '../mq/rabbitmq'

dotenv.config({path: './.env'})
const app: express.Express = express()
app.use(express.json())

const PORT = process.env.PORT || 3000
const NAME = process.env.NAME || 'api'

// running, setup a queue and a db
setupMQ()
connectToMongoDB()

// Create a new todo
app.post('/todo', (req: express.Request, res: express.Response) => {
  const { userId, title, deadline, completed }: Partial<Todo> = req.body
  const newTodo: Partial<Todo> = { userId, title, deadline , completed }
  insertOne(newTodo)
  producer(newTodo)
  res.status(201).json({ todo: newTodo })
})

// Update an existing todo
app.put('/todo', (req: express.Request, res: express.Response) => {
  const todo = req.body
  console.log(todo)
  edit(todo)
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
  deleteOne(id)
  res.status(204).json({message: `Todo: ${id} deleted successfully`})
  if(!id) res.status(404).json({ message: 'Todo not found' })
})

app.listen(PORT, () => {
    console.log(`${NAME} listening on port ${PORT}`)
})
