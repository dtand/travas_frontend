import React from "react";
import BacktestSummaryPortfolio from "./backtest_summary_portfolio";

export default class BacktestPortfolioPanel extends React.Component {


    constructor(props){
        super(props);
        this.updateBacktest = this.updateBacktest.bind(this);
        this.calculateDefaultWeights = this.calculateDefaultWeights.bind(this);
    }
    
    quote = undefined

    interval = undefined

    totalDeductions = 0

    markets = []

    strategies = []

    weights = undefined

    isValid(){

        let valid    = true;

        this.quote = undefined

        this.interval = undefined
    
        this.totalDeductions = 0
    
        this.markets = []
    
        this.strategies = []

        //Iterate over all parameters
        for(let b=0;b<this.props.backtestParams.backtests.length;b++){

            //Backtest is empty - skip
            if(Object.keys(this.props.backtestResults[b]).length === 0){
                continue;
            }

            //Grab params
            const params = this.props.backtestParams.backtests[b];

            //Init quote and interval
            if(this.quote === undefined && this.interval === undefined){
                this.quote    = params.market.split("-")[1];
                this.interval = params.candleSize;
            }

            //Check that successive test have same quote and interval
            else{
                valid = this.quote === params.market.split("-")[1] && this.interval === params.candleSize;
                if(!valid){
                    return valid;
                }
            }

            //Append base and strategy names
            this.markets.push(params.market.split("-")[0]);
            this.strategies.push(this.props.getStrategyWithId(params.strategyId).name);
        }

        return valid;
    }

    updateBacktest(weights){
        this.weights = [];
        for(let w=0;w<weights.length;w++){
            this.weights[w] = weights[w]/100;
        }
        this.setState({
            update: true
        });
    }

    calculateDefaultWeights(){
        let weights = [];
        const defaultWeight = 1/this.markets.length;
        for(let i=0;i<this.markets.length;i++){
            weights.push(defaultWeight);
        }
        return weights;
    }

    aggregateData(weights){

        if(!weights){
            weights = this.calculateDefaultWeights();
        }

        let loggedReturns = [];
        let percentGains  = [];
        let timestamps    = [];
        let numTrades     = 0;
        let wins          = 0;
        let totalWon      = 0;
        let losses        = 0;
        let totalLost     = 0;

        this.totalDeductions = 0;


        //Number of empty tests, will be deducted from index to
        //grab correct weight for test
        let skips = 0;

        //Iterate over backtests
        for(let b=0;b<this.props.backtestResults.length;b++){

            //Grab backtest
            const backtest = this.props.backtestResults[b];
            let g = 0;
            let runningFee = 0;

            //Backtest is empty
            if(!backtest.loggedReturns){
                skips++;
                continue;
            }

            //Aggregate networths
            for(let l=0;l<backtest.loggedReturns.length;l++){

                //Grab networth and gain/loss percent
                let networth = backtest.loggedReturns[l]*weights[b-skips];
                const gain     = 0;
                
                //Check for a gain
                if(backtest.loggedActions[l] === "SELL"){
                    gain = backtest.percentGains[g++];
                }  

                if(backtest.loggedActions[l] === "BUY" ||
                   backtest.loggedActions[l] === "SELL"){
                    runningFee += (Number(backtest.loggedReturns[l])*weights[b-skips]-runningFee)*this.props.fee;
                    runningFee += (Number(backtest.loggedReturns[l])*weights[b-skips]-runningFee)*this.props.slippage;
                    this.totalDeductions += ((Number(backtest.loggedReturns[l])-runningFee)*this.props.fee) + 
                                            ((Number(backtest.loggedReturns[l])-runningFee)*this.props.slippage)
                 }

                networth -= runningFee;

                //Initial interation
                if(b === 0){
                    loggedReturns.push(networth)
                    timestamps.push(backtest.timestamps[l]);
                }

                //Aggregate networth
                else{
                    loggedReturns[l] += networth;
                }

                //Append win
                if(parseFloat(gain) > 0){
                    wins += 1;
                    totalWon += parseFloat(gain);
                }

                //Append loss
                else{
                    losses += 1;
                    totalLost += parseFloat(gain);
                }

                //Append gain/loss percent
                percentGains.push(gain);
            }

            //Update trade count
            numTrades += backtest.numTrades;

        }

        //Update trade metrics
        const winPercent  = wins/numTrades;
        const lossPercent = losses/numTrades;
        const avgWin      = totalWon/wins;
        const avgLoss     = totalLost/losses;

        //Return aggregated objects
        return{
            loggedReturns: loggedReturns,
            percentGains: percentGains,
            timestamps: timestamps,
            returnOnInvestment: this.returnOnInvestment(loggedReturns),
            finalNetworth: loggedReturns[loggedReturns.length-1],
            winRatio: winPercent,
            numTrades: numTrades,
            expectancy: this.expectancy(winPercent,avgWin,lossPercent,avgLoss),
            profitFactor: this.profitFactor(totalWon,totalLost),
            maxDrawdown: this.maxDrawdown(loggedReturns),
            initialInvestment: loggedReturns[0]
        }
    }

    /**
     * Calculate return on investment
     * @param {*} networths 
     */
    returnOnInvestment(networths){
        return networths[networths.length-1]/networths[0] - 1.00;
    }

    /**
     * Calculate expectancy
     * @param {*} winPercent 
     * @param {*} avgWin 
     * @param {*} lossPercent 
     * @param {*} avgLoss 
     */
    expectancy(winPercent,avgWin,lossPercent,avgLoss){
        return (winPercent*avgWin) - (lossPercent*avgLoss);
    }

    /**
     * Calculate profit factor over win/loss totals
     * @param {*} totalWon 
     * @param {*} totalLost 
     */
    profitFactor(totalWon,totalLost){
        return totalWon/totalLost;
    }

    /**
     * Calculate maxdrawdown over networth data
     * @param {*} networths 
     */
    maxDrawdown(networths){

        let maxNetworth = -9999;
        let maxDrawdown = -9999;

        //Iterate over all networths
        for(let n=0;n<networths.length;n++){
            maxNetworth  = Math.max(maxNetworth,networths[n]);
            let drawdown = Math.abs(((maxNetworth-networths[n]) / maxNetworth));
            maxDrawdown  = Math.max(drawdown,maxDrawdown);
        }

        return maxDrawdown;
    }

    render(){

        //If no backtests, return blank
        if(!this.props.backtestResults || 
            this.props.backtestResults.length === 0){
            return <h2 className="text-center margin-top-100">
                No data.
            </h2>
        }

        //If false tests cannot create portfolio
        if(!this.isValid()){
            return <h2 className="text-center margin-top-100">
                Selected interval and quote must be the <br/> same for all tests to generate a portfolio.
            </h2> 
        }

        const aggregatedData = this.aggregateData(this.weights);

        return <BacktestSummaryPortfolio header={ this.props.header }
                                         backtest={ aggregatedData }
                                         quote={ this.quote } 
                                         interval={ this.interval }
                                         markets={ this.markets }
                                         strategies={ this.strategies }
                                         totalDeductions={ this.totalDeductions }
                                         updateBacktest={ this.updateBacktest }/>
    }
}             