const { Schema, model, Types } = require('mongoose');

const EstudianteasigCurso = Schema ({
    estudiante: {
        type: Types.ObjectId,
        ref: 'Estudiante',
        required: [true, 'El Estudiante es obligatorio']
    },
    curso: {
        type: Types.ObjectId,
        ref: 'Curso',
        required: [true, 'El Curso es obligatorio']
    },
    estado:{
        type: Boolean,
        default: true
    }
    
});

module.exports = model('EstudianteasigCurso', EstudianteasigCurso);