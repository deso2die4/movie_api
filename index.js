const express = require('express');
const app = express(),
  morgan = require('morgan');
  bodyparser = require('body-parser');
  uuid = require('uuid');

  let top10movies = [
    { title: 'Hangover', genre: 'Comedy'},
    { title: 'Blade', genre: 'Thriller, Fantasy'},
    { title: 'Lets be Cops', ranking: 'Comedy'}
  ];

  let movies = [
    { title: 'drama movie', description: 'movie full of drama', genre: 'drama', director: 'Jeroge M' /*{directorName: 'Jeroge M', Bio: 'Born 1983'}*/, imageUrl:'http:123'},
    { title: 'horror movie', description: 'movie full of horror', genre: 'horror', director: 'Berry L' /*{directorName: 'Berry L', Bio: 'Born 1947'}*/, imageUrl:'http:456'},
    { title: 'comedy movie', description: 'movie full of comedy', genre: 'comedy', director: 'Martin K' /*{directorName: 'Martin K', Bio: 'Born 19975'}*/, imageUrL:'http:789'}
  ];

  let users = [
    {name:'stev', favMovies:''},
    {name:'mark', favMovies:''},
    {name:'ana', favMovies:'', id: '1'}

  ];


  app.use(bodyparser.json());


app.use(morgan('common'));

app.use('/documentation.html', express.static('public'));


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong');
});


app.get('/movies', (req, res) => {

  res.send(movies);
  console.log('movie');
});

app.get('/movies/:movietitle', (req, res) => {
  let movietitle = req.params.movietitle;
  let movieInfo = movies.find(movies=>
   movies.title == movietitle );
   console.log(movieInfo);
  if (movieInfo) {
    res.status(200).json(movieInfo);
  } else {
    res.status(404).send('${movietitle} not found');
  }

});

app.get('/movies/genre/:genre', (req, res) => {
  let genre = req.params.genre;
  let genreList = movies.find(movies => movies.genre == genre);
  if (genreList) {
  res.status(200).json(genreList);
    } else {
      res.status(404).send('${genre} doesnt exist');
    }
});

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

//UPDATE user Info
app.put('/user/:id', (req, res) => {
  let id = req.params.id;
  let updateduser = req.body;
  let user = users.find(users => users.id == id);
  if(user) {
    user.name = updateduser.name;
    res.status(200).json(user);
    console.log(users);
  } else {
    res.status(400).send('no such user');
  }
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


app.listen(8080, ()=> { console.log('App is listening on port 8080.'); });
