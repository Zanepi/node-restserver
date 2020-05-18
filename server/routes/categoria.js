const express = require('express');
const Categoria = require('../models/categoria');
let { verificaToken, verificaAdmin_Role } = require('../middlewares/auth');

let app = express();

let categoria = require('../models/categoria');


//===================
//Mostrar categorias
//===================
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }



            res.json({
                ok: true,
                categorias
            })
        });

});


//========================
//Mostrar categoria por ID
//========================
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id

    Categoria.findById(id, (err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'el id indicado no retorna ninguna categoria'
                }
            })
        }



        res.json({
            ok: true,
            categoriaBD
        })
    });


});


//===================
//Crear nueva categorias
//===================
app.post('/categoria', verificaToken, (req, res) => {

    //regresar la nueva categoria
    //req.usuario._id
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    });

});


//===================
//actualizar categorias
//===================
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    }


    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});



//===================
//Borrar categoria
//===================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    //solo admin
    //pedir token
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El id no existe'
                    }
                })
            }
        }

        res.json({
            ok: true,
            message: 'Categoria Borrada'
        })

    });


});



module.exports = app;