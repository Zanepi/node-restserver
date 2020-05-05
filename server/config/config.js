//===============
//Puerto
//===============
process.env.PORT = process.env.PORT || 3000;

//===============
//Entorno
//===============
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===============
//Entorno
//===============
let urlDB = process.env.NODE_ENV === 'dev' ?
    'mongodb://localhost:27017/cafe' : 'mongodb+srv://challenger:u1Mt9cORqKUJ5WJA@zanepidev-a4kdp.azure.mongodb.net/test';

process.env.URLDB = urlDB;