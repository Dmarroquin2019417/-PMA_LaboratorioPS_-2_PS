const { response, json } = require('express');
const bcryptjs = require('bcryptjs');
const Estudiante = require('../models/estudiante');
const { generarJWT } = require("../helpers/generar-jwt");

const estudiantesGet = async (req, res = response) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    const [total, estudiantes] = await Promise.all([
        Estudiante.countDocuments(query),
        Estudiante.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        estudiantes
    });
};

const getEstudianteById = async (req, res) => {
    const { id } = req.params;
    const estudiante = await Estudiante.findOne({ _id: id });

    res.status(200).json({
        estudiante
    });
};

const estudiantesPut = async (req, res) => {
    const { id } = req.params;
    const { cursos, ...resto } = req.body;
    if (cursos && cursos.length > 3) {
        return res.status(400).json({ msg: 'No puedes asignarte más de 3 cursos' });
    }
    const estudiante = await Estudiante.findByIdAndUpdate(id, resto);

    res.status(200).json({
        msg: 'Estudiante actualizado exitosamente',
        estudiante
    });
};
const estudiantesDelete = async (req, res) => {
    const { id } = req.params;
    await Estudiante.findByIdAndUpdate(id, { estado: false });

    const estudiante = await Estudiante.findByIdAndUpdate(id, { estado: false });
    res.status(200).json({
        msg: 'Estudiante eliminado exitosamente',
        estudiante
    });
};

const estudiantesPost = async (req, res = response) => {
    const { nombre, correo, password, role, cursos } = req.body;

    try {
        // Validar máximo de 3 cursos asignados
        if (cursos && cursos.length > 3) {
            return res.status(400).json({ msg: 'No puedes asignarte más de 3 cursos' });
        }

        // Validar duplicados en la asignación de cursos
        const estudiante = await Estudiante.findOne({ correo });
        if (estudiante) {
            return res.status(400).json({ msg: 'Ya existe un estudiante con este correo' });
        }

        const salt = bcryptjs.genSaltSync();
        const hashedPassword = bcryptjs.hashSync(password, salt);

        const nuevoEstudiante = new Estudiante({ nombre, correo, password: hashedPassword, role });
        if (cursos) {
            await Promise.all(cursos.map(async (cursoId) => {
                const curso = await Curso.findById(cursoId);
                if (curso) {
                    nuevoEstudiante.cursosAsignados.push(cursoId);
                }
            }));
        }

        await nuevoEstudiante.save();
        const token = await generarJWT(nuevoEstudiante.id);

        res.status(200).json({
            msg: 'Estudiante creado exitosamente',
            estudiante: nuevoEstudiante,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error al crear el estudiante' });
    }
};

const estudiantesLogin = async (req, res) => {
    const { correo, password } = req.body;

    try{
        const estudiante = await Estudiante.findOne({ correo });

    if (!estudiante) {
        return res.status(400).json({
            msg: 'El Estudiante no sea encontrado'
        });
    }

    if(!estudiante.estado){
        return res.status(400).json({
            msg: 'Estudiante borrado de la base de datos'
        })
    }

    const passwordValido = bcryptjs.compareSync(password, estudiante.password);

    if (!passwordValido) {
        return res.status(400).json({
            msg: 'Contraseña incorrecta'
        });
    }

    const token = await generarJWT(estudiante.id)

    res.status(200).json({
        msg_1: 'Inicio de sesión exitosamente',
        msg_2: 'Welcome '+ estudiante.nombre,
        msg_3: 'Este su token =>'+ token,
    });

    }catch(e){
        console.log(e);
        res.status(500).json({
            msg: 'Eyy un error inesperado'
        })
    }

}

const cursosAsignadosGet = async (req, res) => {
    const { id } = req.params;
    const estudiante = await Estudiante.findById(id);

    // Aquí deberías obtener y devolver los cursos asignados al estudiante
    const cursosAsignados = []; // Aquí obtén los cursos asignados al estudiante desde alguna fuente de datos

    res.status(200).json({
        cursosAsignados
    });
};


module.exports = {
    cursosAsignadosGet,
    estudiantesDelete,
    estudiantesPost,
    estudiantesGet,
    getEstudianteById,
    estudiantesPut,
    estudiantesLogin
};
