const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


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

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.Password);
};

let movies = mongoose.model('movie', movieSchema);
let users = mongoose.model('user', userSchema);

module.exports.movies = movies;
module.exports.users = users;