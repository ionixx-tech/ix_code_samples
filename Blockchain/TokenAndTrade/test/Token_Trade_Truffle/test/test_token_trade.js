var ionixx_token = artifacts.require('./IonixxToken.sol');
var crowdsale = artifacts.require('./IonixxPreIco.sol');

contract('IonixxToken', function (accounts) {

    /*
        Unit_Test: Set sale address to Token contract
    */
    var crowdsale_address;
    it("Set sale address", function () {

        return crowdsale.deployed().then(function (instance) {
            crowdsale_address = crowdsale.address;
            return ionixx_token.deployed().then(function (i_instance) {
                return i_instance.set_saleaddress(crowdsale_address).then(function () {
                    console.log("crowdsale", crowdsale_address);
                });
            });
        });
    });

    /*
        Unit_Test: Buy Coin after ico ends
        @param: from => From which account the token to be bought
        @param: value=> Number of Token to be bought
    */
    it("Buy Coin after ico ends", function () {
        return ionixx_token.deployed().then(function (instance) {
            return instance.buy_coin(2, {from: accounts[4], value: 2000000000000000000}).then(function (result) {
                console.log(result);
            }).catch(function (error) {
                console.log("Exception")
            });
        });
    });

    /*
        Unit_Test: Sell coin after ico ends
        @param: from =>  From which account the token to be sold
        @param: 1 =>Number of token to be sold
    */
    it("sell coin if sale is active, it returns exception", function () {
        return ionixx_token.deployed().then(function (instance) {
            return instance.sell_coin(1, {from: accounts[4]}).then(function (result) {
                console.log(result);
            }).catch(function (error) {
                console.log("Exception")
            });
        });
    });

    /*
        Unit_Test: Bid amount to be sold
        @param:from => From which account the bidding is to be occured.
        @param: value => Amount to be bidded.
        @return transaction reference ID
    */
    var bid_transaction_1;
    it("Bid order if sale is active, it returns exception", function () {
        return ionixx_token.deployed().then(function (instance) {
            return instance.bit_order(2, {from: accounts[5], value: 2000000000000000000}).then(function (result) {
                console.log(result);
                bid_transaction_1 = result.toNumber();
            }).catch(function (error) {
                console.log("Exception")
            });
        });
    });

    /*
        Unit_Test: Sell the bidded amount
        @param: transaction reference ID
    */
    it("sell coin if sale is active, it returns exception", function () {
        return ionixx_token.deployed().then(function (instance) {
            return instance.sell_coin(bid_transaction_1, {from: accounts[5]}).then(function (result) {
                console.log(result);
            }).catch(function (error) {
                console.log("Exception")
            });
        });
    });


    /*
        Unit_Test: Ask order to be bought
        @param: from => From which account the transaction to be happen.
        @param: value => Amount to be bought
        @return:transaction reference ID
    */
    var ask_transaction_1;
    it("ask order if sale is active, it returns exception", function () {
        return ionixx_token.deployed().then(function (instance) {
            return instance.ask_order(2, 1, {from: accounts[5], value: 2000000000000000000}).then(function (result) {
                console.log(result);
                ask_transaction_1 = result.toNumber();
            }).catch(function (error) {
                console.log("Exception")
            });
        });
    });

    /*
        Unit_Test: Buy the asked amount
        @param: from=> From which account the amount to be deposited
        @param: value=> Number of coin to be bought

    */
    it("buy coin if sale is active, it returns exception", function () {
        return ionixx_token.deployed().then(function (instance) {
            return instance.buy_coin(ask_transaction_1, {
                from: accounts[5],
                value: 2000000000000000000
            }).then(function (result) {
                console.log(result);
            }).catch(function (error) {
                console.log("Exception")
            });
        });
    });


    /*
        Unit_Test: Bid amount to be sold
        @param:from => From which account the bidding is to be occured.
        @param: value => Amount to be bidded.
        @return transaction reference ID
    */
    var bid_transaction_2;
    it("Bid order if sale is active, it returns exception", function () {
        return ionixx_token.deployed().then(function (instance) {
            return instance.bit_order(2, {from: accounts[5], value: 2000000000000000000}).then(function (result) {
                console.log(result);
                bid_transaction_2 = result.toNumber();
            }).catch(function (error) {
                console.log("Exception")
            });
        });
    });

    /*
        Unit_Test: Cancel Bid Amount
        @param: bid_transaction_2 => Transaction reference ID
        @param:from => From which account the cancel bidding is to be occured.
    */

    it("cancel bid order if sale is active, it returns exception", function () {
        return ionixx_token.deployed().then(function (instance) {
            return instance.cancelBitOrder(bid_transaction_2, {from: accounts[5]}).then(function (result) {
                console.log(result);
            }).catch(function (error) {
                console.log("Exception")
            });
        });
    });

    /*
        Unit_Test: Ask order to be bought
        @param: from => From which account the transaction to be happen.
        @param: value => Amount to be bought
        @return:transaction reference ID
    */
    var ask_transaction_2;
    it("ask order if sale is active, it returns exception", function () {
        return ionixx_token.deployed().then(function (instance) {
            return instance.ask_order(2, 1, {from: accounts[5], value: 2000000000000000000}).then(function (result) {
                console.log(result);
                ask_transaction_2 = result.toNumber();
            }).catch(function (error) {
                console.log("Exception")
            });
        });
    });

    /*
        Unit_Test: Cancel Ask Order
        @param: ask_transaction_2 => Transaction reference ID
        @param:from => From which account the cancel ask order is to be occured.
    */

    it("cancel ask order if sale is active, it returns exception", function () {
        return ionixx_token.deployed().then(function (instance) {
            return instance.cancelAskOrder(ask_transaction_2, {from: accounts[5]}).then(function (result) {
                console.log(result);
            }).catch(function (error) {
                console.log("Exception")
            });
        });
    });
});