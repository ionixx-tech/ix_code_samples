var MultiSignature = artifacts.require("./MultiSignature.sol");
module.exports = function (deployer, network, accounts) {
    const userAddress = accounts[0];
    deployer.deploy(MultiSignature, [userAddress])
};
