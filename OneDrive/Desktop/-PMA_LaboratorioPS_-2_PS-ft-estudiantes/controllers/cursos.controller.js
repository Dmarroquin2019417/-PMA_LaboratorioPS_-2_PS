const { response } = require('express');
const Curso = require('../models/curso'); 

const Estudiante = require('../models/estudiante');
const estudianteasigCurso = require('../models/estudianteasigCurso');

const cursosGet = async (req, res = response) => {
    const { limite = 10, desde = 0 } = req.query;
    const query = { estado: true };

    try {
        const [total, cursos] = await Promise.all([
            Curso.countDocuments(query),
            Curso.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            total,
            cursos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error interno del servidor'
        });
    }
}

const getCursoByid = async (req, res) => {
    const { id } = req.params;
    try {
        const curso = await Curso.findById(id);
        if (!curso) {
            return res.status(404).json({
                msg: 'El curso no fue encontrado'
            });
        }
        res.status(200).json({
            curso
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error interno del servidor'
        });
    }
}

const cursosPut = async (req, res) => {
    const { id } = req.params;
    const { ...resto } = req.body;

    try {
        const curso = await Curso.findByIdAndUpdate(id, resto);
        res.status(200).json({
            msg: 'Curso actualizado Exitosamente'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error interno del servidor'
        });
    }
}

const cursosDelete = async (req, res) => {
    const { id } = req.params;
    
    try {
        const curso = await Curso.findById(id);
        if (!curso) {
            return res.status(404).json({
                msg: 'El curso no fue encontrado'
            });
        }
        await Curso.findByIdAndUpdate(id, { estado: false });

        await estudianteasigCurso.updateMany({ curso: id }, { estado: false });

        res.status(200).json({
            msg: 'Curso eliminado exitosamente',
            curso: curso.Curso
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error interno del servidor'
        });
    }
}

const cursosPost = async (req, res) => {
    const { Curso, materia, maestro } = req.body;

    try {
        const Maestro = await Estudiante.findOne({ correo: maestro });
        if (!Maestro || Maestro.role !== "TEACHER_ROLE") {
            return res.status(400).json({
                msg: 'El maestro no existe o no tiene permisos suficientes'
            });
        }

        const curso = new Curso({ Curso, materia, maestro, role: 'TEACHER_ROLE' });

        await curso.save();
        res.status(201).json({
            msg: 'Curso creado exitosamente',
            curso
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error interno del servidor'
        });
    }
}




module.exports = {
    cursosDelete,
    cursosPost,
    cursosGet,
    getCursoByid,
    cursosPut
}
