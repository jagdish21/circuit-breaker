/*
  Author: jagdish2157@gmail.com
  github: https://github.com/jagdish21
*/
class CircuitBreaker {
    constructor(executeFunction, options = {}) {
        this.executeFunction = executeFunction;
        this.failureCount = 0;
        this.successCount = 0;
        this.state = 'CLOSED'; // Possible states: 'CLOSED', 'OPEN', 'HALF_OPEN'
        this.options = Object.assign({
            timeout: 5000, // Timeout for each call
            errorThreshold: 50, // Percentage of failed requests to open the circuit
            resetTimeout: 10000, // Time before trying to close the circuit again
            maxFailures: 5 // Number of failures before opening the circuit
        }, options);
    }

    async fire(...args) {
        if (this.state === 'OPEN') {
            console.log('Circuit is open. Rejecting request.');
            return Promise.reject('Circuit is open');
        }

        try {
            if (this.state === 'HALF_OPEN') {
                console.log('Trying request in half-open state.');
            }
            const result = await this.executeFunction(...args);
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            throw error;
        }
    }

    onSuccess() {
        this.failureCount = 0;
        if (this.state === 'HALF_OPEN' || this.state === 'OPEN') {
            this.state = 'CLOSED';
            console.log('Circuit closed again');
        }
    }

    onFailure() {
        this.failureCount++;
        console.log(`Failure count: ${this.failureCount}`);
        if (this.failureCount >= this.options.maxFailures) {
            this.openCircuit();
        }
    }

    openCircuit() {
        this.state = 'OPEN';
        console.log('Circuit opened');
        setTimeout(() => this.halfOpenCircuit(), this.options.resetTimeout);
    }

    halfOpenCircuit() {
        this.state = 'HALF_OPEN';
        console.log('Circuit is half-open');
    }
}

// Export the CircuitBreaker class
module.exports = CircuitBreaker;
