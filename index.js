/*
  Author: Jagdish21
  github: https://github.com/jagdish21
*/
const express = require('express');
const Sequelize = require('sequelize');
const CircuitBreaker = require('./lib/circuitBreaker');
const circuitBreakerOptions = require ('./lib/circuitBreakerOptions');

const app = express();
const port = 4000;


/* Configure Sequelize: Please replace userName, password, hostname and database name with your actual credentials */
const sequelize = new Sequelize('mssql://userName:password@hostname:1433/database');

async function executeStoredProcedure(mobile) {
    let sqlInlineQuery = ` SELECT * FROM users with(nolock) where mobile='${mobile}'`;
    /* let sqlStoreProcedure = "EXEC sqlStoreProcedureForGetUser @mobile = :mobile"; */
    /* You may use inline query and SQL store procedures, replace sqlInlineQuery with sqlStoreProcedure */
    const result = await sequelize.query(sqlInlineQuery, {
        replacements: { mobile }
    });
    return result;
}
// Create a circuit breaker instance
const circuitBreaker = new CircuitBreaker(executeStoredProcedure, circuitBreakerOptions);

// Define a route that uses the circuit breaker
app.get('/userdetails', async (req, res) => {
    const { mobile } = req.query;

    try {
        const result = await circuitBreaker.fire( mobile);
        res.send(result);
    } catch (error) {
        res.status(500).send('Service unavailable');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});