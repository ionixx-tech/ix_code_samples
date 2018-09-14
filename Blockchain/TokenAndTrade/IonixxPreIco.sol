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
        uint256 c = a / b;
        return c;
    }
}

/**
 * The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {

    address public owner;

    /**
     * The Ownable constructor sets the original `owner` of the contract to the sender
     * account.
     */
   constructor() internal{
        owner = msg.sender;
    }

    /**
     * Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    /**
     * Allows the current owner to transfer control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function transferOwnership(address newOwner) public  onlyOwner {
        require(newOwner != address(0));
        owner = newOwner;
    }
}

/**
 * Token - interface for interacting with the Token contract
 */
interface Token {
    function transfer(address _to, uint256 _value) external returns (bool);

    function balanceOf(address _owner) external constant returns (uint256 balance);

}

contract IonixxPreIco is Ownable {

    using SafeMath for uint256;
    Token token;
    uint256 public constant START = 1526278103;
    uint256 public constant MINUTES = 1;
    uint public creationTime;
    uint256 public expectedAmount = 10000000000000000000000;
    uint256 public raisedAmount = 0;
    uint256 public token_rate = 1000000000000000;

    event BoughtTokens(address indexed to, uint256 value, uint256 priceValue);

    modifier whenSaleIsActive() {
        // Check if sale is active
        require(isActive());
        _;
    }

    /**
     * Constructor function
     * Initializes Crowdsale with Token Address
     */

   constructor(address _tokenAddress) public {
        require(_tokenAddress != address(0));
        token = Token(_tokenAddress);
        creationTime = block.timestamp;
    }

    /**
    * Checks whether the ico is active and reached target date
    */
    function isActive() public constant returns (bool) {
        return (
        block.timestamp >= START && // Must be after the START date
        block.timestamp <= START.add(MINUTES * 1 minutes) && // Must be before the end date
        tokensAvailable() > 0 // Tokens should be available
        );
    }

    /**
    * Checks whether the target amount is reached
    */
    function goalReached() public constant returns (bool) {
        return (raisedAmount >= expectedAmount);
    }

    function() public payable {
        buyTokens();
    }

    /**
    * Function that sells available tokens
    */
    function buyTokens() public payable whenSaleIsActive {
        // Calculate tokens to sell
        uint256 weiAmount = msg.value;
        uint256 tokens = weiAmount.div(token_rate) * 1 ether;
        require(tokensAvailable() >= tokens);
        emit BoughtTokens(msg.sender, tokens, weiAmount);
        // Increment raised amount
        raisedAmount = raisedAmount.add(msg.value);
        // Send tokens to buyer
        token.transfer(msg.sender, tokens);
        // Send money to owner
        owner.transfer(msg.value);
    }

    /**
     * returns the number of tokens allocated to this contract
     */
    function tokensAvailable() public constant returns (uint256) {
        return token.balanceOf(this);
    }

    /**
     * returns the number of tokens purchased by an address
     */
    function tokenbalanceOf(address from) public constant returns (uint256) {
        return token.balanceOf(from);
    }

    /**
    * Transfer all the token back to owner
    */
    function drain()  private onlyOwner {
        require(!isActive());
        // Transfer tokens back to owner
        uint256 balance = token.balanceOf(this);
        require(balance > 0);
        owner.transfer(address(this).balance);
        token.transfer(owner, balance);
    }

}