const Card = require('../models/card')
const Error500 = require('../errors/error500')
const Error404 = require('../errors/error404')

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body
  const owner = req.user._id

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => next(new Error500(`Ошибка при создании карточки -- ${err.message}`)))
}

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch(() => next(new Error500('Ошибка при чтении всех карточек')))
}

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) {
        const notCardOwner = new Error('Карта не ваша! Удалить нельзя!')
        notCardOwner.statusCode = 403
        throw notCardOwner
      }
      Card.remove(card)
        .then((cardToDelete) => res.send(cardToDelete !== null ? { data: card } : { data: 'Nothing to delete' }))
        .catch(() => { throw new Error500('Ошибка при удалении карты') })
    })
    .catch((err) => next(err.statusCode ? err : new Error404('Такой карты нет')))
}

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch(() => next(new Error500('Поставить лайк не получилось')))
}

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch(() => next(new Error500('Убрать лайк не получилось')))
}
