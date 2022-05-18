const express = require('express');
const router = express.Router()
const productsRouter = require('./products')
const usersRouter = require('./users')
const cartsRouter = require('./carts')
const unionRouter = require('./union-request')
const authRouter = require('../controller/auth-controller')

router.use((req, res, next) => {
    console.log("Called: ", req.path)
    next()
})

router.use(productsRouter)
router.use(usersRouter)
router.use(cartsRouter)
router.use(unionRouter)
router.use(authRouter)

module.exports = router
