const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const controller = require('./Database/controller');
const crudRoutes = require('./Database/controller').router;


const app = express();
const port = process.env.PORT || 3000;

/*Configurations for JSON*/
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.json());


// Usar las rutas definidas en el router del controller
app.use(controller.router);

/*Routes*/
app.post('/additionalMovements', controller.GetAdditionalAccountMovement);
app.post('/masterMovements', controller.GetMasterAccountMovements);
app.post('/subAccountStatement', controller.GetSubAccountStatements);
app.post('/masterAccountStatement', controller.ShowMasterAccountStatement);
app.post('/physicalCard', controller.ShowPhysicalCard);
app.post('/login', controller.login);

// Servir archivos estáticos desde la carpeta 'Busqu_Inte'
app.use(express.static(path.join(__dirname, 'Busqu_Inte')));

// Manejar la solicitud GET para 'Busqueda3.html'
app.get('/busqueda3', (req, res) => {
    res.sendFile(path.join(__dirname, 'Busqu_Inte', 'Busqueda3.html'));
});


// Servir archivos estáticos desde la carpeta 'Cruds'
app.use(express.static(path.join(__dirname, 'Cruds')));
// Manejar la solicitud GET para 'crud.html'
app.get('/crud', (req, res) => {
    res.sendFile(path.join(__dirname, 'Cruds', 'crud.html'));
});



/*Start server*/
app.listen(port, () => {
    console.log(`Conectado al servidor en el puerto ${port}`);
});