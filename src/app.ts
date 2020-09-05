import express from "express";
import http from 'http'
import socket from 'socket.io'
import bodyParser from 'body-parser'
import passport from "passport";
import dotenv from 'dotenv'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import { registerAdminPanel } from './admin/admin.routes'
import { connectToDB } from "./helpers/DB";

import './passport-setup'
import { authMiddleware } from "./helpers/authMiddleware";
import { MailService } from "./helpers/sendEmails";
import { WordModel } from "./models/word.model";
dotenv.config()

const app = express()
const server = http.createServer(app);
const io = socket(http)

;(async () => {
  try {
    const DB_connection = await connectToDB(process.env.DB as string);
    app.use(cookieParser());
    app.use(cors({
      origin: "http://localhost:3000", 
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true 
    }))   
    app.use(express.json())
    app.use(bodyParser.json()) 

    app.use(session({
      cookie: { maxAge: 24 * 60 * 60 * 1000, },
      secret: process.env.COOKIE_SECRET as string || 'asdfsgaddfvdrvawefzsdfchbsae',
      resave: true,
      saveUninitialized: true
    }))

    app.use(passport.initialize());
    app.use(passport.session());
    

    const { router: Words } = await import('./routes/word.routes')
    app.use("/words", Words)

    const { router: Auth } = await import('./routes/auth.routes')
    app.use("/auth", Auth)

    const { router: Language } = await import('./routes/language.routes')
    app.use("/language", Language)

    const { router: Admin, url = '/admin' } = registerAdminPanel(DB_connection)
    app.use(url, Admin) 

    app.get('/user', authMiddleware, (req, res) => res.json({ user: req.user }))

    
    if (process.env.NODE_ENV === "production") {
      app.use(express.static('./public'));
      app.get('/', (req, res) => {
        res.sendFile('./public/index.html');
      });
    }

    
    // MailService.emit('send_words', await WordModel.find({}))
  } catch (error) {
    console.log(error)
  }
})()

io.on('connection', (_socket) => {
  console.log('a user connected');
});

const PORT = process.env.PORT || 8312 as number 
server.listen(PORT, () => console.log(`server started on http://localhost:${PORT}`))

