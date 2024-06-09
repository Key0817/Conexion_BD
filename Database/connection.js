const sql = require('mssql');

/*Config for connect to database*/ 
const dbSettings = {      
    user: 'sa',                    
    password: '1231231234',
    server: 'KEYLOR23-PC',
    database: 'Pizzahat1',
    port: 1433,
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
};

/*Function to connect to the database*/ 
async function getConnection() {
    try {
        const pool = await sql.connect(dbSettings);
        return pool;
    } catch (error) {
        console.error(error);
    }
}

async function executeStoredProcedure(procedureName, inputParams) {
    try {
        const pool = await getConnection();
        const request = pool.request();

        for (const param in inputParams) {
            if (inputParams.hasOwnProperty(param)) {
                request.input(param, inputParams[param]);
            }
        }

        const result = await request.execute(procedureName);
        return result.recordset;
    } catch (err) {
        console.error('Error SQL', err);
        throw err;
    }
}

module.exports = { getConnection, executeStoredProcedure};