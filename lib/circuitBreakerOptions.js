/*
  Author: Jagdish21
  github: https://github.com/jagdish21
*/
module.exports = {
    circuitBreakerConfig: {
        timeout: 5000,
        errorThreshold: 50,
        resetTimeout: 10000,
        maxFailures: 3
    }
}