var express = require('express');
var router = express.Router();


var path = require('path')
    , request = require('request')


router.post('/validateCaptcha', function (req, res) {

    var sender = req.body;
    var response = res;

    //send request to recaptcha verification server
    request.post('http://www.google.com/recaptcha/api/verify', {
            //should always store private keys as environment variables for many reasons
            form: {
                privatekey: process.env.RECAPTCHA_PRIVATE_KEY,
                //need requestors ip address
                remoteip: req.connection.remoteAddress,
                challenge: sender.challenge,
                response: sender.response
            }
        },
        function (err, res, body) {
            console.log(body);
            //if the request to googles verification service returns a body which has false within it means server failed
            //validation, if it doesnt verification passed
            if (body.match(/false/) === null) {
                response.send({code: 0, message: 'Captcha validated'});
            } else {
                response.send({code: 1, message: 'Captcha invalid'});
            }

        }
    );
});


/* GET home page. */
router.get('/chat', function (req, res, next) {
    //res.render('login/userlist.jade',{ title : 'X Chat' });
    res.render('managing_nicknames/index.jade', {title: 'X Chat'});
});
router.get('/loginR', function (req, res, next) {
    res.render('login/login.jade', {title: 'X Chat'});
});
router.get('/mongotest', function (req, res, next) {
    res.render('login/userlist.jade', {title: 'X Chat'});
});

/* GET Userlist page. */
router.get('/userlist', function (req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({}, {}, function (e, docs) {
        res.render('userlist', {
            "userlist": docs
        });
    });
});

module.exports = router;
