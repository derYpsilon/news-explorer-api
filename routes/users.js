const users = require('express').Router()
const { celebrate, Joi } = require('celebrate')
const {
  getAllUsers, getSingleUser, updateUser, updateAvatar,
} = require('../controllers/users')

users.get('/', getAllUsers)

users.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum(),
  }),
}), getSingleUser)

users.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUser)

users.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri().required(),
  }),
}), updateAvatar)

module.exports = users
