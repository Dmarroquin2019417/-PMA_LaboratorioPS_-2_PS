const { response } = require('express');
const EstudianteasigCurso = require('../models/estudianteasigCurso');
const Estudiante = require('../models/estudiante');
const Curso = require('../models/curso');

const estudianteasigCursoGet = async (req, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { estado: true };

        const [total, estudianteasigCursos] = await Promise.all([
            EstudianteasigCurso.countDocuments(query),
            EstudianteasigCurso.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            total,
            estudianteasigCursos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};

const getEstudianteasigCursoByid = async (req, res) => {
    try {
        const { correo } = req.body;
        const estudiante = await Estudiante.findOne({ correo });

        if (!estudiante) {
            return res.status(400).json({ msg: 'El estudiante no existe' });
        }

        const cursosInscritos = await EstudianteasigCurso.find({ estudiante: estudiante.id, estado: true }).populate('curso');

        if (cursosInscritos.length === 0) {
            return res.status(400).json({ msg: 'El estudiante no está inscrito en ningún curso' });
        }

        const listaCursos = cursosInscritos.map(curso => ({
            nombre: curso.curso.nombre,
        }));

        res.status(200).json({
            cursos: listaCursos
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};

const estudianteasigCursoDelete = async (req, res) => {
    try {
        const { id } = req.params;
        await EstudianteasigCurso.findByIdAndUpdate(id, { estado: false });

        res.status(200).json({
            msg: 'Estudiante eliminado del curso exitosamente'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};

const estudianteasigCursoPost = async (req, res) => {
    try {
        const { correo, materia } = req.body;
        const estudiante = await Estudiante.findOne({ correo });

        if (!estudiante) {
            return res.status(400).json({ msg: 'El estudiante no existe' });
        }

        const curso = await Curso.findOne({ nombre: materia });

        if (!curso) {
            return res.status(400).json({ msg: 'El curso no existe' });
        }

        const cantidadCursosInscritos = await EstudianteasigCurso.countDocuments({ estudiante: estudiante.id });

        if (cantidadCursosInscritos >= 3) {
            return res.status(400).json({
                msg: 'El estudiante ya tiene un máximo de cursos permitidos'
            });
        }

        const existeAsignacion = await EstudianteasigCurso.findOne({ estudiante: estudiante.id, curso: curso.id });

        if (existeAsignacion) {
            return res.status(400).json({
                msg: 'El estudiante ya se encuentra en este curso'
            });
        }

        const estudianteasigCurso = new EstudianteasigCurso({
            estudiante: estudiante.id,
            curso: curso.id
        });

        await estudianteasigCurso.save();

        res.status(200).json({
            estudiante: estudiante.nombre,
            correo_estudiante: correo,
            curso: materia,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};

module.exports = {
    estudianteasigCursoGet,
    getEstudianteasigCursoByid,
    estudianteasigCursoDelete,
    estudianteasigCursoPost
};
