require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const helmet = require('helmet')
const { celebrate, Joi, errors } = require('celebrate')
const cookieParser = require('cookie-parser')
const usersRoute = require('./routes/users')
const cardsRoute = require('./routes/cards')
const auth = require('./middlewares/auth')
const { requestLogger, errorLogger } = require('./middlewares/logger')
const { createUser, login } = require('./controllers/auth')
const Error404 = require('./errors/error404')

const { PORT = 3000 } = process.env

const app = express()

app.use(helmet())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
})
app.use(requestLogger)

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт')
  }, 0)
})

app.post('/signup', celebrate({
  body: Joi.object().keys({
    password: Joi.string().required().min(8),
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().uri().required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), createUser)

app.post('/signin', celebrate({
  body: Joi.object().keys({
    password: Joi.string().required().min(8),
    email: Joi.string().email().required(),
  }),
}), login)

app.use(auth)

app.use('/users', usersRoute)
app.use('/cards', cardsRoute)
app.use('*', (req, res, next) => {
  next(new Error404('Ресурс не найден'))
})

app.use(errorLogger)

app.use(errors())

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.statusCode ? err.statusCode : 500)
    .send({ message: err.message })
})

app.listen(PORT, () => {
  console.log('App is listening to port ', PORT)
})
