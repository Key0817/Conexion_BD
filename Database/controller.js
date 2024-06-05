const express = require('express');
const { getConnection } = require('./connection');

/*
Function to call stored procedures
*/
const callStoredProcedure = async (procedureName, inputs, outputs, res) => {
    try {
        const pool = await getConnection();
        const request = pool.request();

        // Add inputs to request
        for (const input of inputs) {
            request.input(input.name, input.value);
        }

        // Add outputs to request
        for (const output of outputs) {
            request.output(output.name, output.value);
        }

        const result = await request.execute(procedureName);
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const GetAdditionalAccountMovement = (req, res) => {
    const inputs = [
        { name: 'inIdSubAccountState', value: req.body.inIdSubAccountState },
        { name: 'inPhysicalCardCode', value: req.body.inCardCode },
        { name: 'inUsername', value: req.body.inUsername },
        { name: 'inPostIp', value: req.body.inPostIp },
    ];
    const outputs = [{ name: 'outResultCode', value: 0 }];

    callStoredProcedure('GetAdditionalAccountMovement', inputs, outputs, res);
};

const GetMasterAccountMovements = (req, res) => {
    const inputs = [
        { name: 'inIdAccountState', value: req.body.inIdAccountState },
        { name: 'inUsername', value: req.body.inUsername },
        { name: 'inPostIp', value: req.body.inPostIp },
    ];
    const outputs = [{ name: 'outResultCode', value: 0 }];

    callStoredProcedure('GetMasterAccountMovements', inputs, outputs, res);
};

const GetSubAccountStatements = (req, res) => {
    const inputs = [
        { name: 'inPhysicalCardCode', value: req.body.inCardCode },
        { name: 'inUsername', value: req.body.inUsername },
        { name: 'inPostIp', value: req.body.inPostIp },
    ];
    const outputs = [{ name: 'outResultCode', value: 0 }];

    callStoredProcedure('GetSubAccountStatements', inputs, outputs, res);
};

const ShowMasterAccountStatement = (req, res) => {
    const inputs = [
        { name: 'inTFCode', value: req.body.inCardCode },
        { name: 'inUsername', value: req.body.inUsername },
        { name: 'inPostIp', value: req.body.inPostIp },
    ];
    const outputs = [{ name: 'outResultCode', value: 0 }];

    callStoredProcedure('ShowMasterAccountStatement', inputs, outputs, res);
};

const ShowPhysicalCard = (req, res) => {
    const inputs = [
        { name: 'inUsername', value: req.body.inName },
        { name: 'inPostIp', value: req.body.inPostIp },
    ];
    const outputs = [{ name: 'outResultCode', value: 0 }];

    callStoredProcedure('ShowPhysicalCard', inputs, outputs, res);
};

const login = async (req, res) => {
    const inputs = [
        { name: 'inUser', value: req.body.inUser },
        { name: 'inPassword', value: req.body.inPassword },
        { name: 'inPostUser', value: req.body.inPostUser },
        { name: 'inPostIp', value: req.body.inPostIp },
    ];
    const outputs = [
        { name: 'outLoginSuccess', value: 0 },
        { name: 'outResultCode', value: 0 },
    ];

    try {
        const pool = await getConnection();
        const request = pool.request();

        // Add inputs to request
        for (const input of inputs) {
            request.input(input.name, input.value);
        }

        // Add outputs to request
        for (const output of outputs) {
            request.output(output.name, output.value);
        }

        const result = await request.execute('Login');
        if (result.output.outResultCode === 0 && result.output.outLoginSuccess === 0) {
            res.json({
                access: 'Login Exitoso',
                message: 'Inicio de sesión exitoso',
            });
        } else {
            res.json({
                access: 'Login Fallido',
                message: 'Usuario o contraseña incorrectos',
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }   
};

const obtenerClientes = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT [Nombre ], [Apellido 1], [Apellido 2] FROM PRUEBAS');
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const router = express.Router();

// Ruta para obtener clientes
router.get('/clientes', obtenerClientes);
module.exports = {
    callStoredProcedure,
    GetAdditionalAccountMovement,
    GetMasterAccountMovements,
    GetSubAccountStatements,
    ShowMasterAccountStatement,
    ShowPhysicalCard,
    login,
    obtenerClientes, // Asegúrate de exportar esta función también
    router,
};
