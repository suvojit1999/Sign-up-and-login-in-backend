import 'dotenv/config'
import mongoose from 'mongoose'

import userdata from '../model/userSchema.js'
const user = process.env.user
const password = process.env.password
const URI= `mongodb+srv://${user}:${password}@cluster1.gfixpdd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`

mongoose.connect(URI).then(()=>{
    console.log("connection successful")
}).catch((err)=>{
    console.log("error:", err)
})