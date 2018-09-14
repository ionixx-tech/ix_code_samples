pragma solidity ^0.4.23;

/**
 * SafeMath
 * Math operations with safety checks that throw on error
 */
library SafeMath {
    /**
    * Integer multiplication of two numbers.
    */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a * b;
        assert(a == 0 || c / a == b);
        return c;
    }

    /**
    * Integer addition of two numbers.
    */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
    /**
    * Integer division of two numbers.
    */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // assert(b > 0); // Solidity automatically throws when dividing by 0
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return c;
    }
}

contract owned {
    address public owner;

    constructor() internal {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address newOwner) onlyOwner public {
        owner = newOwner;
    }
}

interface tokenRecipient {
    function receiveApproval(address _from, uint256 _value, address _token, bytes _extraData) external;}

/**
 * To check whether the crowdsale is active or not
 */

interface ico {
    function isActive() external returns (bool);
}

contract TokenERC20 is owned {

    string public name;
    string public symbol;
    uint8 public decimals = 18;
    uint256 public totalSupply;
    uint256 public buy_rate = 1000000000000000;
    uint256 public sell_rate = 1000000000000000;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Burn(address indexed from, uint256 value);

    /**
     * Constructor function
     *
     * Initializes contract with initial supply tokens to the creator of the contract
     */
    constructor(
        uint256 initialSupply,
        string tokenName,
        string tokenSymbol
    ) public {
        totalSupply = initialSupply * 10 ** uint256(decimals);
        balanceOf[msg.sender] = totalSupply;
        name = tokenName;
        symbol = tokenSymbol;
    }

    /**
     * Internal transfer, only can be called by this contract
     */
    function _transfer(address _from, address _to, uint _value) internal {
        // Prevent transfer to 0x0 address. Use burn() instead
        require(_to != 0x0);
        // Check if the sender has enough
        require(balanceOf[_from] >= _value);
        // Check for overflows
        require(balanceOf[_to] + _value > balanceOf[_to]);
        // Save this for an assertion in the future
        uint previousBalances = balanceOf[_from] + balanceOf[_to];
        // Subtract from the sender
        balanceOf[_from] -= _value;
        // Add the same to the recipient
        balanceOf[_to] += _value;
        emit Transfer(_from, _to, _value);
        // Asserts are used to use static analysis to find bugs in your code. They should never fail
        assert(balanceOf[_from] + balanceOf[_to] == previousBalances);
    }

    /**
     * Transfer tokens
     *
     * Send `_value` tokens to `_to` from your account
     *
     * @param _to The address of the recipient
     * @param _value the amount to send
     */
    function transfer(address _to, uint256 _value) public {
        _transfer(msg.sender, _to, _value);
    }

    /**
    * Allow users to buy tokens for `newBuyPrice` eth and sell tokens for `newSellPrice` eth
    * @param newSellPrice Price the users can sell to the contract
    * @param newBuyPrice Price users can buy from the contract
    */
    function setPrices(uint256 newSellPrice, uint256 newBuyPrice) onlyOwner public {
        buy_rate = newSellPrice;
        sell_rate = newBuyPrice;
    }

    /**
    * Buy token from contract
    */
    function buy() payable public returns (uint256 _tokens) {
        // Calculate tokens to sell
        uint256 weiAmount = msg.value;
        uint256 tokens = SafeMath.div(weiAmount, buy_rate) * 1 ether;
        balanceOf[msg.sender] += tokens;
        balanceOf[owner] -= tokens;
        emit Transfer(msg.sender, owner, tokens);
        owner.transfer(msg.value);
        return tokens;
    }

    /**
    * Sell token from contract
    */
    function sell(uint256 token) public returns (uint256 sell_amount) {
        require(balanceOf[msg.sender] >= token);
        // checks if the sender has enough to sell
        balanceOf[owner] += token;
        // adds the amount to owner's balance
        balanceOf[msg.sender] -= token;
        uint256 revenue = SafeMath.div(token, 1 ether) * sell_rate;
        msg.sender.transfer(revenue);
        emit Transfer(msg.sender, owner, token);
        return revenue;

    }

    /**
     * Transfer tokens from other address
     *
     * Send `_value` tokens to `_to` in behalf of `_from`
     *
     * @param _from The address of the sender
     * @param _to The address of the recipient
     * @param _value the amount to send
     */
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= allowance[_from][msg.sender]);
        // Check allowance
        allowance[_from][msg.sender] -= _value;
        _transfer(_from, _to, _value);
        return true;
    }

    /**
     * Set allowance for other address
     *
     * Allows `_spender` to spend no more than `_value` tokens in your behalf
     *
     * @param _spender The address authorized to spend
     * @param _value the max amount they can spend
     */
    function approve(address _spender, uint256 _value) public
    returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        return true;
    }

    /**
     * Set allowance for other address and notify
     *
     * Allows `_spender` to spend no more than `_value` tokens in your behalf, and then ping the contract about it
     *
     * @param _spender The address authorized to spend
     * @param _value the max amount they can spend
     * @param _extraData some extra information to send to the approved contract
     */
    function approveAndCall(address _spender, uint256 _value, bytes _extraData)
    public
    returns (bool success) {
        tokenRecipient spender = tokenRecipient(_spender);
        if (approve(_spender, _value)) {
            spender.receiveApproval(msg.sender, _value, this, _extraData);
            return true;
        }
    }

    /**
     * Destroy tokens
     *
     * Remove `_value` tokens from the system irreversibly
     *
     * @param _value the amount of money to burn
     */
    function burn(uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);
        // Check if the sender has enough
        balanceOf[msg.sender] -= _value;
        // Subtract from the sender
        totalSupply -= _value;
        // Updates totalSupply
        emit Burn(msg.sender, _value);
        return true;
    }

    /**
     * Destroy tokens from other account
     * Remove `_value` tokens from the system irreversibly on behalf of `_from`.
     * @param _from the address of the sender
     * @param _value the amount of money to burn
     */
    function burnFrom(address _from, uint256 _value) public returns (bool success) {
        require(balanceOf[_from] >= _value);
        // Check if the targeted balance is enough
        require(_value <= allowance[_from][msg.sender]);
        // Check allowance
        balanceOf[_from] -= _value;
        // Subtract from the targeted balance
        allowance[_from][msg.sender] -= _value;
        // Subtract from the sender's allowance
        totalSupply -= _value;
        // Update totalSupply
        emit Burn(_from, _value);
        return true;
    }
}

contract IonixxToken is owned, TokenERC20 {

    ico  sale;
    mapping(address => bool) public frozenAccount;
    address contract_address;
    /*
     This generates a public event on the blockchain that will notify clients
     */
    event FrozenFunds(address target, bool frozen);

    /*
     Initializes contract with initial tokens to the creator of the contract
     */
    constructor(
        uint256 initialSupply,
        string tokenName,
        string tokenSymbol
    ) TokenERC20(initialSupply, tokenName, tokenSymbol) public {
        owner = msg.sender;
        contract_address = this;
    }


    /**
     * set Crowdsale Address function
     * Assigning the sale with crowdsale Address
     *  @param sale_address to connect with crowdsale contract
     */
    function set_saleaddress(address sale_address) onlyOwner public {
        sale = ico(sale_address);
    }
    /*
     Internal transfer, only can be called by this contract
     */
    function _transfer(address _from, address _to, uint _value) internal {
        require(_to != 0x0);
        // Prevent transfer to 0x0 address. Use burn() instead
        require(balanceOf[_from] >= _value);
        // Check if the sender has enough
        require(balanceOf[_to] + _value > balanceOf[_to]);
        // Check for overflows
        require(!frozenAccount[_from]);
        // Check if sender is frozen
        require(!frozenAccount[_to]);
        // Check if recipient is frozen
        balanceOf[_from] -= _value;
        // Subtract from the sender
        balanceOf[_to] += _value;
        // Add the same to the recipient
        emit Transfer(_from, _to, _value);
    }

    /**
    * Create `mintedAmount` tokens and send it to `target`
    * @param target Address to receive the tokens
    * @param mintedAmount the amount of tokens it will receive
    */
    function mintToken(address target, uint256 mintedAmount) onlyOwner public {
        balanceOf[target] += mintedAmount;
        totalSupply += mintedAmount;
        emit Transfer(0, this, mintedAmount);
        emit Transfer(this, target, mintedAmount);
    }

    /**
     * `freeze? Prevent | Allow` `target` from sending & receiving tokens
     * @param target Address to be frozen
     * @param freeze either to freeze it or not
     */
    function freezeAccount(address target, bool freeze) onlyOwner public {
        frozenAccount[target] = freeze;
        emit FrozenFunds(target, freeze);
    }

    /**
    * Code Logic for trade follows here
    */

    address public owner;

    struct Order {
        bool is_traded;
        address issue_address;
        address winner_address;
        uint256 amountGive;
        uint256 amountGet;
        uint256 tokenGet;
        uint256 tokenGive;
    }

    mapping(uint256 => Order) public orders_map;
    uint256 public current_trade = 0;


    event BitOrder(uint256 amountGive, uint256 tokenGet, address user, uint256 trade_reference);
    event SellOrder(uint256 amountGet, uint256 tokenGive, address user, uint256 trade_reference);
    event AskOrder(uint256 amountGet, uint256 tokenGive, address user, uint256 trade_reference);
    event BuyOrder(uint256 amountGive, uint256 tokenGet, address user, uint256 trade_reference);
    event BitOrderCancel(uint256 amountGive, uint256 tokenGet, address user, uint256 trade_reference);
    event AskOrderCancel(uint256 amountGet, uint256 tokenGive, address user, uint256 trade_reference);

    /**
    * User throws an bit (ether) for getting IXCOIN
    * @param tokenGet - Buying rate in token
    */
    function bit_order(uint256 tokenGet) payable public returns (uint256) {
        require(!sale.isActive());
        require(!frozenAccount[msg.sender]);
        current_trade = current_trade + 1;
        require(msg.value > 0);
        // Selling rate in ether
        // Get value from constructor, amountGive
        uint256 amountCreditContract = msg.value;
        orders_map[current_trade].issue_address = msg.sender;
        orders_map[current_trade].amountGive = amountCreditContract;
        orders_map[current_trade].tokenGet = tokenGet;
        orders_map[current_trade].is_traded = false;

        // Hold the ether
        // contract_address.transfer(msg.value);
        emit BitOrder(amountCreditContract, tokenGet, msg.sender, current_trade);
        return current_trade;
    }

    /**
    * User sells an IXCOIN for getting Ether
    * @param trade_reference -  Reference ID for performing the trade
    */
    function sell_coin(uint256 trade_reference) payable public {
        require(!sale.isActive());
        require(!frozenAccount[msg.sender]);
        address issuer = orders_map[trade_reference].issue_address;

        require(orders_map[trade_reference].is_traded == false);
        // Do calculation for buying the BitOrder ,actual value
        uint256 tokenCreditIssuer = orders_map[trade_reference].tokenGet;
        // Transfer the actual amount to the msg.sender
        uint256 amountCreditWinner = orders_map[trade_reference].amountGive;
        require(balanceOf[msg.sender] >= tokenCreditIssuer);
        // Check if the sender has enough
        require(balanceOf[msg.sender] + tokenCreditIssuer > balanceOf[msg.sender]);
        //ETH Amount transfer
        msg.sender.transfer(amountCreditWinner);
        //Token transfer
        transfer(issuer, tokenCreditIssuer);
        orders_map[trade_reference].is_traded = true;
        orders_map[trade_reference].winner_address = msg.sender;
        emit SellOrder(amountCreditWinner, tokenCreditIssuer, msg.sender, trade_reference);

    }
    /**
     * User asks ether for giving IXCOIN
     * @param amountGet - Buying rate in ether
     * @param tokenGive - Selling rate of token
     */
    function ask_order(uint256 amountGet, uint256 tokenGive) payable public returns (uint256) {
        require(!sale.isActive());
        require(!frozenAccount[msg.sender]);
        current_trade = current_trade + 1;
        orders_map[current_trade].issue_address = msg.sender;
        orders_map[current_trade].amountGet = amountGet;
        orders_map[current_trade].tokenGive = tokenGive;
        orders_map[current_trade].is_traded = false;

        uint256 tokenCreditContract = tokenGive;
        // Do this from token contract
        //contract_address.transfer(tokenCreditContract);
        require(balanceOf[msg.sender] >= tokenCreditContract);
        // Check if the sender has enough
        require(balanceOf[msg.sender] + tokenCreditContract > balanceOf[msg.sender]);
        // Check for overflows
        // Send tokens to contract_address for holding value
        transfer(contract_address, tokenCreditContract);

        emit AskOrder(amountGet, tokenGive, msg.sender, current_trade);
        return current_trade;
    }

    /**
     * User buys an IXCOIN, by giving ether value
     * @param trade_reference - Reference ID for performing the trade
     */
    function buy_coin(uint256 trade_reference) payable public {
        require(!sale.isActive());
        require(!frozenAccount[msg.sender]);
        address issuer = orders_map[trade_reference].issue_address;
        require(orders_map[trade_reference].is_traded == false);
        // Do calculation for buying the AskOrder ,actual value to send to issuer
        // Get value from constructor, amountGive
        uint256 amountCreditIssuer = msg.value;
        require(amountCreditIssuer == orders_map[trade_reference].amountGet);
        // Transfer the actual token to the msg.sender
        uint256 tokenCreditWinner = orders_map[trade_reference].tokenGive;
        orders_map[trade_reference].winner_address = msg.sender;
        orders_map[trade_reference].is_traded = true;
        //ETH Amount transfer
        issuer.transfer(amountCreditIssuer);
        //Token transfer
        _transfer(contract_address, msg.sender, tokenCreditWinner);
        emit BuyOrder(amountCreditIssuer, tokenCreditWinner, msg.sender, trade_reference);
    }

    /**
     * Cancel Bit Order
     * @param trade_reference - Reference ID for performing the trade
     */
    function cancelBitOrder(uint256 trade_reference) public {
        require(!sale.isActive());
        require(orders_map[trade_reference].is_traded == false);
        address issuer = orders_map[trade_reference].issue_address;
        require(issuer == msg.sender);
        require(orders_map[trade_reference].amountGive > 0);
        require(orders_map[trade_reference].tokenGet > 0);

        // transfer amount to issuer
        issuer.transfer(orders_map[trade_reference].amountGive);
        orders_map[trade_reference].is_traded = true;
        emit BitOrderCancel(orders_map[trade_reference].amountGive, orders_map[trade_reference].tokenGet, msg.sender, trade_reference);

    }

    /**
    * Cancel Ask Order
    * @param trade_reference - Reference ID for performing the trade
    */
    function cancelAskOrder(uint256 trade_reference) public {
        require(!sale.isActive());
        require(orders_map[trade_reference].is_traded == false);
        address issuer = orders_map[trade_reference].issue_address;
        require(issuer == msg.sender);
        require(orders_map[trade_reference].amountGet > 0);
        require(orders_map[trade_reference].tokenGive > 0);

        //transafer token
        _transfer(contract_address, issuer, orders_map[trade_reference].tokenGive);
        orders_map[trade_reference].is_traded = true;

        emit AskOrderCancel(orders_map[trade_reference].amountGet, orders_map[trade_reference].tokenGive, msg.sender, trade_reference);
    }

    /**
    * Gets Ether Balance for the given user address
    */
    function getEtherBalance(address addr) view public returns (uint256) {
        return address(addr).balance;
    }


}