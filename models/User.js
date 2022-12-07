const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const segredo = require('../config/chavetoken');
const Task = require('../models/Task');

let userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'O campo username é obrigatório'],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'O campo password é obrigatório'],
        minLenght: 6,
        validate: {
            validator: function (v) {
                var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,1024}$/;
                return (!v || !v.trim().length) || re.test(v)
            },
            message: 'Preencha uma senha válida!'
        }
    },
    email: {
        type: String,
        required: [true, 'O campo email é obrigatório'],
        unique: true,
        validate: {
            validator: function (v) {
                var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                return (!v || !v.trim().length) || re.test(v)
            },
            message: 'Preencha um email válido!'
        }

    },
    token: {
        type: String
    }
});

userSchema.pre('save', function (next) {
    const usuario = this;

    if (usuario.isModified('password') || usuario.isNew) {
        //Criptografa senha
        bcrypt.hash(usuario.password, 8)
            .then(hash => {
                usuario.password = hash;
                next();
            })
            .catch(error => {
                next(error);
            })
    } else {
        return next();
    }
});

//TODO: Implementar delete de todas as tasks relacionadas ao usuário após deleta-lo


userSchema.methods.comparePassword = function (password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err) return cb(err);
        else cb(null, isMatch);
    });
};

userSchema.methods.generateAuthToken = function () {
    return new Promise((success, reject) => {
        const usuario = this;

        const token = jwt.sign(
            { _id: usuario._id },
            segredo.segredoToken,
            { expiresIn: '20d' }
        );
        usuario.token = token;

        usuario.save()
            .then(user => {
                success({ success: true, token: token, _id: usuario._id })
            })
            .catch(error => {
                reject({ success: false, token: null, error: error.message })
            });
    });
}

module.exports = mongoose.model('User', userSchema);