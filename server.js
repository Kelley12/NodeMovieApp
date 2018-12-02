const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express()

const apiKey = '896ab2459fc334990798fe679f1d8ef8';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
	res.render('index', {movies: null, error: null});
})

app.post('/', function (req, res) {
	let movie = req.body.searchText;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&page=1&query=${movie}`

	request(url, function (err, response, body) {
		if(err){
			res.render('index', {movies: null, error: 'Error, please try again'});
		} else {
            let movieResults = JSON.parse(body)
            let results = movieResults.results;
            let movies = [];
			if(results == undefined || results.length < 1){
				res.render('index', {movies: null, error: `Error searching for \'${movie}\', please try again`});
			} else {
                for (var i in results) { 
                    movies.push({
                        title:results[i].title,
                        poster:"https://image.tmdb.org/t/p/w154" + results[i].poster_path,
                        description: results[i].overview,
                        releaseDate: new Date(results[i].release_date).getFullYear(),
                        rating: results[i].vote_average,
                        popularity: results[i].popularity
                    }); 
                }
				res.render('index', {movies: movies, error: null});
			}
		}
	});
})

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function () {
	console.log('Movie app listening on port ', app.get('port'))
})