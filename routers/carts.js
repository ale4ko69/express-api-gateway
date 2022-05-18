const express = require('express');
const router = express.Router()
const apiAdapter = require('../services/api-adapter')
const isAuth = require('../services/request-auth')

const BASE_URL = 'https://dummyjson.com/'
const api = apiAdapter(BASE_URL)

router.get('/carts', isAuth, (req, res) => {
    api.get(req.path).then(resp => {
        res.send(resp.data)
    })
})

router.get('/carts/:path/:id?', isAuth, (req, res) => {
    const params = req.query ? { params: req.query } : ''
    api.get(req.path, params).then(resp => {
        res.send(resp.data)
    })
})


module.exports = router
