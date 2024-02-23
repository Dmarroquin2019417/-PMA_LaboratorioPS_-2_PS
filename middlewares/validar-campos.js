const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Estudiante = require('../models/estudiante')

const validarCampos = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const validarRolTeacher = async (req, res, next) => {
    const { maestro } = req.body;

    try {
        const existeEstudiante = await Estudiante.findById(maestro);

        if (!existeEstudiante) {
            return res.status(400).json({
                msg: 'El ID del Estudiante proporcionado no existe'
            });
        }

        if (existeEstudiante.role === "TEACHER_ROLE") {
            req.body.role = "TEACHER_ROLE";
            next();
        } else {
            return res.status(400).json({
                msg: 'Un Estudiante no puede asignar cursos o eliminarlos'
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: 'Eyy, Error interno del servidor'
        });
    }
};

module.exports = {
    validarCampos,
    validarRolTeacher
};
