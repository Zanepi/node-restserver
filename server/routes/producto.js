const express = require('express');
const { verificaToken } = require('../middlewares/auth');


let app = express();

let Producto = require('../models/producto');

//====================================
//Obtener productos
//====================================

app.get('/productos', (req, res) => {
    //traer todos los productos
    //populate: usuario categoria
    //paginado
    Producto.find({})
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }



            res.json({
                ok: true,
                productos
            });
        });


});



//====================================
//Obtener productos por ID
//====================================

app.get('/productos/:id', (req, res) => {
    //populate: usuario categoria
    let id = req.params.id

    Producto.findById(id, (err, productoBD) => {
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
            productoBD
        })
    });


});


//====================================
// Buscar productos
//====================================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regexp = new RegExp(termino, 'i');

    Producto.find({ nombre: regexp })
        .populate('catefgoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }



            res.json({
                ok: true,
                productos
            })
        });





});

//====================================
//Crear producto
//====================================

app.post('/productos', verificaToken, (req, res) => {
    //grabar usuario
    //grabar categoria del listado
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni, //{ type: Number, required: [true, 'El precio únitario es necesario'] },
        descripcion: body.descripcion, //{ type: String, required: false },
        disponible: true, //{ type: Boolean, required: true, default: true },
        categoria: body.categoria, //{ type: Schema.Types.ObjectId, ref: 'Categoria', required: true },
        usuario: req.usuario._id, //{ type: Schema.Types.ObjectId, ref: 'Usuario' }
    });

    producto.save((err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoBD) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
        }

        res.json({
            ok: true,
            producto: productoBD
        })

    });



});

//====================================
//Actualizar un  producto
//====================================

app.put('/productos/:id', (req, res) => {
    //populate: usuario categoria
    //paginado
    let id = req.params.id;
    let body = req.body;

    // let descCategoria = {
    //     descripcion: body.descripcion
    // }


    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoBD
        });
    });



});



//====================================
//Borrar un  producto
//====================================

app.delete('/productos/:id', (req, res) => {
    //mantener objeto
    //cambiar disponibilidad a false
    let id = req.params.id

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true, runValidators: true }, (err, productoBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoBD
        });
    });

});


module.exports = app;