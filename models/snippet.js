
const mongoose = require('mongoose');

const snippetSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  title: {type: String, required: true},
  body: {type: String, required:true},
  language: {type: String, required: true},
  tags: [{type: String}],
  notes: [{type: String}]
});

const Snippet = mongoose.model('Snippet', snippetSchema);
module.exports = Snippet;
