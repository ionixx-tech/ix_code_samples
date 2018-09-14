import eth_utils
from web3 import Web3, HTTPProvider

from ixcoin_backend.api.blockchain.solidity.abi.token_trade_abi import TOKEN_TRADE_ABI
from ixcoin_backend.settings import WEB3_OWNER_ACCOUNT, CONTRACT_ADDRESS_TOKEN_TRADE, OWNER_PRIVATE_KEY, OWNER_ADDRESS, \
    GAS_PRICE_IN_GWI


class BlockChain:
    def __init__(self, web3_http_url):
        print("Initializing block chain", web3_http_url)
        self.WEB3 = Web3(HTTPProvider(web3_http_url))
        print("Ethereum connected -> Block Syncing -> ", self.WEB3.eth.blockNumber)
        self.ACCOUNT = WEB3_OWNER_ACCOUNT
        self.CONTRACT_ADDRESS = CONTRACT_ADDRESS_TOKEN_TRADE
        self.INTERFACE = TOKEN_TRADE_ABI

    def get_balance_ether(self, account):
        """
        Get Balance of Account Holder in Ethereum
        :param account: Address of user
        :return: Balance of account holder as ether representation
        """
        balance_in_wei = self.WEB3.eth.getBalance(account)
        print("balance_in_wei", balance_in_wei)
        balance_in_ether = self.WEB3.fromWei(balance_in_wei, 'ether')
        print("ACCOUNT ->", self.ACCOUNT)
        print("Balance ->", balance_in_ether)
        return balance_in_ether

    def get_balance_coin(self):
        """
        Get Balance of Token Holder in Ethereum
        :return: Balance of Token Holder as ether representation
        """
        tokens_in_wei = self.CONTRACT.call().balanceOf(self.ACCOUNT)
        print("tokens_in_wei", tokens_in_wei)
        balance_in_ether = self.WEB3.fromWei(tokens_in_wei, 'ether')
        print("Account ->", self.ACCOUNT)
        print("Balance ->", balance_in_ether)
        return balance_in_ether

    def transfer_token(self, token_in_ether, to_account):
        """
        Trasfer token to user account from account holder
        :param token_in_ether: Token value in ether representation
        :param to_account: User account
        :return: Transaction hash of blockchain
        """
        token_in_wei = self.WEB3.toWei(token_in_ether, 'ether')
        PRIVATE_KEY = OWNER_PRIVATE_KEY

        # the address who owns the contract
        address_From = OWNER_ADDRESS
        contract_check_address = eth_utils.to_checksum_address(CONTRACT_ADDRESS_TOKEN_TRADE)
        to_account_address = eth_utils.to_checksum_address(to_account)
        contract = self.WEB3.eth.contract(address=contract_check_address, abi=TOKEN_TRADE_ABI)
        nonce = self.WEB3.eth.getTransactionCount(address_From)
        unicorn_txn = contract.functions.transfer(
            to_account_address, token_in_wei
        ).buildTransaction({
            'from': address_From,
            'nonce': nonce,
            'gas': 4000000,
            'gasPrice': self.WEB3.toWei(GAS_PRICE_IN_GWI, 'gwei'),
            'chainId': self.WEB3.version.network
        })
        signed_txn = self.WEB3.eth.account.signTransaction(unicorn_txn, private_key=PRIVATE_KEY)
        self.WEB3.eth.sendRawTransaction(signed_txn.rawTransaction)
        transaction_hash = self.WEB3.toHex(self.WEB3.sha3(signed_txn.rawTransaction))
        print("Transaction Initiated Successfully", transaction_hash)
        return transaction_hash
