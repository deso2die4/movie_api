const express = require('express');
const app = express(),
  morgan = require('morgan'),
  bodyparser = require('body-parser'),
  uuid = require('uuid'),
  mongoose = require('mongoose');
 const   models = require('./models.js');

  const movies = models.movies;
  const users = models.users;


  mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });





  app.use(bodyparser.json());
  app.use(bodyparser.urlencoded({ extended: true }));

app.use(morgan('common'));

app.use('/documentation.html', express.static('public'));


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong');
});
/*
app.get('/movies', (req, res) => {
  res.send('hallo')
});
*/

app.get('/movies', (req, res) => {
  movies.find().then((movies)=>{
    res.json(movies)
  })
  .catch((err)=> {
    console.error(err);
    res.status(500).send(err)
  })

});

app.get('/movies/:movietitle', (req, res) => {
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
/*
app.get('/movies/genre/:genre', (req, res) => {
  let genre = req.params.genre;
  let genreList = movies.find(movies => movies.genre == genre);
  if (genreList) {
  res.status(200).json(genreList);
    } else {
      res.status(404).send('${genre} doesnt exist');
    }
});
*/
app.get('/movies/genre/:genre', (req, res) => {
  let genre = req.params.genre;
  movies.findOne({genre: genre})
  .then((genre) => {
    res.status(200).send(genre);
  })
  .catch((err) => {
    console.error(err);
    res.status(404).send(err);
  })
});

/*

app.get('/movies/director/:director', (req, res) => {
  let director = req.params.director;
  let directorInfo = movies.find(movies =>
   movies.director == director).director;
   console.log(directorInfo);
  if (directorInfo) {
    res.status(200).json(directorInfo);
  } else {
    res.status(404).send('${director} not found');
  }
});
app.get('/movies/director/:director', (req, res) => {
  let director = req.params.director;
  movies.findOne({director: director})
  .then((director) => {
    res.status(200).send(director);
  })
  .catch((err) => {
    console.error(err);
    res.status(404).send(err);
  })
});


//CREATE new user
app.post('/user', (req, res) => {
  let userData = req.body;
  userData.id = uuid.v4();
  if(userData.name) {
    users.push(userData);
    res.status(200).json(userData);
    console.log(users);
  } else {
    res.status(400).send('please write name');
  }
});
app.post('/user', (req, res) => {
  let userData = req.body;
  users.findOneandUpdate({name: req.body.name}, {$set:{
    name: req.body.name,
    password: req.body.password,
    email: req.body.email,
    birthDate: req.body.birthDate
  }}).then((data) => {
    res.status(200).json(data);
  }).catch((err) => {
    console.error(err);
    res.status(500).send(err);
  });
  });
  /*
  if(userData.name) {
    users.push(userData);
    res.status(200).json(userData);
    console.log(users);
  } else {
    res.status(400).send('please write name');
  }

});
*/
/*
//UPDATE user Info
app.put('/user/:id', (req, res) => {
  let id = req.params.id;
  let updateduser = req.body;
  let user = users.find(users => users.id == id);
  if(user) {
    user.name = updateduser.name;
    res.status(200).send('hallo');
    console.log(users);
  } else {
    res.status(400).send('no such user');
  }
});
*/
/*
app.put('/user/:id', (req, res) => {
  let userData = req.body;
  users.findOneandUpdate({name: req.body.name}, {$set:{
    name: req.body.name,
    password: req.body.password,
    email: req.body.email,
    birthDate: req.body.birthDate
  }}).then((data) => {
    res.status(200).json(data);
  }).catch((err) => {
    console.error(err);
    res.status(500).send(err);
  });
});

//ADD movie
app.post('/user/:id/:movietitle', (req, res) => {
  let id = req.params.id;
  let movietitle= req.params.movietitle;
  let user = users.find(users => users.id == id);
  if(user) {
    user.favMovies = movietitle;
    res.status(200).send('Movie is added!');
    console.log(users);
  } else {
    res.status(400).send('no such user');
  }
});


*/
/*

//DELETE movie
app.delete('/user/:id/:movietitle', (req, res) => {
  let id = req.params.id;
  let movietitle= req.params.movietitle;
  let user = users.find(users => users.id == id);
  if(user ) {
    user.favMovies = users.filter(users => users.favMovies !== movietitle);
    res.status(200).send('Movie is removed!');
    console.log(users);
  } else {
    res.status(400).send('no such user');
  }
});

//DELETE user
app.delete('/user/:id', (req, res) => {
  let id = req.params.id;
  let user = users.find(users => users.id == id);
  if(user ) {
    user = users.filter(users => users.id !== id);
    res.status(200).send('User is removed!');
    console.log(users);
  } else {
    res.status(400).send('no such user');
  }
});

*/
app.listen(8080, ()=> { console.log('App is listening on port 8080.'); });
