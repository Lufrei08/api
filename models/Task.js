const mongoose = require('mongoose');
let Schema = mongoose.Schema;

var taskSchema = new Schema({
    idUser: {
        type: String,
    },
    conteudo: {
        type: String,
        required: [true, 'O campo é obrigatório'],
        minlength: [2, 'Digite pelo menos 2 caracteres']
    },
    status: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Task', taskSchema);