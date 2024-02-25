const { response, json } = require('express');
const Curso = require('../models/curso');
const Estudiante = require('../models/estudiante');
const estudianteasigCurso = require('../models/estudianteasigCurso');

const cursosGet = async (req, res = response) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

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
}

const getCursoByid = async (req, res) => {
    const { id } = req.params;
    const curso = await Curso.findOne({ _id: id });

    res.status(200).json({
        curso
    });
}

const cursosPut = async (req, res) => {
    const { id } = req.params;
    const { _id, ...resto } = req.body;

    const curso = await Curso.findByIdAndUpdate(id, resto);

    res.status(200).json({
        msg: 'Curso actualizado Exitosamente'
    })
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
            curso: curso.nombre
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error interno del servidor'
        });
    }
}


const cursosPost = async (req, res) => {
    const { nombre, materia, maestro } = req.body;

    const Maestro = await Estudiante.findOne({ correo: maestro });
    console.log(Maestro);

    if (!Maestro) {
        res.status(400).json({
            msg: 'El maestro no existe'
        })
    }

    if (Maestro.role !== "TEACHER_ROLE") {
        return res.status(400).json({
            msg: 'El estudiante no puede crear o asignarse a los cursos'
        });
    }

    const curso = new Curso({ nombre, materia, maestro });

    await curso.save();
    res.status(200).json({
        curso
    });
}

module.exports = {
    cursosDelete,
    cursosPost,
    cursosGet,
    getCursoByid,
    cursosPut
}