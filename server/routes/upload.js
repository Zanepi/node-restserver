const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');


// default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo,
        id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo para cargar'
            }
        });
    }


    //Valida tipo
    let tiposValidos = ['productos', 'usuarios']

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos.join(', '),

            }
        });
    }


    let archivo = req.files.archivo;

    //Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    let nombreArchivo = archivo.name.split('.');
    let extension = nombreArchivo[nombreArchivo.length - 1];
    console.log(extension);

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'las extensiones permitidas son ' + extensionesValidas.join(', ')
            }

        })
    }

    //cambiar nombre al archivo
    let filename = `${id}-${new Date().getMilliseconds()}.${extension}`;
    // console.log(filename);

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${filename}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });


        //la imagen ya esta cargada

        switch (tipo) {
            case 'usuarios':
                imagenUsuario(id, res, filename);
                break;
            case 'productos':
                imagenProducto(id, res, filename);
                break;
        }


    });

});


function imagenUsuario(id, res, filename) {
    Usuario.findById(id, (err, usuarioBD) => {
        if (err) {
            borraArchivo(filename, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioBD) {
            borraArchivo(filename, 'usuarios');

            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }


        borraArchivo(usuarioBD.img, 'usuarios');

        usuarioBD.img = filename;

        usuarioBD.save((err, usuarioAct) => {

            res.json({
                ok: true,
                usuario: usuarioAct,
                img: filename
            });

        })
    });
}

function imagenProducto(id, res, filename) {
    Producto.findById(id, (err, productoBD) => {
        if (err) {
            borraArchivo(filename, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoBD) {
            borraArchivo(filename, 'usuarios');

            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }


        borraArchivo(productoBD.img, 'productos');

        productoBD.img = filename;

        productoBD.save((err, productoAct) => {

            res.json({
                ok: true,
                usuario: productoAct,
                img: filename
            });

        })
    });
}

function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;