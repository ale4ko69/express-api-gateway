const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');
const store = require('../db');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/login', (req, res) => {
    const user = store.findOne('users', { email: req.body.email })
    
    if (!user) return res.status(404).send("User not found")

    if (user) {
        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password)

        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null })

        const token = jwt.sign({ id: user._id }, config.secret, { expiresIn: 86400 })

        res.status(200).send({ auth: true, token })
    }
})

router.get('/hashpassword', (req, res) => {
    const hashedPassword = bcrypt.hashSync(req.query.password, 8)
    // console.log(hashedPassword)
    res.status(200).send({ hashedPassword })
})

module.exports = router
