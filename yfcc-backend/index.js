const express = require("express");
const connection = require("./config/db");

const cors = require("cors");
const morgan = require("morgan");
//fs = require('fs'),
//https = require('https');


const Users = require("./models/Users");

//var generator = require('generate-password');


const app = express()
app.use(cors())
app.use(express.json({ extended: false }))
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// const routes = require("./routes/")
app.use("/", require("./routes"))


app.get("/", (req, res) => {
    res.send("We are live again");
})

app.use(function(req, res, next) { 
  res.status(404).json({errorCode: 404, errorMsg: 'Route not found!'});
});

//var privateKey  = fs.readFileSync('/var/www/ssl/private.key', 'utf8');
//var certificate = fs.readFileSync('/var/www/ssl/certificate.crt', 'utf8');
//var credentials = {key: privateKey, cert: certificate};
//var httpsServer = https.createServer(credentials, app);

// finally, let's start our server...
const server = app.listen(process.env.PORT || 3001, function () {
  console.log('Listening on port ' + server.address().port);
});
/*var servers = httpsServer.listen(8443, function () {
  console.log('Listening https on port ' + servers.address().port);
});*/

