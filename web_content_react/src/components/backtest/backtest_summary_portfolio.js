import React from "react";
import NVD3Chart from "react-nvd3";
import CryptoIcon from "../generic/crypto_coin";
import PortfolioSiders from "./portfolio_sliders";

export default class BacktestSummaryPortfolio extends React.Component {

    constructor(props){
        super(props);
        this.state={
            collapsed: false
        }
        this.rebalance = this.rebalance.bind(this);
    }

    weights = []

    /**
     * Maps percent return strings to floats and returns the 
     * std dev
     * @param {*} percentReturns 
     */
    calculateStdDev(percentReturns){
        let mapped = percentReturns.map((value) => 
            parseFloat(value)
        );
        this.stdDev = this.standardDeviation(mapped);
    }

    /**
     * Returns the std dev and sets avg return
     * @param {*} values 
     */
    standardDeviation(values){
        
        let avg = this.average(values);
        this.avg = avg;

        let squareDiffs = values.map(function(value){
          let diff = value - avg;
          let sqrDiff = diff * diff;
          return sqrDiff;
        });
        
        let avgSquareDiff = this.average(squareDiffs);
      
        let stdDev = Math.sqrt(avgSquareDiff);

        return stdDev;
    }

    /**
     * Calculate avg over dataset
     * @param {*} data 
     */
    average(data){
        let sum = data.reduce(function(sum, value){
          return sum + value;
        }, 0);
      
        let avg = sum / data.length;
        return avg;
    }

    buildDatum(){

        let values = []

        //Iterate over all networth points
        for(let i = 0; i < this.props.backtest.loggedReturns.length; i++) {

            //Grab and calculate Y-value (networth)
            const yValue = this.props.logScale ? Math.log(Number(this.props.backtest.loggedReturns[i])) : 
                           Number(this.props.backtest.loggedReturns[i]);
  
            //Push networth and timestamp
            values.push({
                x: new Date(this.props.backtest.timestamps[i]),
                y: yValue,
            });
        }

        let data = [];

        //Push networth line
        data.push({
            values: values,
            color: "blue"
        });

        return data;
    }

    /**
     * Rebalance the current portfolio
     */
    rebalance(weight,i){
        this.weights[i] = weight
        this.props.updateBacktest(this.weights);
    }

    //Check for init weight
    componentDidMount(){
        if(this.weights.length === 0){
            const defaultWeight = Math.floor(100/this.props.markets.length);
            for(let i=0;i<this.props.markets.length;i++){
                this.weights.push(defaultWeight);
            }
            this.setState({
                update: true
            });
        }
    }

    render(){

        
        const self = this;
        const networthAfterDeductions = this.props.backtest.finalNetworth-this.props.totalDeductions;
        const roiAfterDeductions = (networthAfterDeductions/this.props.backtest.initialInvestment)-1;

        this.calculateStdDev(this.props.backtest.percentGains);

        return <div>
        <div className="container border">
            <div className="row margins-10 clickable" onClick={ () => { 
                        self.setState({
                            collapsed: !self.state.collapsed
                        });
                    } } >
                <div className="col-md-3 margin-bottom-25 margin-top-25">
                    <h4>{ this.props.header } <br/></h4>
                </div>
                { this.state.collapsed &&
                    <div className="col-md-8">
                        <NVD3Chart type='lineChart'
                                datum={ this.buildDatum() }
                                showXAxis={ false }
                                showYAxis={ false }
                                showLegend={ false }
                                height={ 100 }/>
                    </div>
                }{ !this.state.collapsed && 
                    <div className="col-md-8 margin-top-25"/>
                }
                <div className="col-md-1">
                    <h4 className="margin-top-25">
                        { this.state.collapsed && 
                        <i className="fa fa-plus clickable"/> }
                        { !this.state.collapsed && 
                        <i className="fa fa-minus clickable"/> }
                    </h4>
                </div>
            </div>
            { !this.state.collapsed &&
            <div className="container-fluid">
                <NVD3Chart  type='lineChart'
                            datum={ this.buildDatum() }
                            showXAxis={ false }
                            showYAxis={ false }
                            showLegend={ false }
                            height={ 256 }/>
                <PortfolioSiders markets={ this.props.markets }
                                 weights={ this.weights }
                                 rebalance={ this.rebalance }/>
                <table className="table">
                    <tbody>
                        <tr>
                            <td>
                                Markets
                            </td>
                            <td>
                                { this.props.markets.join(", ").toUpperCase() }
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Strategies
                            </td>
                            <td>
                                { this.props.strategies.join(", ").toUpperCase() }
                            </td>
                        </tr>
                        <tr>
                        <td>
                            Period
                            </td>
                            <td>
                                { new Date(this.props.backtest.timestamps[0]) + 
                                    " - " + 
                                  new Date(this.props.backtest.timestamps[this.props.backtest.timestamps.length-1])
                                }
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Inital Investment { this.props.quote }
                            </td>
                            <td>
                                { this.props.backtest.initialInvestment }
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Final Networth
                            </td>
                            <td>
                                { this.props.backtest.initialInvestment < networthAfterDeductions ?
                                  <span className="text-success">{ networthAfterDeductions }</span> :
                                  <span className="text-danger">{ networthAfterDeductions }</span>
                                }
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Return on Investment
                            </td>
                            <td>
                                { roiAfterDeductions > 0 ?
                                  <span className="text-success">{ (roiAfterDeductions*100).toFixed(2)+"%" }</span> :
                                  <span className="text-danger">{ (roiAfterDeductions*100).toFixed(2)+"%" }</span>
                                }
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Average Return Per Trade
                            </td>
                            <td>
                                { this.avg.toFixed(2) + "%" }
                            </td>
                        </tr>
                        <tr>
                            <td>
                            Total Trades
                            </td>
                            <td>
                                { this.props.backtest.numTrades }
                            </td>
                        </tr>
                        <tr>
                            <td>
                            Win Rate
                            </td>
                            <td>
                                { parseFloat(this.props.backtest.winRatio) > .5 ?
                                  <span className="text-success">{ this.props.backtest.winRatio.toFixed(2) }</span> :
                                  <span className="text-danger">{ this.props.backtest.winRatio.toFixed(2) }</span>
                                }
                            </td>
                        </tr>
                        <tr>
                            <td>
                            Profit Factor
                            </td>
                            <td>
                                { this.props.backtest.profitFactor > 1 ? 
                                  <span className="text-success">{ this.props.backtest.profitFactor.toFixed(2) }</span> :
                                  <span className="text-danger">{ this.props.backtest.profitFactor.toFixed(2) }</span>
                                }
                            </td>
                        </tr>
                        <tr>
                            <td>
                            Expectancy (% Return)
                            </td>
                            <td>
                                { this.props.backtest.expectancy > 0 ? 
                                  <span className="text-success">{ this.props.backtest.expectancy.toFixed(2) }</span> :
                                  <span className="text-danger">{ this.props.backtest.expectancy.toFixed(2) }</span>
                                }
                            </td>
                        </tr>
                        <tr>
                            <td>
                            Max Drawdown
                            </td>
                            <td>
                                { this.props.backtest.maxDrawdown.toFixed(2) + "%" }
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Trade Volatility
                            </td>
                            <td>
                                { this.stdDev.toFixed(2) + "%" }
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Fees & Slippage
                            </td>
                            <td>
                                { this.props.totalDeductions.toFixed(2) } { this.props.quote }
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        }
    </div>
    </div>
    }
}