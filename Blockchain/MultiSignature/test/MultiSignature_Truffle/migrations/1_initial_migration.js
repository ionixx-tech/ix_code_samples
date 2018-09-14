var migrations = artifacts.require("./Migrations.sol");
module.exports = function (deployer, network, accounts) {
    deployer.deploy(migrations);
};
