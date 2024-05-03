import express from 'express'
import mongoose from 'mongoose'
import 'dotenv/config'


const app = express()
const port = 3000

app.use(express.json())
import auth from './modules/auth.js'


app.use('/', auth)

import('./DB/conn.js') 


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})