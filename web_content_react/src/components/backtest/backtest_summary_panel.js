import React from "react";
import BacktestSummary from "./backtest_summary";

const colors = [
    "blue",
    "lightblue",
    "orange",
    "#ffb87c",
    "green"
]

export default class BacktestSummaryPanel extends React.Component {

    render(){

        //If no backtests, return blank
        if(!this.props.backtestResults || 
            this.props.backtestResults.length === 0){
            return <h2 className="text-center margin-top-100">
                No data.
            </h2>
        }

        //Grab backtests and associated parameters
        let backtests  = [];
        let parameters = [];

        //Filter backtests by only pushing non-zero objects
        for(let b=0; b<this.props.backtestResults.length;b++){
            if(Object.keys(this.props.backtestResults[b]).length !== 0){
                backtests.push(this.props.backtestResults[b])
                parameters.push(this.props.backtestParams.backtests[b]);
            }
        }

        //Generate list of summary components
        const summaries = backtests.map((backtest,i) =>
            <div className="margins-5">
                <BacktestSummary startOpen={ i === 0 }
                                 demo={ this.props.demo }
                                 header={ "BACKTEST #" + (i+1) } 
                                 backtest={ backtest }
                                 backtestParams={ parameters[i] }
                                 getStrategyWithId={ this.props.getStrategyWithId }
                                 color={ colors[i] }
                                 fee={ this.props.fee }
                                 slippage={ this.props.slippage }
                                 totalDeductions={ this.props.slippageValues[i] + this.props.feeValues[i] }
                                 onSaveBotSuccess={ this.props.onSaveBotSuccess }/>
            </div>
        );

        //Return summary list
        return summaries;
    }
}