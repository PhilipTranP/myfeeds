/**
 * This script connects to the MongoDB database with the given environment variables
 * and returns the database instance.
 */
require('dotenv').config()
const { MongoClient } = require('mongodb')

const { DB_HOST, DB_PORT, DB_NAME } = process.env

if (!DB_HOST || !DB_PORT || !DB_NAME) {
  console.error('Missing database connection information.')
  process.exit(1)
}

const DB_URL = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`

module.exports = () => MongoClient.connect(DB_URL)
