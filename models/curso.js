const { Schema, model} = require('mongoose');

const CursoSchema = Schema ({
    nombre: {
        type: String,
        required: [true, 'Nombre obligatorio']
    },
    materia: {
        type: String,
        required: true
    },
    estado:{
        type: Boolean,
        default: true
    },
    maestro:{
        type: String,
        required: [true, 'El Maestro es obligatorio']
    }
});

module.exports = model('Curso', CursoSchema);