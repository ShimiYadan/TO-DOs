// import { MongoClient, MongoClientOptions } from 'mongodb';
// const options: MongoClientOptions = {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   };

import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv'
import { Todo } from '../obj/todo'


dotenv.config({path: './.env'});

const URI = process.env.URI || 'mongodb://localhost:27017'
var TODOS_COLLECTION = process.env.TODOS_COLLECTION || 'todos'
var USERS_COLLECTION = process.env.USERS_COLLECTION || 'users'
var DB = process.env.DB || 'todos'

var client: any
var db: any
var todosCollection: any
var usersCollection: any


function createUsersCollection() {

  const userSchema = {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email"],
      properties: {
        name: {
          bsonType: "string",
          description: "Name field is required and must be a string"
        },
        email: {
          bsonType: "string",
          description: "Email field is required and must be a string"
        }
      }
    }
  }
  
  const usersCollection = db.collection(USERS_COLLECTION)
  
  if (!usersCollection) {
    // Create the collection with the schema object
    return db.createCollection(USERS_COLLECTION, { validator: userSchema })
  } else {
    return usersCollection
  }

}


function createTodosCollection() {

  const todosSchema = {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "deadline"],
      properties: {
        title: {
          bsonType: "string",
          description: "title field is required and must be a string"
        },
        deadline: {
          bsonType: "string",
          description: "deadline field is required and must be a string"
        }
      }
    }
  }

  const todosCollection = db.collection(TODOS_COLLECTION)

  if (!todosCollection) {
    // Create the collection with the schema object
    return db.createCollection(TODOS_COLLECTION, { validator: todosSchema })
  } else {
    return todosCollection
  }

}


export const connectToMongoDB = async (): Promise<MongoClient> => {

  console.log('Connecting to MongoDB...')

  client = new MongoClient(URI)
  await client.connect()
  db = await client.db(DB)
  todosCollection = createTodosCollection()
  usersCollection = createUsersCollection()
  usersCollection.find() // assume there is a single user
  console.log('MongoDB is connected')

  return client

}


export async function insertOne(todo: Partial<Todo>) {

  try {
    
    todosCollection.insertOne(todo)
    
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
  }
}


export async function findAll(deadlineThreshold: Date) {
  
  try {
  
    // TODO: add typescript
    const todos = await todosCollection.find({ deadline: { $lte: deadlineThreshold } }).toArray();

    return todos

  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
  }

}