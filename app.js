// const express = require('express');
// const controller = require('./Database/controller');
// const bodyParser = require('body-parser');
// const morgan = require('morgan');
// const cors = require('cors');

// const app = express();
// const port = 3000;

// /*
// Configurations for JSON
// */ 
// app.use(cors());
// app.use(morgan('dev'));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.json());

// /*
// Routes
// */
// app.post('/additionalMovements', controller.GetAdditionalAccountMovement);
// app.post('/masterMovements', controller.GetMasterAccountMovements);
// app.post('/subAccountStatement', controller.GetSubAccountStatements);
// app.post('/masterAccountStatement', controller.ShowMasterAccountStatement);
// app.post('/physicalCard', controller.ShowPhysicalCard);
// app.post('/login', controller.login);
// app.get('/customers', controller.getCustomers);


// /*
// Start server
// */
// app.listen(port, () => {
//     console.log(`Conectado al servidor en el puerto ${port}`);
// });


const express = require('express');
const controller = require('./Database/controller');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path'); // Importa el módulo 'path' para manejar rutas de archivos

const app = express();
const port = 3000;

/*
Configurations for JSON
*/ 
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

/*
Routes
*/
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

/*
Start server
*/
app.listen(port, () => {
    console.log(`Conectado al servidor en el puerto ${port}`);
});
