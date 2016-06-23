process.env.PORT = 3001;
process.env.RECAPTCHA_PRIVATE_KEY = '6Lf8CA4TAAAAAIiPZHiEzZFCD5ruPFmSjGscFiL9';

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//routes
var routes = require('./routes/index');
var users = require('./routes/users'); //routes are defined here
var posts = require('./routes/userPosts'); //routes are defined here
var categories = require('./routes/categories');

// Mongo Conection
var dbName = 'MoviDB';
var connectionString = 'mongodb://localhost:27017/' + dbName;
mongoose.connect(connectionString);


var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//configure body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


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


//router.route('/user')
//    .post(function(req, res) {
//        //var name= req.body.name;  // set the bears name (comes from the request)
//
//        var db = req.db;
//        var collection = db.get('User');
//        collection.insert(req.body);
//
//    });
//
//
//app.use('/api', router);
//

/// error handlers

/*

 /// catch 404 and forwarding to error handler
 app.use(function(req, res, next) {
 var err = new Error('Not Found');
 err.status = 404;
 next(err);
 });
 // development error handler
 // will print stacktrace
 if (app.get('env') === 'development') {
 app.use(function(err, req, res, next) {
 res.status(err.status || 500);
 res.render('error', {
 message: err.message,
 error: err
 });
 });
 }

 // production error handler
 // no stacktraces leaked to user
 app.use(function(err, req, res, next) {
 res.status(err.status || 500);
 res.render('error', {
 message: err.message,
 error: {}
 });
 });
 */


module.exports = app;

