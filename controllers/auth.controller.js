const { generarJWT } = require("../helpers/generar-jwt");
const Usuario = require("../models/estudiante");
const bycriptjs = require('bcryptjs');

const login = async (req, res) => {
    const { correo, password} = req.body;

    try{
        // verificar que el correo exista
        const usuario = await Usuario.findOne({ correo });

        console.log(usuario)
        if(!usuario){
            return res.status(400).json({
                msg: 'El correo no está registrado'
            })
        }

        // verificar si el usuario está activo
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'El usuario no existe en la base de datos'
            })
        }
        // verificar que la contraseña sea la correcta
        const validPassword = bycriptjs.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'Contraseña incorrecta'
            })
        }

        const token = await generarJWT(usuario.id);

        res.status(200).json({
            msg: 'Login ok',
            usuario,
            token
        });

    }catch(e){
        console.log(e);
        res.status(500).json({
            msg: 'Comuniquese con el admin'
        })
    }
}

module.exports = {
    login
};