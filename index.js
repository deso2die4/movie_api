const express = require('express');
const app = express(),
  morgan = require('morgan'),
  bodyparser = require('body-parser'),
  uuid = require('uuid'),
  mongoose = require('mongoose');
 const   models = require('./models.js');
 const { check, validationResult } = require('express-validator');

  const movies = models.movies;
  const users = models.users;


  mongoose.connect('mongodb://localhost:27017/moviedb', { useNewUrlParser: true, useUnifiedTopology: true });
//mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });




  app.use(bodyparser.json());
  app.use(bodyparser.urlencoded({ extended: true }));

  const cors = require('cors');
  app.use(cors());

  let auth = require('./auth')(app);
  const passport = require('passport');
  require('./passport');

app.use(morgan('common'));

app.use('/documentation.html', express.static('public'));


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong');
});



app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  movies.find().then((movies)=>{
    res.json(movies)
  })
  .catch((err)=> {
    console.error(err);
    res.status(500).send(err)
  })

});

app.get('/movies/:movietitle', passport.authenticate('jwt', { session: false }), (req, res) => {
  let movietitle = req.params.movietitle;
  movies.findOne({title: movietitle})
  .then((movie) => {
     res.json(movie);
   })
     .catch((err) => {
       console.error(err);
     res.status(500).send(err);
});
});


app.get('/movies/genres/:genre', passport.authenticate('jwt', { session: false }), (req, res) => {
  let genre = req.params.genre;
  movies.findOne({"genre.name": genre})
  .then((data) => {
    res.status(200).send(data.genre);
  })
  .catch((err) => {
    console.error(err);
    res.status(404).send(err);
  })
});



app.get('/movies/directors/:director', passport.authenticate('jwt', { session: false }), (req, res) => {
  let director = req.params.director;
  movies.findOne({'director.name': director})
  .then((data) => {
    res.status(200).send(data.director);
  })
  .catch((err) => {
    console.error(err);
    res.status(404).send(err);
  })
});


//CREATE new user
app.post('/users', 
[
  check('name', 'Username is required').isLength({min: 5}),
  check('name', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('password', 'Password is required').not().isEmpty(),
  check('email', 'Email does not appear to be valid').isEmail()
], (req, res) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  let hashedPassword = users.hashPassword(req.body.password);
  let userData = req.body;
  users.findOne({name: req.body.name}).then((user) => {
      if (user) {
        return res.status(400).send(req.body.name + 'already exists');
      } else {
        users.create({
            name: req.body.name,
            password: hashedPassword,
            email: req.body.email,
            birthDate: req.body.birthDate
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});


//UPDATE user Info
app.put('/users/:id',
[
  check('Username', 'Username is required').isLength({ min: 5 }),
  check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail(),
],

passport.authenticate('jwt', { session: false }), (req, res) => {
  let userData = req.body;
  let hashedPassword = users.hashPassword(req.body.password);
  users.findOneAndUpdate({name: req.params.id}, {$set:{
    name: req.body.name,
    password: hashedPassword,
    email: req.body.email,
    birthDate: req.body.birthDate
  }}).then(users.findOne({name: userData.name })).then((data) => {
    res.status(200).json(data);
  }).catch((err) => {
    console.error(err);
    res.status(500).send(err);
  });
});


//ADD movie
app.post('/users/:name/movies/:Movieid', passport.authenticate('jwt', { session: false }), (req, res) => {
  users.findOneAndUpdate({ name: req.params.name }, {
     $push: { favMovies: req.params.Movieid }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.json(updatedUser);
    }
  });
});



//DELETE movie
app.delete('/users/:name/movies/:Movieid', passport.authenticate('jwt', { session: false }), (req, res) => {
  users.findOneAndUpdate({ name: req.params.name }, {
     $pull: { favoriteMovies: req.params.Movieid }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.json(updatedUser);
    }
  });
});

app.delete('/users/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  users.findOneAndRemove({ name: req.params.name })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.name + ' was not found');
      } else {
        res.status(200).send(req.params.name + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//app.listen(8080, ()=> { console.log('App is listening on port 8080.'); });
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
  console.log('Listening on Port ' + port);
 });