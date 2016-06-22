var UserPost = require('../Models/userPost');

var fs = require('fs');
require('../public/js/assets/date.js');

UserController = function () {
};

UserController.prototype.uploadFile = function (req, res) {
    // We are able to access req.files.file thanks to 
    // the multiparty middleware
    var file = req.files.file;
    console.log(file.name);
    console.log(file.type);
    var fileExtension = file.name.split(".")[1];

    var imgPath = file.path;
    var picture = "/postImages/" + req.body.username + "-" + (new Date()).toString("hhmmssddMMyyyy") + '.' + fileExtension
    fs.writeFile('./public' + picture, fs.readFileSync(imgPath), function (err) {
        if (err) throw err
        console.log('File saved.')
    })

    var userPost = new UserPost;

    userPost.title = req.body.title;
    userPost.picture = picture;
    userPost.detail = req.body.detail;
    userPost.location = req.body.location;
    userPost.time = req.body.time;
    userPost.username = req.body.username;
    userPost.category = req.body.category;
    userPost.likes = req.body.likes;
    userPost.state = req.body.state;
    userPost.evidence = req.body.evidence;

    userPost.save(function (err, id) {

        if (err) {
            return res.send(err);
        }

        res.send({message: 'Post Added'});
    });
}

module.exports = new UserController();