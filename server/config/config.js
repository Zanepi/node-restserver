//===============
//Puerto
//===============
process.env.PORT = process.env.PORT || 3000;

//===============
//Entorno
//===============
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//===============
//Vencimiento del token
//===============
//60 seg
//60 min
//24 hrs
//30 dias
//process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
process.env.CADUCIDAD_TOKEN = '48h';


//===============
//SEED Autenticacion
//===============
process.env.SEED = process.env.SEED || 'dev-seed';

//===============
//URL Mongo
//===============
let urlDB = process.env.NODE_ENV === 'dev' ?
    'mongodb://localhost:27017/cafe' : process.env.MONGO_URI;

process.env.URLDB = urlDB;


//===============
//Google Client ID
//===============
process.env.CLIENT_ID = process.env.CLIENT_ID || '494068384023-3a2hm4nsc80rr7465e1ke1v7cqaj8rhr.apps.googleusercontent.com'