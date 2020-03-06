module.exports = {
    networks: {
        development: {
            host: '127.0.0.1',
            port: 7545,
            network_id: '*', // Any network
        },
        ropsten: {
            host: 'localhost',
            port: 8545,
            network_id: 3,
            gas: 4700000,
        },
    },
};
