const User = require('../models/user')
const Error500 = require('../errors/error500')
const Error404 = require('../errors/error404')

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => next(new Error500('Произошла ошибка при чтении списка пользователей')))
}

module.exports.getSingleUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) throw Error
      res.send({ data: user })
    })
    .catch(() => next(new Error404('Нет пользователя с таким id')))
}

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body
  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => next(new Error500(`Произошла ошибка при обновлении профиля ${err.message}`)))
}

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body
  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
    .then((user) => {
      res.send({ data: user })
    })
    .catch((err) => next(new Error500(`Произошла ошибка при обновлении аватара ${err.message}`)))
}
