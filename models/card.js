const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    validate: {
      validator: (v) => !v.match(/[^a-zA-Zа-яА-Я0-9\s-]/),
      message: (props) => `${props.value} is not a valid Name for Card!`,
    },
  },
  link: {
    type: String,
    validate: {
      validator: (v) => v.match(/^https?:\/\/(www\.)?[\w./-]{1,}/),
      message: (props) => `${props.value} is not a valid URL!`,
    },
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId }],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('card', cardSchema)
