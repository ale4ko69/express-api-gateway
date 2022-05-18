const express = require('express');
const http = require('http');
const path = require('path');
const reload = require('reload')
const router = require('./routers/router');
const bodyParser = require('body-parser');
const logger = require('morgan')
const favicon = require('request-favicon');
// const errorHandler = require('express-error-handler');

const app = express();

const publicDir = path.join(__dirname, 'public')

app.set('port', process.env.PORT || 3000)

app.use(favicon());
app.use(express.static('public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'))

//---- ROUTER
app.get('/', (req, res) => {
    res.sendFile(path.join(publicDir, '/index.html'));
})

app.use(router)

//---- SERVER
const server = http.createServer(app)

//---- Live Reload
reload(app)
    .then((reloadReturned) => {
    
    // Respond to errors and conditionally shut
    // down the server. Pass in the server object
    // so the error handler can shut it down
    // gracefully:
    // app.use( errorHandler({server}) );

    // reloadReturned is documented in the returns API in the README
  
    // Reload started, start web server
    server.listen(app.get('port'), () => {
      console.log(`Simple API Gateway web server listening on port ${app.get('port')}`)
    })

})
.catch((err) => {
    console.error('Reload could not start, could not start server/sample app', err)
})

