var ionixx_token = artifacts.require('./IonixxToken.sol');
var crowdsale = artifacts.require('./IonixxPreIco.sol');
contract('IonixxToken', function (accounts) {

    /*
      Unit_test: Deploy Token contract
    */
    it("Deploy Token contract", function () {
        return ionixx_token.deployed().then(function (instance) {
        });
    });

    /*
      Unit_test: Deploy Crowdsale contract
    */
    it("Deploy crowdsale contract", function () {
        return crowdsale.deployed().then(function (instance) {
        });
    });

    /*
      Unit_test:Send Token to crowdsale contract address
      @param: Number of tokens to be transferred.
    */
    it("send token to crowdsale contract", function () {
        var crowdsale_address;
        return crowdsale.deployed().then(function (instance) {
            crowdsale_address = crowdsale.address;
            return ionixx_token.deployed().then(function (i_instance) {
                return i_instance.transfer(crowdsale_address, 10000000000000000000000).then(function () {
                });
            });
        });
    });

    /*
      Unit_test: Checking crowdsale is active
    */
    it("Checking crowdsale is active", function () {
        return crowdsale.deployed().then(function (instance) {
            return instance.isActive.call().then(function (result) {
                console.log(result);
                // assert.equal(true,result,"Crowdsale contract validation failed");
            });
        });
    });

    /**
     Unit_test: Buy token
     @param: from => From which account the token should be bought.
     @param: value=> Number of Token to be bought.
     */
    it("Buy token", function () {
        return crowdsale.deployed().then(function (instance) {
            return instance.buyTokens({from: accounts[2], value: 1000}).then(function (result) {
                console.log(result);
            }).catch(function (error) {
                console.log(error);
            });
        });
    });

    /*
      Unit_test: Checks whether the goal amount is reached
      @return: returns whether goal or reached
    */
    it("Checks whether the target amount is reached", function () {
        return crowdsale.deployed().then(function (instance) {
            return instance.goalReached.call().then(function (result) {
                if (result == true) {
                    console.log("Goal Reached");
                }
                else {
                    console.log("Goal Not Reached");
                }
            });
        });
    });

    /*
      Unit_test: Buy Token
      @param: from=> From which account the token should be bought
      @param: value => Number of tokens to be bought
    */
    it("buy token", function () {
        return ionixx_token.deployed().then(function (instance) {
            return instance.buy({from: accounts[3], value: 1000000000000000000}).then(function (amount) {
                console.log(amount);

            });
        })
    });

    /*
      Unit_test: Sell Token
      @param: from=> From which account the token to be sold.
      @param: 1000 => Number of tokens to be sold.
    */
    it("sell token", function () {
        return ionixx_token.deployed().then(function (instance) {
            return instance.sell(1000, {from: accounts[3]}).then(function (amount) {
                console.log("sell", amount);
            });
        })
    });

});