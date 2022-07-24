
/**
 * Wraps information about travas supported quotes relative
 * to how they are handles in the UI.
 */
const QuoteCurrencies = {

    "USDT": {      
        defaultValue: 20,
        min: 20,
        max: 2000,
        step: 1,
        name: "USD Tether",
        key: "USDT",
        precision: 0
    },

    "BTC": {      
        defaultValue: .001,
        min: .001,
        max: 1,
        step: .0001,
        name: "Bitcoin",
        key: "BTC",
        precision: 4
    },

    "ETH": {      
        defaultValue: .01,
        min: .01,
        max: 20,
        step: .001,
        name: "Ethereum",
        key: "ETH",
        precision: 2
    },

    "BNB": {      
        defaultValue: 1,
        min: 1,
        max: 200,
        step: 1,
        name: "Binance Coin",
        key: "BNB",
        precision: 0
    }
}

export default QuoteCurrencies;
