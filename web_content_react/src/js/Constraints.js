
/**
 * Constraints object which wraps information
 * pertaining to live trading constraints
 */
const Constraints = {

    /**
     * List of exchanges currently supported for trading
     */
    supportedTrading:[
        "binance"
    ],

    /**
     * Constraints placed at the exchange level
     */
    binance: {
        "USDT": 2000000,
        "BTC": 750,
        "ETH": 2500,
        "BNB": 35000,
    },

    /**
     * Minimum trading limits by exchange
     */
    minimumLimits: {
        binance: {
            "USDT": 20,
            "BTC": .001,
            "ETH": .01,
            "BNB": 1,
        }
    },

    /**
     * 
     * @param {Exchange associated with market} exchange 
     * @param {Quote accociated with market} quote 
     * @param {30d avg volume of market} volume 
     */
    volumeIsGood: function(exchange,quote,volume){
        
        //Exchange is not supported
        if(!this.supportedTrading.includes(exchange) || 
           !(quote.toUpperCase() in this[exchange.toLowerCase()])){
            return false;
        }

        //Volume is too low
        if(volume < this[exchange][quote.toUpperCase()]){
            return false;
        }

        //Passes for live trading
        return true;
    }

}
export default Constraints;
