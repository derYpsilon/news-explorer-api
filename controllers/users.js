const User = require('../models/user')
// const Error500 = require('../errors/error500')
const Error404 = require('../errors/error404')

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) throw Error
      res.send(user)
    })
    .catch(() => next(new Error404('Нет такого пользователя')))
}
