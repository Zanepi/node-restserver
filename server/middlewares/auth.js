const jwt = require('jsonwebtoken');

//==================
//Verificar Token
//==================

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = decoded.usuario;

        next();


    });

    // res.json({
    //     token
    // });



};

//=====================
//Verificar ADMIN_ROLE
//=====================

let verificaAdmin_Role = (req, res, next) => {

    let token = req.get('token');
    let usuario = req.usuario;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        console.log(decoded.usuario.role);

        if (decoded.usuario.role != 'ADMIN_ROLE') {

            return res.status(401).json({
                ok: false,
                err: {
                    message: 'El usuario no es administrador'
                }
            });

        }

        req.usuario = decoded.usuario;

        next();


    });

};


module.exports = {
    verificaToken,
    verificaAdmin_Role
}