import express from 'express'
const router = express.Router()
import mongoose from 'mongoose'

import bcrypt from "bcryptjs"

import('../DB/conn.js')
import userdata from '../model/userSchema.js'

router.post('/signup', async (req, res) => {
    // console.log(req.body)
    // res.json({message: req.body})

    const { name, email, pnumber, date } = req.body
    const hashedPassword = await bcrypt.hash(pnumber, 12);
    // console.log(name)

    if (!name || !email) {
        return res.json({ error: "please filled the required fileds properly" })
    }

    userdata.findOne({ email: email }).then((userExist) => {
        if (userExist) { return res.json({ error: "user already exists" }) }

        const Newuserdata = new userdata({ name, email, pnumber: hashedPassword, date })
        Newuserdata.save().then(() => {
            res.json({ message: "user registered" })
        }).catch((err) => { res.json({ error: "failed to resister" ,err }) })
    }).catch((err) => { res.json({ error: err }) })



})





router.post('/signin', async (req, res) => {
    try{
        const {email , pnumber} = req.body
        if (!email || !pnumber) {
            return res.json({ error: "please filled the required fileds properly" })
        }

        const accountConfirmation = await userdata.findOne({ email: email })
        if(!accountConfirmation){
            return res.json({error: "either email or password or both are wrong"})
        }

        const passwordConfirmation = await bcrypt.compare(pnumber, accountConfirmation.pnumber)
        if(!passwordConfirmation){
            return res.json({error: "either email or password or both are wrong"})
        }

        res.json({message: "Logged in Successfully!"})


    } catch(err) {
        res.json({error : err})
    }
    


})



export default router