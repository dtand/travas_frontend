import React from "react";

const Constants = {

    IS_MOBILE: (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4)))
        ,
    
    IS_NIGHTMODE: false,

    SUPPORTED_EXCHANGES: [
        "binance",
        "gdax",
        "bittrex",
        "gemini"
    ],

    SUPPORTED_INTERVALS: [
        "1m",
        "5m",
        "30m",
        "1h",
        "4h",
        "1d"
    ],

    GRAPH_COLORS: [
        "primary",
        "secondary",
        "yellow",
        "teal",
        "info",
        "purple",
        "success",
        "indigo"
    ],

    SIGNAL_CLASSES: [
        "Trend",
        "Momentum",
        "Volatility",
        "Other"
    ],

    SIGNAL_CLASS_DESCRIPTIONS: {
        "Trend": " (sma,ema,macd...)",
        "Momentum": " (rsi,stochastics...)",
        "Volatility": "(bollingers, std. dev...)",
        "Other": "(general,targets,patterns...)"
    },

    SIGNAL_METADATA: {

        /**
         * Simple Moving Averages
         */
        "SMA Close Above": {
            parameters: ["SMA"],
            apiName: "SMA-CLOSEOVER",
            description: "Uses a single simple moving average line to track the average of a market's closing prices over a period of time. " +  
                         "This specific signal is triggered when the current kline candle closes above the simple moving average.",
            recommended: "BUY",
            type: "Trend",
            callback: function(){
                if(!document.getElementById("SMA Close Above-SMA-input")){
                    return "";
                }
                const smaValue = document.getElementById("SMA Close Above-SMA-input").value;
                return " when the current price closes above sma(" + smaValue + ")";
            }
        },
        "SMA Close Below": {
            parameters: ["SMA"],
            apiName: "SMA-CLOSEUNDER",
            description: "Uses a single simple moving average line to track the average of a market's closing prices over a period of time. " +  
                         "This specific signal is triggered when the current kline candle closes below the simple moving average.",
            recommended: "SELL",
            type: "Trend",
            callback: function(){
                if(!document.getElementById("SMA Close Below-SMA-input")){
                    return "";
                }
                const smaValue = document.getElementById("SMA Close Below-SMA-input").value;
                return " when the current price closes below sma(" + smaValue + ")";
            }
        },

        /**
         * Exponential Moving Averages
         */
        "EMA Close Above": {
            parameters: ["EMA"],
            apiName: "EMA-CLOSEOVER",
            description: "Uses a single exponential moving average line to track the average of a market's closing prices over a period of time (weighted on most recent close price). " +  
                         "This specific signal is triggered when the current kline candle closes above the exponential moving average.",
            recommended: "BUY",
            type: "Trend",
            callback: function(){
                const id = "EMA Close Above-EMA-input";
                if(!document.getElementById(id)){
                    return "";
                }
                const emaValue = document.getElementById(id).value;
                return " when the current price closes above ema(" + emaValue + ")";
            }
        },

        "EMA Close Below": {
            parameters: ["EMA"],
            apiName: "EMA-CLOSEUNDER",
            description: "Uses a single exponential moving average line to track the average of a market's closing prices over a period of time (weighted on most recent close price). " +  
                         "This specific signal is triggered when the current kline candle closes below the exponential moving average.",
            recommended: "SELL",
            type: "Trend",
            callback: function(){
                const id = "EMA Close Below-EMA-input";
                if(!document.getElementById(id)){
                    return "";
                }
                const emaValue = document.getElementById(id).value;
                return " when the current price closes below ema(" + emaValue + ")";
            }
        },

        /**
         * SMA Crosses
         */
        "SMA Upwards Cross": {
            apiName: "SMA-CROSSUP",
            parameters: ["SMA-SMALLER", "SMA-LARGER"],
            description: "Tracks two different simple moving averages (SMAs) where one is always tracking a shorter period than the other." +  
                         " When the smaller SMA crosses above the larger SMA, this signal is triggered.",
            recommended: "BUY",
            type: "Trend",
            callback: function(){
                if( !document.getElementById("SMA Upwards Cross-SMA-SMALLER-input") || 
                    !document.getElementById("SMA Upwards Cross-SMA-LARGER-input")){
                        return "";
                }
                const smaSmaller = document.getElementById("SMA Upwards Cross-SMA-SMALLER-input").value;
                const smaLarger = document.getElementById("SMA Upwards Cross-SMA-LARGER-input").value;
                return " when sma(" + smaSmaller + ")" + " crosses above sma(" + smaLarger + ")";
            }
        },
        

        "SMA Downwards Cross": {
            apiName: "SMA-CROSSDOWN",
            parameters: ["SMA-SMALLER", "SMA-LARGER"],
            description: "Tracks two different simple moving averages (SMAs) where one is always tracking a shorter period than the other." +  
                         " When the smaller SMA crosses below the larger SMA, this signal is triggered.",
            recommended: "SELL",
            type: "Trend",
            callback: function(){
                if( !document.getElementById("SMA Downwards Cross-SMA-SMALLER-input") || 
                    !document.getElementById("SMA Downwards Cross-SMA-LARGER-input")){
                    return "";
                }
                const smaSmaller = document.getElementById("SMA Downwards Cross-SMA-SMALLER-input").value;
                const smaLarger = document.getElementById("SMA Downwards Cross-SMA-LARGER-input").value;
                return " when sma(" + smaSmaller + ")" + " crosses below sma(" + smaLarger + ")";
            }
        },


        /**
         * EMA Crosses
         */

        "EMA Upwards Cross": {
            apiName: "EMA-CROSSUP",
            parameters: ["EMA-SMALLER", "EMA-LARGER"],
            description: "Tracks two different exponential moving averages (EMAs) where one is always tracking a shorter period than the other." +  
                         "When the smaller EMA crosses above the larger EMA, a signal is generated.",
            recommended: "BUY",
            type: "Trend",
            callback: function(){
                const id1 = "EMA Upwards Cross-EMA-SMALLER-input";
                const id2 = "EMA Upwards Cross-EMA-LARGER-input";
                if( !document.getElementById(id1) || 
                    !document.getElementById(id2)){
                    return "";
                }
                const emaSmaller = document.getElementById(id1).value;
                const emaLarger = document.getElementById(id2).value;
                return " when ema(" + emaSmaller + ")" + " crosses above ema(" + emaLarger + ")";
            }
        },

        "EMA Downwards Cross": {
            apiName: "EMA-CROSSDOWN",
            parameters: ["EMA-SMALLER", "EMA-LARGER"],
            description: "Tracks two different exponential moving averages (EMAs) where one is always tracking a shorter period than the other." +  
                         "When the smaller EMA crosses below the larger EMA, aå signal is generated.",
            recommended: "SELL",
            type: "Trend",
            callback: function(){
                const id1 = "EMA Downwards Cross-EMA-SMALLER-input";
                const id2 = "EMA Downwards Cross-EMA-LARGER-input";
                if( !document.getElementById(id1) || 
                    !document.getElementById(id2)){
                    return "";
                }
                const emaSmaller = document.getElementById(id1).value;
                const emaLarger = document.getElementById(id2).value;
                return " when ema(" + emaSmaller + ")" + " crosses below ema(" + emaLarger + ")";
            }
        },

        /**
         * Local Min/Max
         */
        "Local Maxima": {
            apiName: "LOCAL-MAXIMA", 
            parameters: ["WINDOW-SIZE"],
            description: "Tracks the maximum close price over a provided period, where the period is measured in number of candles provided in the window size." +
                         "This signal is triggered when the high of the current kline candle is greater than the current local maxima.",
            recommended: "SELL",
            type: "Other",
            callback: function(){
                const id = "Local Maxima-WINDOW-SIZE-input";
                if(!document.getElementById(id)){
                    return "";
                }
                const window = document.getElementById(id).value;
                return " when the current candle high is greater than max(" + window + ")";
            }
            
        },

        "Local Minima": {
            apiName: "LOCAL-MINIMA",
            parameters: ["WINDOW-SIZE"],
            description: "Tracks the minimum close price over a provided period, where the period is measured in number of candles provided in the window size." +
                         "This signal is triggered when the low of the current kline candle is less than the current local maxima.",
            recommended: "BUY",
            type: "Other",
            callback: function(){
                const id = "Local Minima-WINDOW-SIZE-input";
                if(!document.getElementById(id)){
                    return "";
                }
                const window = document.getElementById(id).value;
                return " when the current candle low is less than min(" + window + ")";
            }
        },


        /**
         * Bollinger Bands
         */

        "Upper Bollinger Close": {
            apiName: "UPPER-BOLLINGER-CROSSUP",
            parameters: ["SMA","STD"],
            description: "Tracks the standard deviation (STD) of the simple moving average (SMA) over a provided period of time. " + 
                         "When the current close prices moves below SMA(X) - STD(Y), where X is a chosen parameter and Y is a chosen parameter, a signal is generated.",
            recommended: "SELL",
            type: "Volatility",
            callback: function(){

                const id1 = "Upper Bollinger Close-SMA-input";
                const id2 = "Upper Bollinger Close-STD-input";

                if(!document.getElementById(id1) || !document.getElementById(id2)){
                    return "";
                }

                const sma = document.getElementById(id1).value;
                const std = document.getElementById(id2).value;

                return " when the current candle closes above upper-bollinger(" + sma + ", " + std + ")";
            } 
        },


        "Lower Bollinger Close": {
            apiName: "LOWER-BOLLINGER-CROSSDOWN",
            parameters: ["SMA","STD"],
            description: "Tracks the standard deviation (STD) of the simple moving average (SMA) over a provided period of time. " + 
                         "When the current close prices moves below SMA(X) - STD(Y), where X is a chosen parameter and Y is a chosen parameter, a signal is generated.",
            recommended: "BUY",
            type: "Volatility",
            callback: function(){

                const id1 = "Lower Bollinger Close-SMA-input";
                const id2 = "Lower Bollinger Close-STD-input";

                if(!document.getElementById(id1) || !document.getElementById(id2)){
                    return "";
                }

                const sma = document.getElementById(id1).value;
                const std = document.getElementById(id2).value;

                return " when the current candle closes below lower-bollinger(" + sma + ", " + std + ")";
            } 
        },

        /**
         * Targets
         */

        "Profit Target": {
            apiName: "TARGET-SELL",
            parameters: ["TARGET"],
            description: "Generates a signal when a specified target price is reached. The target price is exactly X% above the last price" +
                         " the asset was purchased at, where X is a chosen percentage value.",
            recommended: "SELL",
            onlySellFlag: true,
            type: "Other",
            callback: function(){

                const id = "Profit Target-TARGET-input";

                if(!document.getElementById(id)){
                    return "";
                }

                const target = document.getElementById(id).value;

                return (" when the current candle closes above profit target +" + target);
            } 
        },

        /**
         * Moving Average Convergence Divergence
         */

        "MACD Bullish Cross": {
            apiName: "MACD-CROSSUP",
            parameters: ["EMA-SMALLER", "EMA-LARGER", "EMA-SIGNAL"],
            description: "Calculates the MACD (moving average convergance/divergance) value provided three exponential moving average (EMA) settings." +
                         "The smaller and larger EMA are used to calculate MACD, and the EMA signal line is derived from the sequence of EMA values. A signal " +
                         "is generated when the MACD value moves above the EMA signal line",
            recommended: "BUY",
            type: "Trend",
            callback: function(){

                const id1 = "MACD Bullish Cross-EMA-SMALLER-input";
                const id2 = "MACD Bullish Cross-EMA-LARGER-input";
                const id3 = "MACD Bullish Cross-EMA-SIGNAL-input";

                if(!document.getElementById(id1) ||
                     !document.getElementById(id2) || 
                        !document.getElementById(id3)){
                    return "";
                }

                const emaSmaller = document.getElementById(id1).value;
                const emaLarger = document.getElementById(id2).value;
                const emaSignal = document.getElementById(id3).value;

                return " when macd(" + emaSmaller + ", " + emaLarger + ", " + emaSignal + ")" + " crosses above the signal line.";
            } 
        },

        "MACD Bearish Cross": {
            apiName: "MACD-CROSSDOWN",
            parameters: ["EMA-SMALLER", "EMA-LARGER", "EMA-SIGNAL"],
            description: "Calculates the MACD (moving average convergance/divergance) value provided three exponential moving average (EMA) settings." +
                         "The smaller and larger EMA are used to calculate MACD, and the EMA signal line is derived from the sequence of EMA values. A signal " +
                         "is generated when the MACD value moves below the EMA signal line",
            recommended: "SELL",
            type: "Trend",
            callback: function(){

                const id1 = "MACD Bearish Cross-EMA-SMALLER-input";
                const id2 = "MACD Bearish Cross-EMA-LARGER-input";
                const id3 = "MACD Bearish Cross-EMA-SIGNAL-input";

                if(!document.getElementById(id1) ||
                     !document.getElementById(id2) || 
                        !document.getElementById(id3)){
                    return "";
                }

                const emaSmaller = document.getElementById(id1).value;
                const emaLarger = document.getElementById(id2).value;
                const emaSignal = document.getElementById(id3).value;

                return " when macd(" + emaSmaller + ", " + emaLarger + ", " + emaSignal + ")" + " crosses below the signal line.";
            } 
        },

        /**
         * Relative Strength Index
         */

        "RSI Downwards Threshold": {
            apiName: "RSI-CROSSDOWN",
            parameters: ["PERIOD", "THRESHOLD"],
            description: "Calcuates the relative strength index (RSI) using the simple moving average (SMA) over a designated period of time. RSI is a value " +
                         "between 1 and 100 WHERE 1 denotes extremley over-sold and 100 denotes extremely over-bought. A signal is generated when the RSI value " +
                         "moves below the designated threshold (a chosen value between 1 and 100).",
            recommended: "NEUTRAL",
            type: "Momentum",
            callback: function(){

                const id1 = "RSI Downwards Threshold-PERIOD-input";
                const id2 = "RSI Downwards Threshold-THRESHOLD-input";

                if(!document.getElementById(id1) || 
                    !document.getElementById(id2)){
                    return "";
                }

                const period = document.getElementById(id1).value;
                const threshold = document.getElementById(id2).value;

                return " when rsi(" + period + ") moves below the value " + threshold;
            } 
        },

        "RSI Upwards Threshold": {
            apiName: "RSI-CROSSUP",
            parameters: ["PERIOD", "THRESHOLD"],
            description: "Calcuates the relative strength index (RSI) using the simple moving average (SMA) over a designated period of time. RSI is a value " +
                         "between 1 and 100 WHERE 1 denotes extremley over-sold and 100 denotes extremely over-bought. A signal is generated when the RSI value " +
                         "moves above the designated threshold (a chosen value between 1 and 100).",
            recommended: "NEUTRAL",
            type: "Momentum",
            callback: function(){

                const id1 = "RSI Upwards Threshold-PERIOD-input";
                const id2 = "RSI Upwards Threshold-THRESHOLD-input";

                if(!document.getElementById(id1) || 
                    !document.getElementById(id2)){
                    return "";
                }

                const period = document.getElementById(id1).value;
                const threshold = document.getElementById(id2).value;

                return " when rsi(" + period + ") moves above the value " + threshold;
            } 
        },

        /**
         * Wick Indicators
         */

        "Lower Wick Threshold": {
            apiName: "UPPER-WICK",
            parameters: ["WICK-THRESHOLD"],
            description: "Calculates the lower wick size of the current candle.  Wick size is measured as a percentage of the entire candle height.  A signal " + 
                         "is generated when size of the lower wick is greater than the designated threshold.",
            recommended: "BUY",
            type: "Trend",
            callback: function(){

                const id = "Lower Wick Threshold-WICK-THRESHOLD-input";

                if(!document.getElementById(id)){
                    return "";
                }

                const threshold = document.getElementById(id).value;

                return " when the current lower wick is greater than " + threshold + " of the current candle's height.";
            } 
        },

        "Upper Wick Threshold": {
            apiName: "LOWER-WICK",
            parameters: ["WICK-THRESHOLD"],
            description: "Calculates the upper wick size of the current candle.  Wick size is measured as a percentage of the entire candle height.  A signal " + 
                         "is generated when size of the lower wick is greater than the designated threshold.",
            recommended: "SELL",
            type: "Trend",
            callback: function(){

                const id = "Upper Wick Threshold-WICK-THRESHOLD-input";

                if(!document.getElementById(id)){
                    return "";
                }

                const threshold = document.getElementById(id).value;

                return " when the current upper wick is greater than " + threshold + " of the current candle's height.";
            } 
        },

        /**
         * Candle Patterns
         */
        "Bullish Engulfing Candle": {
            apiName: "BULLISH-ENGULFING",
            parameters: [],
            description: "A bullish engulfing candle is a typical reversal pattern.  This signal triggers when " + 
                         "the current candle's body engulfs the previous candle's body.  The previous candle must be red " + 
                         "and the current must be green.",
            recommended: "BUY",
            type: "Trend",
            callback: function(){
                return " when a bullish engulfing candle closes ";
            } 
        },

        "Bearish Engulfing Candle": {
            apiName: "BEARISH-ENGULFING",
            parameters: [],
            description: "A bearish engulfing candle is a typical reversal pattern.  This signal triggers when " + 
                         "the current candle's body engulfs the previous candle's body.  The previous candle must be green " + 
                         "and the current must be red.",
            type: "Trend",
            recommended: "SELL",
            callback: function(){
                return " when a bearish engulfing candle closes ";
            } 
        },

        "Successive Red Candles": {
            apiName: "SUCCESSIVE-RED",
            parameters: ["STREAK"],
            description: "A red candle streak is the total count of red candles in a row on a specific market.  This signal " + 
                         "triggers when the current red candle streak is equal to the specified streak variable value. ",
            recommended: "NEUTRAL",
            type: "Trend",
            callback: function(){

                const id = "Successive Red Candles-STREAK-input";

                if(!document.getElementById(id)){
                    return "";
                }

                const streak = document.getElementById(id).value;

                return " when the current red candle streak of " + streak + " is met";
            } 
        },

        "Successive Green Candles": {
            apiName: "SUCCESSIVE-GREEN",
            parameters: ["STREAK"],
            description: "A green candle streak is the total count of green candles in a row on a specific market.  This signal " + 
                         "triggers when the current green candle streak is equal to the specified streak variable value. ",
            recommended: "NEUTRAL",
            type: "Trend",
            callback: function(){

                const id = "Successive Green Candles-STREAK-input";

                if(!document.getElementById(id)){
                    return "";
                }

                const streak = document.getElementById(id).value;

                return " when the current green candle streak of " + streak + " is met";
            } 
        },

        "Stochastic K/D Upwards Cross": {
            apiName: "STOCHASTIC-CROSSUP",
            parameters: ["KPERIOD", "DPERIOD"],
            description: "The stochastic oscilattor tracks the price movement relative the local high/low over the denoted K-Period.  The " + 
                         "indicator then creates two indices, %K and %D which range between -100 and 100%.  The signal triggers when %K moves above " + 
                         "%D.",
            recommended: "BUY",
            type: "Momentum",
            callback: function(){

                const id1 = "Stochastic K/D Upwards Cross-KPERIOD-input";
                const id2 = "Stochastic K/D Upwards Cross-DPERIOD-input";

                if(!document.getElementById(id1) || !document.getElementById(id2)){
                    return "";
                }

                const k = document.getElementById(id1).value;
                const d = document.getElementById(id2).value;

                return " when %K crosses above %D from stochastic-oscillator(" + k + ", " + d + ") ";
            } 
        },

        "Stochastic K/D Downwards Cross": {
            apiName: "STOCHASTIC-CROSSDOWN",
            parameters: ["KPERIOD", "DPERIOD"],
            description: "The stochastic oscilattor tracks the price movement relative the local high/low over the denoted K-Period.  The " + 
                         "indicator then creates two indices, %K and %D which range between -100 and 100%.  The signal triggers when %K moves below " + 
                         "%D.",
            recommended: "SELL",
            type: "Momentum",
            callback: function(){

                const id1 = "Stochastic K/D Downwards Cross-KPERIOD-input";
                const id2 = "Stochastic K/D Downwards Cross-DPERIOD-input";

                if(!document.getElementById(id1) || !document.getElementById(id2)){
                    return "";
                }

                const k = document.getElementById(id1).value;
                const d = document.getElementById(id2).value;

                return " when %K crosses below %D from stochastic-oscillator(" + k + ", " + d + ") ";
            } 
        },

        "Stochastic Upward Threshold": {
            apiName: "STOCHASTIC-THRESHOLD-CROSSUP",
            parameters: ["KPERIOD", "DPERIOD","STOCHASTIC THRESHOLD"],
            description: "The stochastic oscilattor tracks the price movement relative the local high/low over the denoted K-Period.  The " + 
                         "indicator then creates two indices, %K and %D which range between -100 and 100%.  The signal triggers when %K moves above the denoted " + 
                         "threshold",
            recommended: "NEUTRAL",
            type: "Momentum",
            callback: function(){

                const id1 = "Stochastic Upward Threshold-KPERIOD-input";
                const id2 = "Stochastic Upward Threshold-DPERIOD-input";
                const id3 = "Stochastic Upward Threshold-STOCHASTIC THRESHOLD-input";
                
                if(!document.getElementById(id1) || 
                     !document.getElementById(id2) || 
                        !document.getElementById(id3)){
                    return "";
                }

                const k = document.getElementById(id1).value;
                const d = document.getElementById(id2).value;
                const threshold = document.getElementById(id3).value;

                return " when %K from stochastic-oscillator(" + k + ", " + d + ") moves above value " + threshold;
            } 
        },

        "Stochastic Downward Threshold": {
            apiName: "STOCHASTIC-THRESHOLD-CROSSDOWN",
            parameters: ["KPERIOD", "DPERIOD","STOCHASTIC THRESHOLD"],
            description: "The stochastic oscilattor tracks the price movement relative the local high/low over the denoted K-Period.  The " + 
                         "indicator then creates two indices, %K and %D which range between -100 and 100%.  The signal triggers when %K moves below the denoted " + 
                         "threshold",
            recommended: "NEUTRAL",
            type: "Momentum",
            callback: function(){

                const id1 = "Stochastic Downward Threshold-KPERIOD-input";
                const id2 = "Stochastic Downward Threshold-DPERIOD-input";
                const id3 = "Stochastic Downward Threshold-STOCHASTIC THRESHOLD-input";
                
                if(!document.getElementById(id1) || 
                     !document.getElementById(id2) || 
                        !document.getElementById(id3)){
                    return "";
                }

                const k = document.getElementById(id1).value;
                const d = document.getElementById(id2).value;
                const threshold = document.getElementById(id3).value;

                return " when %K from stochastic-oscillator(" + k + ", " + d + ") moves below value " + threshold;
            } 
        }
    },

    INDICATOR_METADATA: {
        "SMA": {
            defaultValue: 21,
            min: 1,
            max: 200,
            step: 1,
            description: "Tracks the average price over a provided period of time.  SMA \n " + 
                         "uses the close price of each period for averaging.",
            name: "Simple Moving Average",
            key: "sma",
            precision: 0,
            toToken: function(sma){
                return "sma(" + sma + ")";
            }
        },
        "EMA": {
            defaultValue: 21,
            min: 1,
            max: 200,
            step: 1,
            description: "Tracks an average price over a provided period of time and this average is weighted heavily on the most recent close price. " +
                         " EMAs are used to more closely track the most recent price movements. Close prices are used for averaging. ",
            name: "Exponential Moving Average",
            key: "ema",
            precision: 0,
            toToken: function(ema){
                return "ema(" + ema + ")";
            }
        },
        "SMA-SMALLER": {
            defaultValue: 7,
            min: 1,
            max: 200,
            step: 1,
            description: "Tracks the average price over a provided period of time.  SMA-SMALLER " + 
                         "uses the close price of each period for averaging and is always less than SMA-LARGER",
            name: "Simple Moving Average",
            key: "smaSmaller",
            precision: 0
        },
        "EMA-SMALLER": {
            defaultValue: 20,
            min: 1,
            max: 200,
            step: 1,
            description: "Tracks an average price over a provided period of time and this average is weighted heavily on the most recent close price. " +
                         " EMAs are used to more closely track the most recent price movements. Close prices are used for averaging. ",
            name: "Exponential Moving Average",
            key: "emaSmaller",
            precision: 0
        },
        "SMA-LARGER": {
            defaultValue: 25,
            min: 1,
            max: 200,
            step: 1,
            description: "Tracks the average price over a provided period of time.  SMA " + 
                         "uses the close price of each period for averaging.",
            name: "Simple Moving Average",
            key: "smaLarger",
            precision: 0
        },
        "EMA-LARGER": {
            defaultValue: 50,
            min: 1,
            max: 200,
            step: 1,
            description: "Tracks an average price over a provided period of time and this average is weighted heavily on the most recent close price. " +
                         " EMAs are used to more closely track the most recent price movements. Close prices are used for averaging. ",
            name: "Exponential Moving Average",
            key: "emaLarger",
            precision: 0
        },
        "TARGET": {
            defaultValue: .1,
            min: .01,
            max: 1.0,
            step: .01,
            description: "Percentile value used to calculate a target buy or sell price.",
            name: "Target",
            key: "target",
            precision: 2,
            display: function(value){
                return ((value*100).toFixed(2)) + "%";
            },
            convertBack: function(value){
                return (parseFloat(value)/100).toFixed(2);
            }
        },
        "THRESHOLD": {
            defaultValue: 50,
            min: 1,
            max: 100,
            step: 1,
            description: "RSI value to either buy or sell when crosses above or below.",
            name: "Threshold",
            key: "threshold",
            precision: 0
        },
        "WICK-THRESHOLD": {
            defaultValue: .75,
            min: 0,
            max: 1,
            step: .01,
            description: "Percentage value between 0% and 100% denoting the percentage of this candle's entire height the 'wick' is.",
            name: "Wick Threshold",
            key: "wickThreshold",
            precision: 2,
            display: function(value){
                return ((value*100).toFixed(2)) + "%";
            },
            convertBack: function(value){
                return (parseFloat(value)/100).toFixed(2);
            }
        },
        "WINDOW-SIZE": {
            defaultValue: 21,
            min: 1,
            max: 200,
            step: 1,
            description: "The number of candles to include in a specified strategy.",
            name: "Window Size",
            key: "windowSize",
            precision: 0
        },
        "EMA-SIGNAL": {
            defaultValue: 9,
            min: 1,
            max: 200,
            step: 1,
            description: "Exponential Moving Average (Signal Line): Takes the exponential moving averages over a designated amount of MACD values.",
            name: "Exponential Moving Average Line",
            key: "emaSignal",
            precision: 0
        },
        "STD": {
            defaultValue: 2.0,
            min: .01,
            max: 4.0,
            step: 0.1,
            description: "The standard deviation over the provided simple moving average.",
            name: "Standard Deviation",
            key: "std",
            precision: 2
        },
        "PERIOD": {
            defaultValue: 21,
            min: 1,
            max: 200,
            step: 1,
            description: "The current set of candles or trading periods assessed for this strategy.",
            name: "Period",
            key: "period",
            precision: 0
        },
        "STREAK": {
            defaultValue: 3,
            min: 1,
            max: 10,
            step: 1,
            description: "Targeted streak value for triggering associated signal.",
            name: "Streak",
            key: "streak",
            precision: 0
        },
        "KPERIOD": {
            defaultValue: 14,
            min: 2,
            max: 99,
            step: 1,
            description: "Number of candles to include in the stochastic %K calculation.",
            name: "%K Period",
            key: "kPeriod",
            precision: 0
        },
        "DPERIOD": {
            defaultValue: 3,
            min: 2,
            max: 99,
            step: 1,
            description: "Number of candles to include in the stochastic %D calculation.",
            name: "%D Period",
            key: "dPeriod",
            precision: 0
        },
        "STOCHASTIC THRESHOLD": {
            defaultValue: 50,
            min: -99,
            max: 99,
            step: 1,
            description: "Stochastic %K threshold to either buy or sell when crossing above or below.",
            name: "Threshold",
            key: "stochasticThreshold",
            precision: 0
        },
        "STOP LOSS %": {
            defaultValue: .05,
            min: .001,
            max: .9990,
            step: .0005,
            description: "Percentage used to calculate the stop loss value after performing a buy or sell.",
            name: "Stop Loss Percent",
            key: "stopLoss",
            precision: 4,
            display: function(value){
                return parseFloat((value*100).toFixed(4)) + "%";
            },
            convertBack: function(value){
                return (parseFloat(value)/100).toFixed(4);
            }
        },
        "STOP TARGET %": {
            defaultValue: .05,
            min: .001,
            max: .9990,
            step: .0005,
            description: "Percentage used to calculate the profit target at which this trailing stop recalculates itself",
            name: "Stop Loss Percent",
            key: "stopLoss",
            precision: 4,
            display: function(value){
                return parseFloat((value*100).toFixed(4)) + "%";
            },
            convertBack: function(value){
                return (parseFloat(value)/100).toFixed(4);
            }
        },
        "TRADING LIMIT": {
            defaultValue: 98,
            min: 1,
            max: 98,
            step: 1,
            description: "Percentage of portfolio to be used for trading. This percentage applies to the quote currency amount present on the exchange and is not applicable for simulated traders.",
            name: "Trading Limit",
            key: "tradingLimit",
            precision: 0
        },
        "MACD": {
            description: "Tracks how far specified EMAs have converged or diverged, comonly used to identify shifts in price trends.",
            name: "Moving Avg Convergence Divergence",
            key: "macd"
        },
        "RSI": {
            description: "An index between 1-100 where 1 means completely oversold and 100 means completely overbought.",
            name: "Relative Strength Index",
            key: "rsi",
            defaultValue: "21",
            toToken: function(period){
                return "rsi(" + period + ")";
            }
        },
        "LMIN": {
            description: "Tracks the local maxima price of a given trading period",
            name: "Local Minima",
            key: "localMinima",
            defaultValue: "21",
            toToken: function(window){
                return "local-minima(" + window + ")";
            }
        },
        "LMAX": {
            description: "Tracks the local minima price of a given trading period",
            name: "Local Maxima",
            key: "localMaxima",
            defaultValue: "21",
            toToken: function(window){
                return "local-maxima(" + window + ")";
            }
        },
        "LB": {
            description: "The upper bollinger band, which is X standard deviations over the moving average.",
            name: "Lower Bollinger Band",
            key: "lowerBollinger",
            defaultValue: [21,2],
            toToken: function(values){
                return "lower-bollinger(" + values[0] + "," + values[1].toFixed(2) + ")";
            }
        },
        "UB": {
            description: "The lower bollinger band, which is X standard deviations below the moving average.",
            name: "Upper Bollinger Band",
            key: "upperBollinger",
            defaultValue: [21,2],
            toToken: function(values){
                return "upper-bollinger(" + values[0] + "," + values[1].toFixed(2) + ")";
            }
        },
        "OPEN": {
            description: "The price at which a specified interval opens at",
            name: "Interval Open Price",
            key: "open"
        },
        "CLOSE": {
            defaultValue: undefined,
            description: "The price at which a specified interval closes (ends) at",
            name: "Interval Close Price",
            key: "close",
            toToken: function(sma){
                return "close";
            }
        },
        "HIGH": {
            description: "The highest price at which the asset was sold during a specified period",
            name: "Interval High Price",
            key: "high"
        },
        "LOW": {
            description: "The lowest price at which the asset was sold during a specified period",
            name: "Interval Low Price",
            key: "low"
        },
        "RSI-INDEX": {
            defaultValue: 50,
            min: 1,
            max: 99,
            step: 1,
            description: "RSI index value ranging between 0-100",
            name: "RSI Value",
            key: "rsiIndex",
            precision: 0,
            toToken: function(value){
                return value;
            }
        }
    },

    DEMO_STRATEGIES: [
        {
            "strategyId": -1,
            "name": "Simple Moving Average - SMA",
            "buySignals": [{signal:"SMA-CLOSEOVER",sma:25}],
            "sellSignals": [{signal:"SMA-CLOSEUNDER",sma:25}],
            "stopLoss": {
                type: "standard",
                stopLossPercent: 0.1
            },
            "description": "Buys when the current close price moves above the SMA(25) line, " +
                           "and sells when it moves below.  This strategy stops out at a 10% loss."
        },
        {
            "strategyId": -2,
            "name": "Simple Moving Average Cross - SMAC",
            "buySignals": [{signal:"SMA-CROSSUP",smaSmaller:7,smaLarger:25}],
            "sellSignals": [{signal:"SMA-CROSSDOWN",smaSmaller:7,smaLarger:25}],
            "stopLoss": {
                type: "standard",
                stopLossPercent: 0.1
            },
            "description": "Buys when the SMA(7) line crosses above the SMA(25) line, " +
                           "and sells when it crosses below.  This strategy stops out at a 10% loss."
        },
        {
            "strategyId": -3,
            "name": "Exponential Moving Average - EMA",
            "buySignals": [{signal:"EMA-CLOSEOVER",ema:20}],
            "sellSignals": [{signal:"EMA-CLOSEUNDER",ema:20}],
            "stopLoss": {
                type: "standard",
                stopLossPercent: 0.1
            },
            "description": "Buys when the current close price moves above the EMA(20) line, " +
                           "and sells when it moves below.  This strategy stops out at a 10% loss."
        },
        {
            "strategyId": -4,
            "name": "Exponential Moving Average Cross - EMAC",
            "buySignals": [{signal:"EMA-CROSSUP",emaSmaller:20,emaLarger:50}],
            "sellSignals": [{signal:"EMA-CROSSDOWN",emaSmaller:20,emaLarger:50}],
            "stopLoss": {
                type: "standard",
                stopLossPercent: 0.1
            },
            "description": "Buys when the EMA(20) line crosses above the EMA(50) line, " +
                           "and sells when it crosses below.  This strategy stops out at a 10% loss."
        },
        {
            "strategyId": -5,
            "name": "Bollinger Bands - BB",
            "buySignals": [{signal:"LOWER-BOLLINGER-CROSSDOWN",sma:21,std:2.0}],
            "sellSignals": [{signal:"UPPER-BOLLINGER-CROSSUP",sma:21,std:2.0}],
            "stopLoss": {
                type: "standard",
                stopLossPercent: 0.1
            },
            "description": "Buys when current price closes below the 21 day lower bollinger band calculated using 2 standard deviations. " +
                           "Sells when the current price closes above the 21 day upper bollinger band.  This strategy stops out at a 10% loss."
        },
        {
            "id:": -6,
            "name": "Local Min-Max - LMM",
            "buySignals": [{signal:"LOCAL-MINIMA",windowSize:10}],
            "sellSignals": [{signal:"LOCAL-MAXIMA",windowSize:10}],
            "stopLoss": {
                type: "standard",
                stopLossPercent: 0.1
            },
            "description": "Buys when current price closes below the 21 day local minima. " +
                           "Sells when the current price closes above the 21 day local maxima.  This strategy stops out at a 10% loss."
        },
        {
            "strategyId": -7,
            "name": "Relative Strength Index - RSI",
            "buySignals": [{signal:"RSI-CROSSDOWN",period:21,threshold:30}],
            "sellSignals": [{signal:"RSI-CROSSUP",period:21,threshold:70}],
            "stopLoss": {
                type: "standard",
                stopLossPercent: 0.1
            },
            "description": "Buys when the relative strength index moves below a score of 30. " +
                           "Sells when the relative strength index moves above a score of 70. " + 
                           "This strategy stops out at a 10% loss."
        },
        {
            "strategyId": -8,
            "name": "Moving Average Convergence Divergence - MACD",
            "buySignals": [{signal:"MACD-CROSSUP",emaSmaller:12,emaLarger:26,emaSignal:9}],
            "sellSignals": [{signal:"MACD-CROSSDOWN",emaSmaller:12,emaLarger:26,emaSignal:9}],
            "stopLoss": {
                type: "standard",
                stopLossPercent: 0.1
            },
            "description": "Buys when the MACD value crosses above the 9 day moving average of MACD values. " +
                           "Sells when the MACD value crosses below the 9 day moving average of MACD values. " + 
                           "This strategy stops out at a 10% loss."
        },
        {
            "strategyId": -9,
            "name": "Stochastic Oscillator K-D Cross - SOC",
            "buySignals": [{signal:"STOCHASTIC-CROSSUP",kPeriod:14,dPeriod:3}],
            "sellSignals": [{signal:"STOCHASTIC-CROSSDOWN",kPeriod:14,dPeriod:3}],
            "stopLoss": {
                type: "standard",
                stopLossPercent: 0.1
            },
            "description": "Buys when the %K value of the stochastic oscillator crosses above the %D value. " +
                           "Sells the %K value of the stochastic oscillator crosses below the %D value. " + 
                           "This strategy stops out at a 10% loss."
        },
        {
            "strategyId": -10,
            "name": "Bullish MACD Cross - Trailing Stop Loss",
            "buySignals": [{signal:"MACD-CROSSUP",emaSmaller:12,emaLarger:26,emaSignal:9}],
            "sellSignals": [{signal:"TARGET-SELL",target:0.99}],
            "stopLoss": {
                type: "targetTrailing",
                stopLossPercent: 0.02,
                targetPercent: 0.02,
            },
            "description": "Buys when the MACD value crosses above the 9 day moving average of MACD values. " +
                           "Sells when the 2% trailing stop loss is triggered or 100% is reached. "
        }
    ],

    DEMO_TICKERS: [
        {
            exchange: "gemini",
            base: "BTC",
            quote: "USD",
            interval: "1d"
        },
        {
            exchange: "gemini",
            base: "ETH",
            quote: "USD",
            interval: "1d"
        },
        {
            exchange: "gdax",
            base: "LTC",
            quote: "USD",
            interval: "1d"
        },
        {
            exchange: "binance",
            base: "XRP",
            quote: "USDT",
            interval: "1d"
        },
        {
            exchange: "binance",
            base: "XLM",
            quote: "USDT",
            interval: "1d"
        },
        {
            exchange: "binance",
            base: "EOS",
            quote: "USDT",
            interval: "1d"
        },
        {
            exchange: "bittrex",
            base: "ZEC",
            quote: "USDT",
            interval: "1d"
        },
        {
            exchange: "bittrex",
            base: "DOGE",
            quote: "USDT",
            interval: "1d"
        }
    ],

    TEAM_DESCRIPTIONS: { 
        daniel: "Daniel Anderson is a Georgetown University alumnus who specialized in " +
                "Computer Science.  At university he helped publish novel " +
                "research within the area of Streaming Algorithms.  During his previous job with IBM he worked extensively " +
                "on industry-grade projects which utilize machine learning algorithms and techniques. " + 
                "Daniel works fulltime as CEO of Travas and leads development efforts on the platform. " + 
                "His technical skills include backend java development and front-end development using popular " +
                "frameworks such as Javascript React. ",
        matt: "Matthew Teeter's field of expertise is in Finance. At university, he read and published a " + 
              "variety of papers pertaining to asset management and market efficiency research. " +
              "He has worked on a wide array of trading algorithms including those related to futures, options, etfs, and cryptocurrencies. " +
              "He currently works full time for Travas creating and testing new algorithms for inclusion " +
              "on the platform.  Matthew also leads all marketing and company branding efforts alongside " +
              "helping with testing the platform services and functions."
    },

    FAQS: [
        {
            question: "Why should I use the Travas Platform?",
            answer: "The Travas Platform is designed to help research and trade cryptocurrencies.  " + 
                    "The platform also enables algorithmic/automated trading."
        },
        {
            question: "Are fees included in the backtest service?",
            answer: "Fees are not included as of the alpha release of the Travas Platform. " + 
                    "For a rough estimate of how much you will pay in fees for a particular " + 
                    "strategy, multiply the exchange trading fee by twice the number of trades. " + 
                    "For example, if you were testing a strategy on the Binance exchange and it " + 
                    "had made 15 trades you should expect to pay around 3% (.1% fee * 30 buy/sell orders). " + 
                    "The beta release of the Travas Platform will include a breakdown of the fees on every backtest."
        },
        {
            question: "What is the minimum amount I can trade with?",
            answer: <span> 
                        The minimum amount that can be traded heavily depends on the exchange used. 
                        Generally, the minimum trading limits are:
                      <ul>
                          <li>
                            .002 BTC
                          </li>
                          <li>
                            .001 ETH
                          </li>
                          <li>
                            .01 LTC
                          </li>
                          <li>
                            $10 USD
                          </li>
                      </ul>
                    </span>
        },
        {
            question: "How do I deposit funds into the Travas Platform?",
            answer: "The Travas Platform does not act as a wallet or exchange. " +
                    "Our software works by using APIs to interface with exchanges. " + 
                    "You can think of Travas as an assistant that allows you to create strategies " +
                    "and use them to trade on exchanges while always retaining full control over your " +
                    "own funds. The Travas Platform has no authority to make deposits or withdrawals into " +
                    "your account and its only function is to allow you to algorithmically trade your own capital."
        }
    ],

    METRICS_TOOLTIPS: {
        "TRAVAS SCORE": "This is an all round performance score calculated by Travas. " + 
            "The score separates the below metrics into risk and performance scores, then averages the two. " + 
            "The Travas score ranges between 1-100 where 1 is the worste and 100 is the best.",
        "AVG ROI": "The average return on investment over all trades.",
        "WINS": "The total wins this bot has achieved.",
        "LOSSES": "The total losses this bot has achieved.",
        "TRADES": "The total number of trades this bot has made.",
        "WIN/LOSS": "Total wins divided by total losses",
        "EXPECTANCY": "Excpeted return per trade",
        "PROFIT FACTOR": "The sum of all gains over the sum of all losses",
        "BEST TRADE": "The best return on investment per a single trade over all trades made.",
        "WORST TRADE": "The worst return on investment per single trade over all trades made.",
        "MAX DRAWDOWN": "The percent largest drawdown from the equity curves' peak to trough.",
        "TRADING LIM.": "Percentage of funds this bot trades with.  This value is always 100% for simulated bots.",
        "INTERVAL": "The kline interval this bots trades on.  In other words, how often this bot checks the price " +
            "and how often this bot decides to buy or sell.",
        "OWNER": "User who created, deployed and is running this bot."  
    },

    /**
     * Bucket indicators together buy the criteria
     * in which they are graphed
    */
    INDICATOR_CATEGORIES: {

    /**
     *  List of indicators that are graphable:
     *  Types:
     *    0 => Patterns
     *    1 => Price Based
     *    2 => Streaks
     *    3 => Percent Based
     */
    allIndicators:{
      "rsi":{
        chart: 3,
        callback: function(value){
          return value;
        }
      },
      "bearish-engulfing":{
        chart: 0,
        callback: function(value){
          if(value){
            return 1;
          }
          else{
            return -1;
          }
        }
      },
      "bullish-engulfing":{
        chart: 0,
        callback: function(value){
          if(value){
            return 1;
          }
          else{
            return -1;
          }
        }
      },
      "macd-ema":{
        chart: 4,
        callback: function(value){
          return value;
        }
      },
      "macd":{
        chart: 4,
        callback: function(value){
          return value;
        }
      },
      "sma":{
        chart: 1,
        callback: function(value){
          return value;
        }
      },
      "ema":{
        chart: 1,
        callback: function(value){
          return value;
        }
      },
      "green-streak":{
        chart: 2,
        callback: function(value){
          return value;
        }
      },
      "red-streak":{
        chart: 2,
        callback: function(value){
          return value;
        }
      },
      "lowerwick":{
        chart: 3,
        callback: function(value){
          return (value*100);
        }
      },
      "upperwick":{
        chart: 3,
        callback: function(value){
          return (value*100);
        }
      },
      "percentk":{
        chart: 3,
        callback: function(value){
          return value;
        }
      },
      "percentd":{
        chart: 3,
        callback: function(value){
          return value;
        }
      },
      "upper":{
        chart: 1,
        callback: function(value){
          return value;
        }
      },
      "lower":{
        chart: 1,
        callback: function(value){
          return value;
        }
      },
      "local-min":{
        chart: 1,
        callback: function(value){
          return value;
        }
      },
      "local-max":{
        chart: 1,
        callback: function(value){
          return value;
        }
      },
      "window":{
        chart: 1,
        callback: function(value){
          return value;
        }
      },
      "target":{
        chart: 1,
        callback: function(value){
          return value;
        }
      },
      "selltarget":{
        chart: 1,
        callback: function(value){
          return value;
        }
      },
      exists: function(indicator){
        for(let key in this){
            if(indicator.toLowerCase().includes(key.toLowerCase() || 
               indicator.toLowerCase() === key.toLowerCase())){
                return true;
            }
        }
        return false;
      }
    }
  }
}
export default Constants;
