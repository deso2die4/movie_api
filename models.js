const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  genre: {
    name: String,
    description: String
  },
    description: {
      name: String,
      bio: String,
      birthDate: String,
      deathDate: String
  },
  director: {
    name: String,
    bio: String,
    birthDate: String,
    deathDate: String
  },
  genre: {
    name: String,
    description: String
  },
  imageUrl: String,
  featured: Boolean
});

let userSchema = mongoose.Schema({
  name: String,
  password: String,
  email: String,
  favMovies: [

                { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }
    ],
    birthDate: Date
});

let movies = mongoose.model('movie', movieSchema);
let users = mongoose.model('user', userSchema);

module.exports.movies = movies;
module.exports.users = users;
