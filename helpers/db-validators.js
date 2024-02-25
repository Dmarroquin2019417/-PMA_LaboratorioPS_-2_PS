const Estudiante = require('../models/estudiante');
const Curso = require('../models/curso');

const existenteEmail = async (req, res, next) => {
    const { correo } = req.body;
    try {
        const existeEmail = await Estudiante.findOne({ correo });
        if (existeEmail) {
            throw new Error(`El email ${correo} ya fue registrado`);
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};

const EmailnoExistente = async (req, res, next) => {
    const { correo } = req.body;
    try {
        const existeEmail = await Estudiante.findOne({ correo });
        if (!existeEmail) {
            throw new Error(`El email ${correo} no existe`);
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};

const existeCursoByNombre = async (req, res, next) => {
    const { nombre } = req.body;
    try {
        const existeCurso = await Curso.findOne({ nombre });
        if (existeCurso) {
            throw new Error(`El curso con el nombre: ${nombre} ya existe`);
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};

module.exports = {
    existenteEmail,
    EmailnoExistente,
    existeCursoByNombre
};
