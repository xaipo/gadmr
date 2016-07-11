process.env.PORT = 3001;
process.env.RECAPTCHA_PRIVATE_KEY = '6Lf8CA4TAAAAAIiPZHiEzZFCD5ruPFmSjGscFiL9';

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
//routes
var routes = require('./routes/index');
var users = require('./routes/users'); //routes are defined here
var posts = require('./routes/userPosts'); //routes are defined here
var categories = require('./routes/categories');

// Mongo Conection
var dbName = 'MoviDB';
//var connectionString = 'mongodb://localhost:27017/' + dbName;
var connectionString = 'mongodb://192.168.0.102:27017/' + dbName;
mongoose.connect(connectionString);


var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//configure body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());// permite angular interactuar

app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(__dirname + '/css'));

//Register APIS
app.use('/', routes);
app.use('/api', users);
app.use('/api', posts);
app.use('/api', categories);

//GET HTML PAGES
app.get('/', function (req, res) {
    return res.sendFile(__dirname + '/public/Views/index.html');
});
app.get('/retoMovi', function (req, res) {
    return res.sendFile(__dirname + '/public/Views/Application/userDashboard.html');
});
app.get('/createPost', function (req, res) {
 return res.sendFile(__dirname + '/public/Views/Application/UserPost/CreatePost.html');
});

app.get('/qreader', function (req, res) {
    return res.sendFile(__dirname + '/public/Views/Application/UserPost/qrReader.html');
});


// Requires multiparty
multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty(),

// Requires controller
    UserController = require('./backControllers/UserController');
// Example endpoint
app.post('/api/user/uploads', multipartyMiddleware, UserController.uploadFile);

app.listen(3001);
console.log("servidor ejecutando en el puerto 3001");

module.exports = app;

