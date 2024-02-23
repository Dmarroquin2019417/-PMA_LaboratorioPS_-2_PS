const Estudiante = require('../models/estudiante');
const Curso = require('../models/curso');

const existenteEmail = async (correo = '') => {
    const existeEmail = await Estudiante.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El email ${correo} ya fue registrado`);
    }
};

const noExistenteEmail = async (correo = '') => {
    const existeEmail = await Estudiante.findOne({ correo });
    if (!existeEmail) {
        throw new Error(`El email ${correo} no existe`);
    }
};

const existeEstudianteById = async (id = '') => {
    const existeEstudiante = await Estudiante.findById(id);
    if (!existeEstudiante) {
        throw new Error(`El Estudiante con el id: ${id} no existe`);
    }
};

const existeCursoById = async (id = '') => {
    const existeCurso = await Curso.findById(id);
    if (!existeCurso) {
        throw new Error(`El curso con el id: ${id} no existe`);
    }
};

const existeCursoByNombre = async (nombre = '') => {
    const existeCurso = await Curso.findOne({ nombre });
    if (existeCurso) {
        throw new Error(`El curso con el nombre: ${nombre} ya existe`);
    }
};

module.exports = {
    existenteEmail,
    existeEstudianteById,
    existeCursoById,
    noExistenteEmail,
    existeCursoByNombre
};
