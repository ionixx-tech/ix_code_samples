var ionixx_token = artifacts.require("./IonixxToken.sol");
var crowd_sale = artifacts.require("./IonixxPreIco.sol");

var token_total_supply = 1000000000000;
var token_name = "Ionixx";
var token_symbol = "IX";
module.exports = function (deployer, network, accounts) {

    deployer.deploy(ionixx_token, token_total_supply, token_name, token_symbol).then(function () {
        return deployer.deploy(crowd_sale, ionixx_token.address);
    });
};