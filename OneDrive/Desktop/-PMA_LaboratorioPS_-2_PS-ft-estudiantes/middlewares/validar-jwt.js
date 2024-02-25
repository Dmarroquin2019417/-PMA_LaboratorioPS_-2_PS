const jwt = require("jsonwebtoken");
const Estudiante = require('../models/estudiante');

const validarJWT = async (req, res, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "No hay token en la petición",
    });
  }

  try {
    //verificación de token
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    //leer el estudiante que corresponde al uid
    const estudiante = await Estudiante.findById(uid);
    //verificar que el estudiante exista.
    if (!estudiante) {
      return res.status(401).json({
        msg: "Estudiante no existe en la base de datos",
      });
    }
    //verificar si el uid está habilidato.
    if (!estudiante.estado) {
      return res.status(401).json({
        msg: "Token no válido - estudiante con estado:false",
      });
    }

    req.estudiante = estudiante;

    next();
  } catch (e) {
    console.log(e),
      res.status(401).json({
        msg: "Token no válido",
      });
  }
};

module.exports = {
  validarJWT,
};
