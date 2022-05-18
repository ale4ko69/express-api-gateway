const express = require('express');
const router = express.Router()
const apiAdapter = require('../services/api-adapter')
const isAuth = require('../services/request-auth')
const mask = require('json-mask');

const BASE_URL = 'https://dummyjson.com/'
const api = apiAdapter(BASE_URL)

router.get('/products', isAuth, (req, res, next) => {
  const _params = req.query ?? ''
  const fields = _params.fields || ''

  if (fields) {
    delete _params.fields;
  }

  const params = { params: _params }

  api.get(req.path, params).then(resp => {
    const retData = fields ? mask(resp.data, fields) : resp.data
    res.send(retData)
  })
})

router.get('/products/:category/:single?', isAuth, (req, res) => {
  api.get(req.path).then(resp => {
    res.send(resp.data)
  })
})


module.exports = router
