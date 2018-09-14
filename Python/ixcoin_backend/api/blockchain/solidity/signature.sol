pragma solidity ^0.4.23;

/*
 *@desc: This contract used for the purpose of approving
 *the transaction by multiple owners using MultiSig Concept
 */

contract WithdrawalContract {

    uint256 public totalAmount;    //owner balance
    mapping(address => uint) public investorMapping;    // mapping the investor with their invested amount
    mapping(address => bool) public ownersMapping;    // mapping the owner whether the owner is true of false which means active or not
    address private super_admin;        // Super admin address
    address[] public owners;    // Owner Address List
    address[] public investor;    // Investor address list
    /*
     * @desc:  Transaction Structure is used to store the transaction details.
     * @attributes : destination => Receiver Address
     * @attributes : value @params => Transferred Amount
     * @attributes : data  => Name for the Purpose of Transaction
     * @attributes : executed => Status of the Transaction
     * @attributes : approval => Number of Owners Approved will be mapped to true or false i.e. approved or rejected
    */

    struct Transaction {
        address destination;
        uint value;
        bytes data;
        bool executed;
        mapping(address => bool) approval;
    }

    mapping(bytes32 => Transaction) public transact;    // Transaction hash mapped for each transaction
    mapping(address => bytes32[]) public investorMap;    // Transaction hash for the transaction the investor invested
    mapping(address => bytes32[]) public investorsuccess;    // Transaction hash that has mapped to the investor if it is successfull
    bytes32[] public transactList;    // Total Transaction List
    bytes32[] public withdrawList;    // Once the investor requested , transaction hash will be stored

    /*
     * @desc: The following events are used to easy notification in the js
     */
    event AddAdmin(address acc);
    event RemoveAdmin(address acc);
    event TransactionHashGenerated(bytes32 txnhsh, address sender);

    /*
     * @desc: It is check whether the given address is owner or not
     */
    modifier isAnyOwner() {

        require(ownersMapping[msg.sender]);
        _;
    }

    /*
     * @desc: It is check whether the given address is not a owner or not
     */
    modifier isNotExistOwner(address acc){
        require(!ownersMapping[acc]);
        _;

    }


    /*
     * @desc:  It is check whether the given address and the sender is same or not
     */
    modifier isNotSame(address acc){
        require(acc != msg.sender);
        _;

    }


    /*
     * @desc: It is check whether the given address is not a owner or not
     */
    modifier isNotOwner(){
        require(!ownersMapping[msg.sender]);
        _;

    }

    /*
     * @desc: It is check whether the given address is  a investor or not
     */
    modifier isInvestor(address acc){
        require(investorMapping[acc] > 0);
        _;

    }

    /*
     * @desc: It is check whether the given value is within the limit or not
     */
    modifier isLimit(uint amt){
        require(amt <= investorMapping[msg.sender]);
        _;

    }

    /*
     * @desc: It is check whether the given value is owner or not
     */
    modifier isOwner(address acc){
        require(ownersMapping[acc]);
        _;
    }


    /*
     * @desc: It is a constructor to given a list of owners as an argument and initialized
     * @param: _owners => List of the Addresses who are referred as ADMIN
     */

    constructor(address[] _owners) payable public {
        require(_owners.length >= 1);
        for (uint i = 0; i < _owners.length; i++) {
            require(!ownersMapping[_owners[i]] && _owners[i] != 0);
            ownersMapping[_owners[i]] = true;
        }
        owners = _owners;
    }


    /*
     * @desc: Assigning the Root Admin Address to the superadmin
     * @param: super_admin => Address of the Super Admin
     */

    function setRootAdmin(address super_admin) public {
        require(owners.length == 0);
        super_admin = super_admin;
    }


    /*
     * @desc: Assigning the Root Admin Address to the superadmin
     * @param: super_admin => Address of the Super Admin
     */
    function setAdmin(address super_admin) isAnyOwner public {
        super_admin = super_admin;
    }


    /*
     * @desc: Creation of Additional Owners to the owners list and map with the boolean value
     * @param: _newAdmin => Address of the new Admin to added
     */

    function addAdmin(address _newAdmin) isAnyOwner isNotExistOwner(_newAdmin) public {
        owners.push(_newAdmin);
        ownersMapping[_newAdmin] = true;
        emit AddAdmin(_newAdmin);
        for (uint i = 0; i < transactList.length; i++)
        {
            if (transact[transactList[i]].executed == false)
            {
                delete transact[transactList[i]];
                delete transactList[i];
            }
        }
    }


    /*
     * @desc: Returns True if The given address is owner , false otherwise
     * @param: admin => Address of the sender to be checked
     */
    function isAdmin(address admin) public constant returns (bool) {
        return ownersMapping[admin];
    }


    /*
     * @desc: Removal of the Owner from the Owner list Done by any one of the Other Owner but not themself
     * @param: _rmAdmin => Address of the admin to be removed
     */
    function removeAdmin(address _rmAdmin) isAnyOwner isOwner(_rmAdmin) isNotSame(_rmAdmin) public {
        for (uint i = 0; i < owners.length; i++) {
            if (owners[i] == _rmAdmin) {
                delete owners[i];
                delete ownersMapping[_rmAdmin];
                owners.length--;
                emit RemoveAdmin(_rmAdmin);
                return;
            }
        }
    }



    /*
     * @desc: Returns the investor list
     */
    function investorList() public constant returns (address[]){
        return investor;
    }


    /*
     * @desc: Returns the Admin Owners list
     */
    function adminList() public constant returns (address[]){
        return owners;
    }

    /*
     * @desc: fund function is used to invest a particular amount to the owner
     * @return: true if fund is transferred , false otherwise
     */

    function fund() isNotOwner public payable returns (bool) {
        if (msg.value <= 0) {
            return false;
        }
        totalAmount += msg.value;
        investorMapping[msg.sender] += msg.value;
        investor.push(msg.sender);
        return true;
    }

    /*
     * @desc: Returns the total amount of balance which the owner had
     * @return: total value
     */
    function getTotalBalance() public constant returns (uint256) {
        return totalAmount;

    }


    /*
     *@desc:  Returns the total amount that the investor invested to the owner
     * @return: value
     */
    function getinvestedBalance(address invest) public constant returns (uint256) {
        return investorMapping[invest];

    }

    /*
     * @desc:  Check the owners approval and if all owner's approved, requested amount will be transferred
     * @param: invest => Transaction hash
     */
    function confirm(bytes32 invest) isAnyOwner public {
        transact[invest].approval[msg.sender] = true;
        uint count = 0;
        for (uint i = 0; i < owners.length; i++) {
            if (transact[invest].approval[owners[i]] == true) {
                count = count + 1;
            }
        }
        if (count == owners.length) {
            transact[invest].destination.transfer(transact[invest].value);
            transact[invest].executed = true;
            totalAmount -= transact[invest].value;
            transactList.push(invest);
            investorsuccess[transact[invest].destination].push(invest);
            investorMapping[transact[invest].destination] -= transact[invest].value;
        }
    }
    /*
     * @desc: Returns the Transaction list
     * @return: list of transaction hash values
     */
    function getlist() constant public returns (bytes32[]){
        return transactList;
    }

    /*
     * @desc: Returns the number of investors
     * @return: value
     */
    function getinvestorcount() public constant returns (uint256){
        return investor.length;
    }

    /*
     * @desc: Returns the number of successful transactions
     * @return: value
     */
    function successtransact() public constant returns (uint256){
        return transactList.length;
    }

    /*
     * @desc: Returns the list of transaction hash that has been requested
     * @return: list of Transaction hash
     */
    function getwithdraw() constant public returns (bytes32[]){
        return withdrawList;
    }

    /*
     * @desc: Returns the status of the transaction
     * @return: boolean value
    */
    function getstatus(bytes32 txnhash) constant public returns (bool){
        return transact[txnhash].executed;
    }

    /*
     * @desc: investor will send a request to withdraw a particular amount
     * @param: amt => amount to be withdraw
     * @param: data => reason for withdraw
     * @return: transaction hash generated
     */
    function withdraw(uint amt, bytes data) payable isInvestor(msg.sender) isLimit(amt) public returns (bytes32){
        bytes32 txHash = keccak256(owners, msg.sender, amt, data);
        transact[txHash].destination = msg.sender;
        transact[txHash].value = amt;
        transact[txHash].data = data;
        withdrawList.push(txHash);
        investorMap[msg.sender].push(txHash);
        emit TransactionHashGenerated(txHash, msg.sender);
        return txHash;
    }

    /*
     * @desc: If need to destroy the contract , the total amount will be transferred to the super admin address and the contract will be closed
     */
    function destroy() isAnyOwner public {
        selfdestruct(super_admin);
    }

    /*
     * @desc: get details of the particular transaction
     * @param: Transaction hash mapped to the transaction
     * @return: Details of the transaction
     */
    function getdetails(bytes32 txn) public constant returns (address, uint, bytes, bool){
        return (transact[txn].destination, transact[txn].value, transact[txn].data, transact[txn].executed);
    }

    /*
     * @desc: get count of the successful transaction
     * @param: invest => address of the investor
     * @return: count of the successful transaction
     */
    function getsuccesscount(address invest) public constant returns (uint256){
        return investorsuccess[invest].length;
    }


    /*
     * @desc: get transaction list of the particular investor
     * @param: invest => address of the investor
     * @return: list of transaction hash for the particular investor
     */
    function transactList(address invest) public constant returns (bytes32[]){
        return investorMap[invest];
    }

}