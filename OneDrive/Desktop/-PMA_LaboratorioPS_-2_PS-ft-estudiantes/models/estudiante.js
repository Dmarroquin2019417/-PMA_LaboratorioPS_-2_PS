const { Schema, model } = require('mongoose');

const EstudianteSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },

    role: {
        type: String,
        required: true,
        enum: ["TEACHER_ROLE", "STUDENT_ROLE"],
        default: "STUDENT_ROLE"
    },
    
    estado: {
        type: Boolean,
        default: true
    },
    cursosAsignados: [{ type: Schema.Types.ObjectId, ref: 'Curso' }]
});


EstudianteSchema.methods.toJSON = function () {
    const { __v, password, _id, ...estudiante } = this.toObject();
    estudiante.uid = _id;
    return estudiante;
}

module.exports = model('Estudiante', EstudianteSchema);
