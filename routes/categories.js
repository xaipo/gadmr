var Category = require('../models/category');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.route('/categories')
    .get(function (req, res) {
        Category.find(function (err, categories) {
            if (err) {
                return res.send(err);
            }

            res.json(categories);
        });
    })
    .post(function (req, res) {
        var category = new Category(req.body);

        category.save(function (err) {
            if (err) {
                return res.send(err);
            }

            res.send({message: 'Category Added'});
        });
    })


module.exports = router;
