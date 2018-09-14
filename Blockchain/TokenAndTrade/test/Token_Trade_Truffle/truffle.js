module.exports = {
    networks: {
        development: {
            host: "192.168.1.32",   // Ethereum IP Address
            port: 8545,   // Ethereum Port Number
            network_id: "*",  // To match any network ID
            gas: 3000000 // To process maximum gas usage scenario
        }
    }
};
