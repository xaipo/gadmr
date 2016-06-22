var User = require('../models/user');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.route('/users')
    .get(function (req, res) {
        User.find(function (err, users) {
            if (err) {
                return res.send(err);
            }

            res.json(users);
        });
    })
    .post(function (req, res) {
        var user = new User(req.body);

        user.save(function (err) {
            if (err) {
                return res.send(err);
            }

            res.send({message: 'User Added'});
        });
    })

router.route('/users/:id')
    .put(function (req, res) {
        User.findOne({_id: req.params.id}, function (err, user) {
            if (err) {
                return res.send(err);
            }

            for (prop in req.body) {
                user[prop] = req.body[prop];
            }

            // save the user
            user.save(function (err) {
                if (err) {
                    return res.send(err);
                }

                res.json({message: 'User updated!'});
            });
        });
    })
    .get(function (req, res) {
        User.findOne({_id: req.params.id}, function (err, user) {
            if (err) {
                return res.send(err);
            }

            res.json(user);
        });
    })
    .delete(function (req, res) {
        User.remove({
            _id: req.params.id
        }, function (err, user) {
            if (err) {
                return res.send(err);
            }

            res.json({message: 'Successfully deleted'});
        });
    });

router.route('/authenticate/:username/:password')
    .get(function (req, res) {
        User.findOne({username: req.params.username}, function (e, user) {
            if (user) {
                user =user.toObject();
                if (user.password && user.password == req.params.password) {
                    res.send({autenticate: true});
                    return;
                }
            }
            res.json({autenticate: false});
        });
    });

module.exports = router;
