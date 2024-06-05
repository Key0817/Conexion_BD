const sql = require('mssql');

/*
Config for connect to database
*/ 
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

/*
Function to connect to the database
*/ 
async function getConnection() {
    try {
        const pool = await sql.connect(dbSettings);
        return pool;
    } catch (error) {
        console.error(error);
    }
}

module.exports = { getConnection };
