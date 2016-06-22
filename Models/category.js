/**
 * Created by MaríaElena on 28/9/2015.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    key: String,
    category: String
});

module.exports = mongoose.model('Category', postSchema);