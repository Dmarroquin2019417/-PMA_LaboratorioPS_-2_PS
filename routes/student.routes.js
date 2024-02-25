const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { existenteEmail } = require('../helpers/db-validators');
const { estudiantesPost, estudiantesGet, getEstudianteById, estudiantesPut, estudiantesDelete, estudiantesLogin } = require('../controllers/student.controller');

const router = Router();

router.get("/", estudiantesGet);

router.get(
    "/:id",
    [
        check("id", "El id no es un formato válido de MongoDB").isMongoId(),
        check("id").custom(),
        validarCampos
    ],
    getEstudianteById
);

router.put(
    "/:id",
    [
        check("id", "El id no es un formato válido de MongoDB").isMongoId(),
        check("id").custom(),
        validarCampos
    ],
    estudiantesPut
);

router.delete(
    "/:id",
    [
        check("id", "El id no es un formato válido de MongoDB").isMongoId(),
        check("id").custom(),
        validarCampos
    ],
    estudiantesDelete
);

router.post(
    "/",
    [
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check("password", "La password debe tener más de 6 letras").isLength({ min: 6, }),
        check("correo", "El correo es obligatorio").isEmail(),
        check("correo").custom(existenteEmail),
        validarCampos,
    ],
    estudiantesPost
);

router.post(
    "/login",
    [
        check('correo', 'Este correo no es valido').isEmail(),
        check('password', 'La password es obligatoria').not().isEmpty(),
        validarCampos,
    ],
    estudiantesLogin
);

module.exports = router;
