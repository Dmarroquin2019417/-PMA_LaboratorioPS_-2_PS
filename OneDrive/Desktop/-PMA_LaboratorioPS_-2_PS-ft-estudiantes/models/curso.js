const { Schema, model} = require('mongoose');

const CursoSchema = Schema ({
    Curso: {
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
    role: {
        type: String,
        required: true,
        enum: ["TEACHER_ROLE", "STUDENT_ROLE"],
        default: "TEACHER_ROLE"
    },

    maestro:{
        type: String,
        required: [true, 'El Maestro es obligatorio']
    }
});

module.exports = model('Curso', CursoSchema);