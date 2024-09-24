import express from 'express'
import jwt from 'jsonwebtoken'
const router = express.Router()
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser';

import bcrypt from "bcryptjs"

import('../DB/conn.js')
import userdata from '../model/userSchema.js'

router.use(cookieParser());


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
        }).catch((err) => { res.json({ error: "failed to resister", err }) })
    }).catch((err) => { res.json({ error: err }) })



})


const SECRET_KEY = '123luffy@bankai'


router.post('/signin', async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        try {
            const { email, pnumber } = req.body
            if (!email || !pnumber) {
                return res.json({ error: "please filled the required fileds properly" })
            }

            const accountConfirmation = await userdata.findOne({ email: email })
            if (!accountConfirmation) {
                return res.json({ error: "either email or password or both are wrong" })
            }

            const passwordConfirmation = await bcrypt.compare(pnumber, accountConfirmation.pnumber)
            if (!passwordConfirmation) {
                return res.json({ error: "either email or password or both are wrong" })
            }

            const token = jwt.sign({ name: accountConfirmation.name, email: accountConfirmation.email }, SECRET_KEY, { expiresIn: '1h' })
            res.cookie('token', token, { httponly: true, secure: true, maxAge: 3600000 })

            res.json({ message: "Logged in Successfully!" })


        } catch (err) {
            res.json({ error: err })
        }

    }
    else {
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) return res.status(400).json({ message: "token is not valid or expired, try logging in using email and password" })

            res.json({ message: "Logged in successfully with existing token", user });
        })
    }



})

router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: "Logged out successfully" });
});


export default router