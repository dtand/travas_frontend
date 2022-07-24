import React from "react";
import NVD3Chart from "react-nvd3";
import ApiController from "../../js/ApiController";
import CSVDownloader from "../../js/CSVDownloader";
import NotificationController from "../../js/NotificationController";
import CryptoIcon from "../generic/crypto_coin";

export default class BacktestSummary extends React.Component {

    totalDeducations = 0

    state={
        collapsed: true
    }

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
        let runningFee = 0;

        //Iterate over all networth points
        for(let i = 0; i < this.props.backtest.loggedReturns.length; i++) {
          
            if(this.props.backtest.loggedActions[i] === "BUY" ||
               this.props.backtest.loggedActions[i] === "SELL"){
                runningFee += (Number(this.props.backtest.loggedReturns[i])-runningFee)*this.props.fee;
                runningFee += (Number(this.props.backtest.loggedReturns[i])-runningFee)*this.props.slippage;
            }

            //Grab and calculate Y-value (networth)
            const yValue = this.props.logScale ? Math.log(Number(this.props.backtest.loggedReturns[i])-runningFee) : 
                           Number(this.props.backtest.loggedReturns[i]-runningFee);
  
            //Push networth and timestamp
            values.push({
                x: new Date(this.props.backtest.timestamps[i]),
                y: yValue,
            });
        }

        this.totalDeducations = runningFee;

        let data = [];

        //Push networth line
        data.push({
            values: values,
            color: this.props.color
        });

        return data;
    }

    componentDidMount(){
        if(this.props.startOpen){
            this.setState({
                collapsed: false
            });
        }
    }

    render(){

        
        const self = this;
        const quote = this.props.backtestParams.market.split("-")[1].toUpperCase();
        const networthAfterDeductions = this.props.backtest.finalNetworth-this.props.totalDeductions;
        const roiAfterDeductions = (networthAfterDeductions/this.props.backtest.initialInvestment)-1;

        this.calculateStdDev(this.props.backtest.percentGains);

        return <div className="container border">
            <div className="row margins-10 clickable" 
                 onClick={ () => { 
                    self.setState({
                        collapsed: !self.state.collapsed
                    });
                } } >
            <div className="col-md-1 margin-top-25">
                <span>
                    <CryptoIcon coinName={ self.props.backtestParams.market.split("-")[0].toLowerCase() }/>
                </span>
            </div>
            <div className="col-md-2 margin-bottom-10 margin-top-25">
                <h4>{ this.props.header } <br/> { 
                     roiAfterDeductions > 0 ?
                    <span className="text-success">↑{ (roiAfterDeductions*100).toFixed(2)+"%" }</span> :
                    <span className="text-danger">↓{ (roiAfterDeductions*100).toFixed(2)+"%" }</span> 
                } </h4>
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
                <div className="col-md-8"/>
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
                <div className="row margin-bottom-10 margin-left-5">
                    <button className="btn btn-secondary"
                            onClick={ function(){
                                self.setState({
                                    savingBot: true
                                });
                                if(!self.props.demo){
                                  const params = self.props.backtestParams;
                                  const payload={
                                    "strategyId": params.strategyId,
                                    "botName": "BACKTEST_" + self.props.backtestParams.market,
                                    "private": false,
                                    "tradingLimit": 0.98,
                                    "exchange": params.exchange,
                                    "baseCurrency": params.market.split("-")[0].toLowerCase(),
                                    "counterCurrency": params.market.split("-")[1].toLowerCase(),
                                    "interval": params.candleSize,
                                    "isSimulated": true
                                  }
                                  ApiController.doPostWithToken(
                                    "save_bot",
                                    payload,
                                    function(response,params){ 
                                        self.setState({
                                            savingBot: false
                                        });
                                        self.props.onSaveBotSuccess(response,params);
                                    },
                                    payload,
                                    () => {
                                        self.setState({
                                            savingBot: false
                                        });
                                    }
                                  );
                                }
                                else if(self.props.demo){
                                  NotificationController.displayNotification(
                                    <a href="signup">SIGNUP</a>,
                                    "This feature is unavailable in demo mode, please sign up for a free account to continue",
                                    "info"
                                  );
                                }
                            } }>
                        SAVE BOT { this.state.savingBot ? <i className="fa fa-spin fa-spinner"/> : <i className="fa fa-gears"/> }
                    </button>
                    <button className="btn btn-secondary margin-left-10" 
                            onClick={ () => 
                                CSVDownloader.downloadBacktestCsv(
                                new Date() + "-backtest",
                                this.props.backtest,
                                {
                                    market: self.props.backtestParams.market,
                                    strategy: self.props.getStrategyWithId(self.props.backtestParams.strategyId).name
                                },
                                {
                                    fee: this.props.fee,
                                    slippage: this.props.slippage,
                                    volatility: this.stdDev.toFixed(2) + "%",
                                    totalHit: this.totalDeducations
                                }) }>
                        DOWNLOAD CSV <i className="fa fa-download"/>
                    </button>
                </div>
                <NVD3Chart  type='lineChart'
                            datum={ this.buildDatum() }
                            showXAxis={ false }
                            showYAxis={ false }
                            showLegend={ false }
                            height={ 256 }/>
                <table className="table">
                    <tbody>
                        <tr>
                            <td>
                                Market
                            </td>
                            <td>
                                { 
                                this.props.backtestParams.exchange.toUpperCase() + " | " +
                                this.props.backtestParams.market.toUpperCase() + " (" +
                                this.props.backtestParams.candleSize.toUpperCase() + ")"
                                }
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Strategy
                            </td>
                            <td>
                                { 
                                    !this.props.demo ?
                                    this.props.getStrategyWithId(this.props.backtestParams.strategyId).name.toUpperCase() :
                                    this.props.backtestParams.strategy.name.toUpperCase()
                                }
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
                                Inital Investment { quote }
                            </td>
                            <td>
                                { this.props.backtest.initialInvestment }
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Final Networth { quote }
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
                                  <span className="text-success">{ this.props.backtest.winRatio }</span> :
                                  <span className="text-danger">{ this.props.backtest.winRatio }</span>
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
                            Expectancy
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
                                { this.props.backtest.maxDrawdown }
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
                                { this.totalDeducations.toFixed(2) + " " + quote }
                                <i>{ " - " + ((this.totalDeducations / this.props.backtest.initialInvestment)*100).toFixed(2)+"% of initial investment"}</i>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        }
    </div> 
    }
}