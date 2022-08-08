const express = require('express');
const app = express(),
  morgan = require('morgan');

  let top10movies = [
    { title: 'Hangover', genre: 'Comedy'},
    { title: 'Blade', genre: 'Thriller, Fantasy'},
    { title: 'Lets be Cops', ranking: 'Comedy'}
  ];

app.use(morgan('common'));

app.use('/documentation.html', express.static('public'));


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong');
});


app.get('/movies', (req, res) => {
  //res.json(top10movies);
  res.send('hello its movie time!');
  console.log('movie');
});

app.get('/', (req, res) => {
  console.log('Whats up tho?!');
  res.send('hello');
});


console.log('1');
app.listen(8080, ()=> { console.log('App is listening on port 8080.'); });
