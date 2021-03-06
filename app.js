const dotenv = require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const axios = require('axios')

app.listen(process.env.PORT, () => console.log(`Front app listening on port ${process.env.PORT}!`))
app.set('view engine', 'pug')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(express.static('assets'))
app.use(express.static('pwa'))

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Qui prend quoi ?'
  })
})

app.get('/party/:id', async (req, res) => {
  const { id } = req.params

  try {
    const { data } = await axios.get(`${process.env.API_URL}/party/${id}`)
    const { name, author, _id, items } = data

    res.render('party', {
      id: _id,
      title: name,
      name,
      author,
      url: `${process.env.FRONT_URL}:${process.env.PORT}/party/${_id}`,
      items,
    })
  } catch (err) {
    console.error(err)
  } 
})

app.post('/party', async (req, res) => {
  try { 
    const { data: { _id } } = await axios.post(`${process.env.API_URL}/party`, req.body)
    res.redirect(`/party/${_id}`)
  } catch (err) {
    res.send(err)
  }
})

app.post('/party/:id/items', async (req, res) => {
  const { id } = req.params
  
  try {
    await axios.post(`${process.env.API_URL}/party/${id}/items`, req.body)
    res.redirect(`/party/${id}`)
  } catch (err) {
    res.send(err)
  }
})

app.post('/party/:id/items/:itemId', async (req, res) => {
  const { id, itemId } = req.params

  try {
    await axios.delete(`${process.env.API_URL}/party/${id}/items/${itemId}`)
    res.redirect(`/party/${id}`)
  } catch (err) {
    res.send(err)
  }
})

