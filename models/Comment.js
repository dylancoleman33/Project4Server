const
  mongoose = require('mongoose'),

  commentSchema = new mongoose.Schema({
    userId: {type: String, require: true},
    bookId: {type: String, require: true},
    title: {type: String, require: true},
    body: {type: String, require: true}
  })

  const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
