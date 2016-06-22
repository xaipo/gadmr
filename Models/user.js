
/**
 * Created by MaríaElena on 28/9/2015.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var userSchema = new Schema({
    username: String,
    name: String,
    lastName: String,
    birthday: String,
    cellphone: String,
    sex: String,
    email: String,
    password: String
});

module.exports = mongoose.model('User', userSchema);