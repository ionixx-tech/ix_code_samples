/*
 *@desc: The unit testing is used to check the contract 
 * which is used for the purpose of approving the transaction 
 * by multiple owners using MultiSig Concept
 */
var MultiSignature = artifacts.require("./MultiSignature.sol");

/*
      * @unit_test: a constructor to given a list of owners as an argument and initialized
    */

contract('MultiSignature', function (accounts) {
    it("should create admin accounts in the  MultiSignature", function () {
        return MultiSignature.deployed().then(function (instance) {
        })
    });

    /*
      * @unit_test: Returns the Admin Owners list
      */
    it("should return all the admin accounts", function () {
        return MultiSignature.deployed().then(function (instance) {
            return instance.adminList.call();
        }).then(function (balance) {
            console.log(balance);// displays the admin list
            assert.equal(balance, accounts[0], "There are exactly 1 in the owner list"); // checks whether the returned admin is equal or not
        });
    });


    /*
     * @unit_test: Creation of Additional Owners to the owners list and map with the boolean value
     * @param: accounts[1] => Address of the new Admin to added
     */

    it("should add all the admin accounts", function () {
        return MultiSignature.deployed().then(function (instance) {
            return instance.addAdmin(accounts[1]) // list of admin accounts to be passed
        });
    });

    /*
        * @unit_test: Returns the Admin Owners list
        */

    it("print all the admin accounts", function () {
        return MultiSignature.deployed().then(function (instance) {
            return instance.adminList.call();
        }).then(function (balance) {
            console.log(balance);// displays the admin list
        })
    });


    /*
    * @unit_test: Removal of the Owner from the Owner list Done by any one of the Other Owner but not themself
    * @param: accounts[1] => Address of the admin to be removed
    */
    it("should remove the admin from the given accounts", function () {
        return MultiSignature.deployed().then(function (instance) {
            return instance.removeAdmin(accounts[1])  // admin account to be removed
        });
    });

    /*
     * @unit_test: Returns the Admin Owners list
     */

    it("print all the admin accounts", function () {
        return MultiSignature.deployed().then(function (instance) {
            return instance.adminList.call();
        }).then(function (balance) {
            console.log(balance);// displays the admin list
        })
    });


    /*
   * @unit_test: Assigning the Root Admin Address to the superadmin
   * @param: accounts[2] => Address of the Super Admin
   */
    it("should set the root admin", function () {
        return MultiSignature.deployed().then(function (instance) {
            return instance.setAdmin(accounts[2]) // address to be passed to set the root admin address
        });
    });

    /*
    * @unit_test: fund function is used to invest a particular amount to the owner
    * @return: true if fund is transferred , false otherwise
    */
    it("Fund raised by the investor", function () {
        return MultiSignature.deployed().then(function (instance) {
            return instance.fund({from: accounts[1], value: 100}) // needs to send the value and the sender address
        });
    });

    /*
     *@unit_test:  Returns the total amount that the investor invested to the owner
     * @return: value
     */
    it("Balance of the investor", function () {
        return MultiSignature.deployed().then(function (instance) {
            return instance.getinvestedBalance.call(accounts[1]); // passing the investor address to fetch invested amount 
        }).then(function (balance) {
            console.log(balance); //displays the amount invested by the investor
        })
    });

    /*
    * @unit_test: Returns the investor list
    */
    it("investor List", function () {
        return MultiSignature.deployed().then(function (instance) {
            return instance.investorList.call();
        }).then(function (balance) {
            console.log(balance); // displays the investor list
        })
    });

    /*
   * @unit_test: investor will send a request to withdraw a particular amount
   * @param: amt => amount to be withdraw
   * @param: data => reason for withdraw
   * @return: transaction hash generated
   */
    it("Withdraw Request send by the investor", function () {
        return MultiSignature.deployed().then(function (instance) {
            return instance.withdraw(50, "Expenditure", {from: accounts[1]}) // need to pass amount and data with the sender addres  to the contract
        }).then(function (balance) {
            console.log(balance); // returns the transaction hash generated for the withdraw request
        })
    });


    /*
    * @unit_test: get transaction list of the particular investor
    * @param: invest => address of the investor
    * @return: list of transaction hash for the particular investor
    */
    it("Transaction list", function () {
        return MultiSignature.deployed().then(function (instance) {
            return instance.transactList.call(accounts[1]); // passing the investor address to fetch withdraw request list
        }).then(function (balance) {
            console.log(balance);
        })
    });

    /*
    * @unit_test: get details of the particular transaction
    * @param: Transaction hash mapped to the transaction
    * @return: Details of the transaction
    */
    it("Transaction details", function () {
        return MultiSignature.deployed().then(function (instance) {
            return instance.getdetails.call('0x483109c37b6c86132574e9cd99d463b31831c07a89f33e96ee2b05ec500e0655'); // passing  transaction hash  to fetch the details of the particular transaction
        }).then(function (balance) {
            console.log(balance);
        })
    });

    /*
    * @unit_test:  Check the owners approval and if all owner's approved, requested amount will be transferred
    * @param: invest => Transaction hash
    */
    it("Confirming the txn", function () {
        return MultiSignature.deployed().then(function (instance) {
            return instance.confirm('0x483109c37b6c86132574e9cd99d463b31831c07a89f33e96ee2b05ec500e0655');  // passing  transaction hash  to be approved by the owner
        });
    });

    /*
     * @unit_test: Returns the status of the transaction
     * @return: boolean value
    */
    it("status of the txn", function () {
        return MultiSignature.deployed().then(function (instance) {
            return instance.getstatus.call('0x483109c37b6c86132574e9cd99d463b31831c07a89f33e96ee2b05ec500e0655'); // passing  transaction hash  to get the status of the transaction
        }).then(function (balance) {
            console.log(balance);
        })
    });
    /*
       * @unit_test: Returns the total amount of balance which the owner had
       * @return: total value
       */
    it("Total Balance of the Group", function () {
        return MultiSignature.deployed().then(function (instance) {
            return instance.getTotalBalance.call();
        }).then(function (balance) {
            console.log(balance); // displays the total balance of the contract or the admin group
        })
    });
    /*
         * @unit_test: Returns the Transaction list
         * @return: list of transaction hash values
         */

    it("Get Successful transaction list", function () {
        return MultiSignature.deployed().then(function (instance) {
            return instance.getlist.call();
        }).then(function (balance) {
            console.log(balance); //displays the list of transactiobn hash
        })
    });

    /*
     * @unit_test: Returns the number of investors
     * @return: value
     */
    it("Get  investor count ", function () {
        return MultiSignature.deployed().then(function (instance) {
            return instance.getinvestorcount.call();
        }).then(function (balance) {
            console.log(balance); //displays the number of investors
        })
    });
    /*
      * @unit_test: Returns the number of successful transactions
      * @return: value
      */
    it("Get Successful transaction count", function () {
        return MultiSignature.deployed().then(function (instance) {
            return instance.successtransact.call();
        }).then(function (balance) {
            console.log(balance); // displays the number of successfull transactions
        })
    });

    /*
     * @unit_test: If need to destroy the contract , the total amount will be 
     * transferred to the super admin address and the contract will be closed
     */
    it("Destroying the contract", function () {
        return MultiSignature.deployed().then(function (instance) {
            return instance.destroy.call();
        });
    });
});


