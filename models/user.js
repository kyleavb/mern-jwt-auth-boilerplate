var mongoose = require('mongoose')
var bcrypt = require('bcrypt')

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 99
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxLength: 99
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        minLength: 99
    }
})

userSchema.set('toJson', {
    transform: function(doc, ret, options){
        let returnJson = {
            _id: ret._id,
            email: ret.email,
            name: ret.name
        }
        return returnJson
    }
})

userSchema.methods.authenticated = function(password, cb){
    bcrypt.compare(password, this.password, function(err, res){
        if(err){
            cb(err)
        }else{
            cb(null, res ? this : false)
        }
    })
}

userSchema.pre('save', function(next){
    var hash = bcrypt.hashSync(this.password, 10)
    this.password = hash
    next()
})

var User = mongoose.model('User', userSchema)

module.exports = User;