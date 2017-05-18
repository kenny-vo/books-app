var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var AuthorSchema = new Schema({
  name: String,
  alive: Boolean,
  image: String
});

module.exports = mongoose.model('Author', AuthorSchema);
