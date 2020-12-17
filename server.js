require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const MOVIES = require('./movies-data-small.json')

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
  console.log('validate bearer token middlewear')
  const authToken = req.get('Authorization')
  const apiToken = process.env.API_TOKEN

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    res.status(401).json({ error: 'Unauthorized request' })
  }
  // move on to the next middlewear
  next()
})

function handleGetMovie(req, res) {
  let response = MOVIES
  let genre = req.query.genre
  let country = req.query.country
  let avg_vote = req.query.avg_vote

  if (genre) {
    response = response.filter(movie => movie.genre.toLowerCase().includes(genre.toLowerCase()))
  }

  if (country) {
    response = response.filter(movie => movie.country.toLowerCase().includes(country.toLowerCase()))
  }

  if (avg_vote) {
    response = response.filter(movie => movie.avg_vote >= Number(avg_vote))
  }

  res.send(response)
}

app.get('/movie', handleGetMovie)

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})