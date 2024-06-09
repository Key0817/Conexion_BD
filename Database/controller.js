const express = require('express');
const { getConnection } = require('./connection');
const {executeStoredProcedure} = require('./connection');

/*Function to call stored procedures*/
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
        const result = await pool.request().query("SELECT p.[Nombre ], p.[Apellido 1], p.[Apellido 2], pl.[Canton] FROM [dbo].[PADRON] p JOIN [dbo].[places] pl ON p.[Mesa Electoral] = pl.[Codigo] WHERE pl.[Canton] = 'Golfito';");
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


const router = express.Router();

// Obtener detalles de un pedido
router.get('/pedidos/:pedidoID', async (req, res) => {
    try {
        const pedidoID = parseInt(req.params.pedidoID);
        const result = await executeStoredProcedure('ObtenerDetallesPedido', { PedidoID: pedidoID });
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Crear un nuevo pedido
router.post('/pedidos', async (req, res) => {
    try {
        const { Estado, Fecha, ClienteID, SucursalID, MetodoPagoID, Total, NumeroFactura } = req.body;

        const result = await executeStoredProcedure('CrearPedido', {
            Estado: Estado,
            Fecha: Fecha,
            ClienteID: ClienteID,
            SucursalID: SucursalID,
            MetodoPagoID: MetodoPagoID,
            Total: Total,
            NumeroFactura: NumeroFactura
        });

        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Actualizar estado de un pedido
router.put('/pedidos/:pedidoID', async (req, res) => {
    try {
        const pedidoID = parseInt(req.params.pedidoID);
        const { Estado, Fecha } = req.body;

        const result = await executeStoredProcedure('ActualizarPedido', {
            PedidoID: pedidoID,
            Estado: Estado,
            Fecha: Fecha
        });

        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Eliminar un pedido
router.delete('/pedidos/:pedidoID', async (req, res) => {
    try {
        const pedidoID = parseInt(req.params.pedidoID);

        const result = await executeStoredProcedure('EliminarPedido', { PedidoID: pedidoID });
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});



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
    obtenerClientes,
    router
};