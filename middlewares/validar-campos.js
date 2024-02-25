const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Estudiante = require('../models/estudiante')

const validarCampos = (req, res, next) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json(error);
    }

    next();
}

const ValidarRolStudent = async (req, res, next) => {
    const { Estudiante } = req.body;

    try {
        const existeEstudiante = await Estudiante.findById(Estudiante);

        if (!existeEstudiante) {
            return res.status(400).json({
                msg: 'El ID del Estudiante proporcionado no existe'
            });
        }

        if (existeEstudiante.role === "STUDENT_ROLE") {
            req.body.role = "STUDENT_ROLE";
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
    validarRolTeacher,
    ValidarRolStudent
}