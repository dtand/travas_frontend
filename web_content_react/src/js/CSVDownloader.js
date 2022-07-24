let CSVDownloader = {

    downloadCSV : function (csv,filename){
        
        let csvFile;
        let downloadLink;

        // CSV file
        csvFile = new Blob([csv], {type: "text/csv"});

        // Download link
        downloadLink = document.createElement("a");

        // File name
        downloadLink.download = filename;

        // Create a link to the file
        downloadLink.href = window.URL.createObjectURL(csvFile);

        // Hide download link
        downloadLink.style.display = "none";

        // Add the link to DOM
        document.body.appendChild(downloadLink);

        // Click download link
        downloadLink.click();
    },

    downloadBacktestCsv: function(filename, backtestResults, params, extra){
        filename += '.csv';
        let csv = [];

        const market    = params.market;
        const strategy  = params.strategy;

        const initial   = backtestResults.initialInvestment;
        const final     = backtestResults.finalNetworth;
        const roi       = backtestResults.returnOnInvestment;
        const numTrades = backtestResults.numTrades;
        const winRate   = backtestResults.winRatio;
        const lossRate  = backtestResults.lossRatio;
        const expect    = backtestResults.expectancy;
        const vol		= extra.volatility;
        const profitFact= backtestResults.profitFactor;
        const maxDD     = backtestResults.maxDrawdown;
        const fee       = extra.fee;
        const slippage  = extra.slippage;
        const totalHit  = extra.totalHit;

        csv.push( ["RESULTS"] );
        csv.push( ["market",market].join(",") );
        csv.push( ["initial",initial].join(",") );
        csv.push( ["final",final].join(",") );
        csv.push( ["strategy",strategy].join(",") );
        csv.push( ["roi",roi].join(",") );
        csv.push( ["num trades",numTrades].join(",") );
        csv.push( ["win rate",winRate].join(",") );
        csv.push( ["loss rate",lossRate].join(",") );
        csv.push( ["expectancy",expect].join(",") );
        csv.push( ["profit factor",profitFact].join(",") );
        csv.push( ["max drawdown",maxDD].join(",") );
        csv.push( ["volatility",vol].join(",") );
        csv.push( ["fee per trade",fee].join(",") );
        csv.push( ["slippage per trade",slippage].join(",") );
        csv.push( ["total hit (fee and slippage)",totalHit].join(",") );
        
        let headers = ["OPEN","CLOSE"];
        let buyIndicatorKeys  = [];
        let sellIndicatorKeys = [];
        for( var key in backtestResults.indicators[ 0 ].buyIndicators ){
                if( key === "class" ){
                    continue;
                }
                headers.push( "BUY-SIGNAL-" + key );
                buyIndicatorKeys.push( key );
        }
        for( var key in backtestResults.indicators[ 0 ].sellIndicators ){
            if( key === "class" ){
                continue;
            }
            headers.push( "SELL-SIGNAL-" + key );
            sellIndicatorKeys.push( key );
        }
        headers.push("ACTION");headers.push("NETWORTH");headers.push("% GAIN/LOSS");headers.push("STOP LOSS TARGET");
        csv.push( headers.join(",") );
        
        let x = 0;
        for ( var i = 0; i < backtestResults.loggedReturns.length; i++ ) {
            var row = [ backtestResults.priceDataOpens[i], backtestResults.priceDataCloses[i] ];
            
            for( var k = 0; k < buyIndicatorKeys.length; k++ ){
                    let key = buyIndicatorKeys[ k ];
                    row.push( backtestResults.indicators[i].buyIndicators[key] );
            }
            for( var k = 0; k < sellIndicatorKeys.length; k++ ){
                    let key = sellIndicatorKeys[ k ];
                    row.push( backtestResults.indicators[i].sellIndicators[key] );
            }
            
            row.push( backtestResults.loggedActions[i] );
            row.push( backtestResults.loggedReturns[i] );
            if( backtestResults.loggedActions[i] === "SELL" ){
                row.push( backtestResults.percentGains[x] );
                x++;
            }
            else{
                row.push( "0%" );
            }
            
            row.push(backtestResults.stopLossTargets[i]);
            
            csv.push(row.join(","));        
        }
        
        this.downloadCSV(csv.join("\n"), filename);
    },

    downloadBotTradesCsv: function(filename, botLogs, bot){
        filename += '.csv';
        var csv = [];
        let headers = ["TIMESTAMP", "CLOSE PRICE", "NETWORTH", "ASSET HOLDINGS", "QUOTE HOLDINGS", "ACTION"];
        let buyIndicatorKeys  = [];
        let sellIndicatorKeys = [];
        
        
        csv.push("TRADE METRICS")
        csv.push("SCORE,"+bot.score);
        csv.push("ROI,"+bot.roi);
        csv.push("WINS,"+bot.totalWins);
        csv.push("LOSSES,"+bot.totalLosses);
        csv.push("TRADES,"+(bot.totalWins+bot.totalLosses));
        csv.push("WIN/LOSS,"+bot.winLoss);
        csv.push("EXPECTANCY,"+bot.expectancy);
        csv.push("PROFIT FACTOR,"+bot.profitFactor);
        csv.push("BEST TRADE,"+bot.bestTrade);
        csv.push("WORST TRADE,"+bot.worstTrade);
        csv.push("MAX DRAWDOWN,"+bot.maxDrawdown);
        csv.push("");
        csv.push("");

        for( var key in botLogs[ 0 ].indicators.buyIndicators ){
                if( key === "class" ){
                    continue;
                }
                headers.push( "BUY-SIGNAL-" + key );
                buyIndicatorKeys.push( key );
        }
        for( var key in botLogs[ 0 ].indicators.sellIndicators ){
            if( key === "class" ){
                continue;
            }
            headers.push( "SELL-SIGNAL-" + key );
            sellIndicatorKeys.push( key );
        }
        csv.push(headers.join(","));
        let x = 0;
        for ( var i = 0; i < botLogs.length; i++ ) {
            var row = [ botLogs[ i ].timestamp, 
                             botLogs[ i ].closePrice,
                        botLogs[ i ].networth,
                         botLogs[ i ].assets, 
                         botLogs[ i ].quotes, 
                         botLogs[ i ].action ];
            for( var k = 0; k < buyIndicatorKeys.length; k++ ){
                    let key = buyIndicatorKeys[ k ];
                    row.push( botLogs[ i ].indicators.buyIndicators[key] );
            }
            for( var k = 0; k < sellIndicatorKeys.length; k++ ){
                    let key = sellIndicatorKeys[ k ];
                    row.push( botLogs[ i ].indicators.sellIndicators[key] );
            }
      
            csv.push(row.join(","));        
        }
        
        this.downloadCSV(csv.join("\n"), filename);
    }
}

export default CSVDownloader;