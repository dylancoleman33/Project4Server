const
  mongoose = require('mongoose'),

  bookSchema = new mongoose.Schema({
    title: {type: String, require: true},
    author: {type: String, require: true},
    image: {type: String, require: true}
  })

  const Book = mongoose.model('Book', bookSchema)

module.exports = Book
