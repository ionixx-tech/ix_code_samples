TOKEN_TRADE_ABI = [
    {
        "constant": False,
        "inputs": [
            {
                "name": "newSellPrice",
                "type": "uint256"
            },
            {
                "name": "newBuyPrice",
                "type": "uint256"
            }
        ],
        "name": "setPrices",
        "outputs": [],
        "payable": False,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": True,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": False,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": False,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "name": "success",
                "type": "bool"
            }
        ],
        "payable": False,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": True,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": False,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": True,
        "inputs": [],
        "name": "sell_rate",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": False,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": False,
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "name": "success",
                "type": "bool"
            }
        ],
        "payable": False,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": False,
        "inputs": [
            {
                "name": "tokenGet",
                "type": "uint256"
            }
        ],
        "name": "bit_order",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": True,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": True,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": False,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": False,
        "inputs": [
            {
                "name": "amountGet",
                "type": "uint256"
            },
            {
                "name": "tokenGive",
                "type": "uint256"
            }
        ],
        "name": "ask_order",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": True,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": False,
        "inputs": [
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "burn",
        "outputs": [
            {
                "name": "success",
                "type": "bool"
            }
        ],
        "payable": False,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": True,
        "inputs": [],
        "name": "current_trade",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": False,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": False,
        "inputs": [
            {
                "name": "trade_reference",
                "type": "uint256"
            }
        ],
        "name": "sell_coin",
        "outputs": [],
        "payable": True,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": True,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "orders_map",
        "outputs": [
            {
                "name": "is_traded",
                "type": "bool"
            },
            {
                "name": "issue_address",
                "type": "address"
            },
            {
                "name": "winner_address",
                "type": "address"
            },
            {
                "name": "amountGive",
                "type": "uint256"
            },
            {
                "name": "amountGet",
                "type": "uint256"
            },
            {
                "name": "tokenGet",
                "type": "uint256"
            },
            {
                "name": "tokenGive",
                "type": "uint256"
            }
        ],
        "payable": False,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": False,
        "inputs": [
            {
                "name": "trade_reference",
                "type": "uint256"
            }
        ],
        "name": "cancelBitOrder",
        "outputs": [],
        "payable": False,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": True,
        "inputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": False,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": False,
        "inputs": [
            {
                "name": "target",
                "type": "address"
            },
            {
                "name": "mintedAmount",
                "type": "uint256"
            }
        ],
        "name": "mintToken",
        "outputs": [],
        "payable": False,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": False,
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "burnFrom",
        "outputs": [
            {
                "name": "success",
                "type": "bool"
            }
        ],
        "payable": False,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": True,
        "inputs": [],
        "name": "buy_rate",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": False,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": False,
        "inputs": [
            {
                "name": "trade_reference",
                "type": "uint256"
            }
        ],
        "name": "cancelAskOrder",
        "outputs": [],
        "payable": False,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": True,
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": False,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": True,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": False,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": False,
        "inputs": [],
        "name": "buy",
        "outputs": [
            {
                "name": "_tokens",
                "type": "uint256"
            }
        ],
        "payable": True,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": False,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [],
        "payable": False,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": True,
        "inputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "name": "frozenAccount",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": False,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": False,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            },
            {
                "name": "_extraData",
                "type": "bytes"
            }
        ],
        "name": "approveAndCall",
        "outputs": [
            {
                "name": "success",
                "type": "bool"
            }
        ],
        "payable": False,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": False,
        "inputs": [
            {
                "name": "addr",
                "type": "address"
            }
        ],
        "name": "getEtherBalance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": False,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": False,
        "inputs": [
            {
                "name": "trade_reference",
                "type": "uint256"
            }
        ],
        "name": "buy_coin",
        "outputs": [],
        "payable": True,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": True,
        "inputs": [
            {
                "name": "",
                "type": "address"
            },
            {
                "name": "",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": False,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": False,
        "inputs": [
            {
                "name": "token",
                "type": "uint256"
            }
        ],
        "name": "sell",
        "outputs": [
            {
                "name": "sell_amount",
                "type": "uint256"
            }
        ],
        "payable": False,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": False,
        "inputs": [
            {
                "name": "target",
                "type": "address"
            },
            {
                "name": "freeze",
                "type": "bool"
            }
        ],
        "name": "freezeAccount",
        "outputs": [],
        "payable": False,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": False,
        "inputs": [
            {
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "payable": False,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "initialSupply",
                "type": "uint256"
            },
            {
                "name": "tokenName",
                "type": "string"
            },
            {
                "name": "tokenSymbol",
                "type": "string"
            }
        ],
        "payable": False,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": False,
        "inputs": [
            {
                "indexed": False,
                "name": "target",
                "type": "address"
            },
            {
                "indexed": False,
                "name": "frozen",
                "type": "bool"
            }
        ],
        "name": "FrozenFunds",
        "type": "event"
    },
    {
        "anonymous": False,
        "inputs": [
            {
                "indexed": False,
                "name": "amountGive",
                "type": "uint256"
            },
            {
                "indexed": False,
                "name": "tokenGet",
                "type": "uint256"
            },
            {
                "indexed": False,
                "name": "user",
                "type": "address"
            },
            {
                "indexed": False,
                "name": "trade_reference",
                "type": "uint256"
            }
        ],
        "name": "BitOrder",
        "type": "event"
    },
    {
        "anonymous": False,
        "inputs": [
            {
                "indexed": False,
                "name": "amountGet",
                "type": "uint256"
            },
            {
                "indexed": False,
                "name": "tokenGive",
                "type": "uint256"
            },
            {
                "indexed": False,
                "name": "user",
                "type": "address"
            },
            {
                "indexed": False,
                "name": "trade_reference",
                "type": "uint256"
            }
        ],
        "name": "SellOrder",
        "type": "event"
    },
    {
        "anonymous": False,
        "inputs": [
            {
                "indexed": False,
                "name": "amountGet",
                "type": "uint256"
            },
            {
                "indexed": False,
                "name": "tokenGive",
                "type": "uint256"
            },
            {
                "indexed": False,
                "name": "user",
                "type": "address"
            },
            {
                "indexed": False,
                "name": "trade_reference",
                "type": "uint256"
            }
        ],
        "name": "AskOrder",
        "type": "event"
    },
    {
        "anonymous": False,
        "inputs": [
            {
                "indexed": False,
                "name": "amountGive",
                "type": "uint256"
            },
            {
                "indexed": False,
                "name": "tokenGet",
                "type": "uint256"
            },
            {
                "indexed": False,
                "name": "user",
                "type": "address"
            },
            {
                "indexed": False,
                "name": "trade_reference",
                "type": "uint256"
            }
        ],
        "name": "BuyOrder",
        "type": "event"
    },
    {
        "anonymous": False,
        "inputs": [
            {
                "indexed": False,
                "name": "amountGive",
                "type": "uint256"
            },
            {
                "indexed": False,
                "name": "tokenGet",
                "type": "uint256"
            },
            {
                "indexed": False,
                "name": "user",
                "type": "address"
            },
            {
                "indexed": False,
                "name": "trade_reference",
                "type": "uint256"
            }
        ],
        "name": "BitOrderCancel",
        "type": "event"
    },
    {
        "anonymous": False,
        "inputs": [
            {
                "indexed": False,
                "name": "amountGet",
                "type": "uint256"
            },
            {
                "indexed": False,
                "name": "tokenGive",
                "type": "uint256"
            },
            {
                "indexed": False,
                "name": "user",
                "type": "address"
            },
            {
                "indexed": False,
                "name": "trade_reference",
                "type": "uint256"
            }
        ],
        "name": "AskOrderCancel",
        "type": "event"
    },
    {
        "anonymous": False,
        "inputs": [
            {
                "indexed": True,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": True,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": False,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "anonymous": False,
        "inputs": [
            {
                "indexed": True,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": False,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Burn",
        "type": "event"
    }
]
