import { DB } from 'db'
import { Todo } from '../obj/todo'

import * as dotenv from 'dotenv'
dotenv.config({path: '../../.env'})

const DB_NAME = process.env.DB_NAME || 'default'
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017'
const TODOS_COLLECTION = process.env.TODOS_COLLECTION || 'default'
const USERS_COLLECTION = process.env.USERS_COLLECTION || 'default'

let db = new DB(MONGODB_URL, DB_NAME)
let connection = null

export class MongoDB {

    constructor() {
        this.connect()
    }

    async insertOne(todo: Partial<Todo>) {
        try {
            const collection = db.getCollection(TODOS_COLLECTION)
            return await db.insertDocument(collection, todo)
        } catch (error) {
            console.error('Error:', error)
        } 
    }

    async find(query: Partial<Todo>) {
        try {
            const collection = db.getCollection(TODOS_COLLECTION)
            const documents = await db.findDocuments(collection, { name: 'John' })
            console.log('Found documents:', documents)
        } catch (error) {
            console.error('Error:', error)
        } 
    }

    // connet to the db
    private async connect() {
      try {
            console.log('connecting to mongoDB...')
            connection = await db.connectToMongoDB()
            console.log('mongoDB is connected')
        } catch (error) {
            console.error('Error:', error)
        }    
    }

    // close the connection
    async close() {
      try {
            console.log('closing connection...')
            await db.close()
            console.log('connection is closed')
        } catch (error) {
            console.error('Error:', error)
        }    
    }
}