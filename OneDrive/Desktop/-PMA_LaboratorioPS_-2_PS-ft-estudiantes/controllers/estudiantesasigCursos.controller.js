const { response } = require('express');
const EstudianteasigCurso = require('../models/estudianteasigCurso');
const Estudiante = require('../models/estudiante');
const Curso = require('../models/curso');

const estudianteasigCursoGet = async (req, res = response) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    try {
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
}

const getEstudianteasigCursoByid = async (req, res) => {
    const { correo } = req.body;

    try {
        const estudiante = await Estudiante.findOne({ correo });

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
}

const estudianteasigCursoDelete = async (req, res) => {
    const { id } = req.params;
    await EstudianteasigCurso.findByIdAndUpdate(id, { estado: false });

    res.status(200).json({
        msg: 'Estudiante eliminado del curso exitosamente'
    });
}

const estudianteasigCursoPost = async (req, res) => {
    const { correo, materia } = req.body;

    try {
        const estudianteEncontrado = await Estudiante.findOne({ correo });
        const estudianteId = estudianteEncontrado.id;

        const cursoEncontrado = await Curso.findOne({ nombre: materia });
        const cursoId = cursoEncontrado.id;

        const cantidadCursosInscritos = await EstudianteasigCurso.countDocuments({ estudiante: estudianteId });

        if (cantidadCursosInscritos >= 3) {
            return res.status(400).json({
                msg: 'El estudiante ya tiene un máximo de cursos permitidos'
            });
        }

        const existeAsignacion = await EstudianteasigCurso.findOne({ estudiante: estudianteId, curso: cursoId });

        if (existeAsignacion) {
            return res.status(400).json({
                msg: 'El estudiante ya se encuentra en este curso'
            });
        }

        const estudianteasigCurso = new EstudianteasigCurso({
            estudiante: estudianteId,
            curso: cursoId
        });

        await estudianteasigCurso.save();

        res.status(200).json({
            estudiante: estudianteEncontrado.nombre,
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
}
