# Circuit Breaker Node
Circuit breaker library plugin for Node, express and sequelize with working API example.

## Installation
To install the package, run:
```bash
npm install circuit-breaker-node

```

## Example to use this plugin with Node.js express, SQL server.
```bash
const express = require('express');
const Sequelize = require('sequelize');
const CircuitBreaker = require('./lib/circuitBreaker');
const circuitBreakerOptions = require ('./lib/circuitBreakerOptions');

const app = express();
const port = 4000;

const sequelize = new Sequelize('mssql://userName:password@hostname:1433/database');

async function executeStoredProcedure(mobile) {
    let sqlInlineQuery = ` SELECT * FROM users with(nolock) where mobile='${mobile}'`;
    const result = await sequelize.query(sqlInlineQuery, {
        replacements: { mobile }
    });
    return result;
}
// Create a instance for circuit breaker
const circuitBreaker = new CircuitBreaker(executeStoredProcedure, circuitBreakerOptions);

// Define a route/API that uses the circuit breaker
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
