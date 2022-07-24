import React from "react"
import LineWithFocusChart from "../generic/line_with_focus_chart"
import Dropdown from "../generic/dropdown"
import ApiController from "../../js/ApiController"
import IconHeader from "../generic/icon_header"
import d3 from 'd3'
import CSVDownloader from "../../js/CSVDownloader"
import NotificationController from "../../js/NotificationController"
import GlobalStateController from "../../js/GlobalStateController"
import Constants from "../../js/Constants";

const MARGIN_TOP = {
  marginTop: "10px"
}

const WIDTH_CONSTANT_TOGGLED=2.5;

const WIDTH_CONSTANT=3.0;

const HEIGHT_CONSTANT=1.25;

export default class BacktestNetworthGraph extends React.Component {

  constructor(props){
    super(props);
    this.state={
      domain: {
        min: Number.MAX_SAFE_INTEGER,
        max: 0
      }
    }
    this.buildKeys = this.buildKeys.bind(this);
    this.buildDatum = this.buildDatum.bind(this);
    this._buildDatum = this._buildDatum.bind(this);
  }

  
  buildKeys(params){
    let keys = [];
    for(let p=0;p<params.length;p++){
      const settings = params[p];
      const market   = settings.market;
      const exchange = settings.exchange;
      const interval = settings.candleSize;
      const strategy = this.props.getStrategyWithId(settings.strategyId).name;
      keys.push(exchange + "/" + market + "/" + interval + "/" + strategy);
    }
    return keys;
  }

  _buildDatum(backtestResults,keys){

    let lines  = [];
    let linesBuyAndHold = [];
    let linesSells = [];
    let linesBuys = [];
    let table  = [];
    let colClasses = [];
    let buyAndHoldSet = new Set();
    let runningDeductions = 0;

    for(let b=0;b<backtestResults.length;b++){

      const backtest = backtestResults[b];
      let values     = [];
      let buyAndHold = [];
      let sells = [];
      let buys  = [];
      
      let p=0;
      if(Object.keys(backtest).length === 0){
        continue;
      }

      let runningFee = 0;

      for(let i = 0; i < backtest.loggedReturns.length; i++) {
          
          if(backtest.loggedActions[i] === "BUY" ||
             backtest.loggedActions[i] === "SELL"){
            runningFee += (Number(backtest.loggedReturns[i])-runningFee)*this.props.fee;
            runningFee += (Number(backtest.loggedReturns[i])-runningFee)*this.props.slippage;
          }

          const yValue = (this.props.logScale ? 
                          Math.log(Number(backtest.loggedReturns[i]) - runningFee) : 
                          Number(backtest.loggedReturns[i])) - runningFee;

          const yValueBuyAndHold = this.props.logScale ? 
                                   Math.log(Number(backtest.loggedBuyAndHold[i])) : 
                                   Number(backtest.loggedBuyAndHold[i]);

          values.push({
              x: new Date(backtest.timestamps[i]),
              y: yValue,
              z: backtest.loggedActions[i],
              w: backtest.loggedActions[i] === 
                "SELL" ? backtest.percentGains[p++] : 0
          });

          buyAndHold.push({
            x: new Date(backtest.timestamps[i]),
            y: yValueBuyAndHold
          });

          if(backtest.loggedActions[i] === "BUY"){
            buys.push({
              y: yValue,
              x: new Date(backtest.timestamps[i]),
              shape: 'circle',
            });
          }

          if(backtest.loggedActions[i] === "SELL"){
            sells.push({
              y: yValue,
              x: new Date(backtest.timestamps[i]),
              shape: 'circle',
            });
          }

          if(backtest.loggedActions[i] !== "SELL"){
            sells.push({});
          }
      }

      lines.push({
        key:  "(" + (b+1) + ") " + keys[b],
        values: values,
        area: false
      });

      let setKey = keys[b].split('/');
      const market = setKey[0];
      const strategy = setKey[3];
      setKey = setKey[0]+ "/" + setKey[1] + "/" + setKey[2] + "B&H";

      if(this.props.buyAndHold && !buyAndHoldSet.has(setKey)){
        linesBuyAndHold.push({
          key: setKey,
          values: buyAndHold,
          area: false
        });
        buyAndHoldSet.add(setKey);
      }

      if(this.props.sellSignals){
        linesSells.push({
          key:  "#" + b + "-SELLS",
          values: sells,
          classed: 'sell-series',
          area: false
        });
      }
      if(this.props.buySignals){
        linesBuys.push({
          key:  "#" + b + "-BUYS",
          values: buys,
          classed: 'buy-series',
          area: false
        });
      }

      const csvName = d3.time.format('%d/%m/%y')(new Date()) + "_travas_backtest.csv";
      const self    = this;

      const dropdownData = [
        <div>
          <i class="fa fa-download" aria-hidden="true" style={ {marginRight: "5px"} }/>
          <a onClick={ () => CSVDownloader.downloadBacktestCsv(csvName,backtest,{
            market: market,
            strategy: strategy
          }) }> DOWNLOAD CSV </a>
        </div>,
        <div>  
          <i class="fa fa-cogs" aria-hidden="true" style={ {marginRight: "5px"} }/>
          <a onClick={ function(){
            if(!self.props.demo){
              const params = self.props.backtestParams.backtests[b];
              const payload={
                "strategyId": params.strategyId,
                "botName": "BACKTEST_" + (self.props.archivedTests.length-self.props.selectedTest) + "_" + (b+1),
                "private": false,
                "tradingLimit": 1.00,
                "exchange": params.exchange,
                "baseCurrency": params.market.split("-")[0].toLowerCase(),
                "counterCurrency": params.market.split("-")[1].toLowerCase(),
                "interval": params.candleSize,
                "isSimulated": true
              }
              ApiController.doPostWithToken(
                "save_bot",
                payload,
                self.onSaveBotSuccess,
                payload
              )
            }
            else if(self.props.demo){
              NotificationController.displayNotification(
                <a href="signup">SIGNUP</a>,
                "This feature is unavailable in demo mode, please sign up for a free account to continue",
                "info"
              );
            }
          } }> SAVE BOT </a>
        </div> ];

      const colOne = (<div>
                      { "#" + (b+1) }
                      <Dropdown mini={ true }
                      dropdownList={ dropdownData }
                      header={ <IconHeader iconClass="fa fa fa-tasks"
                                          textClass="text-center"
                                          header="ACTIONS"
                                          anchor="left"/> 
                                          }
                      onClickRow={ function(){} }
                      buttonText={ "" }/>
      </div>);
    if(!Constants.IS_MOBILE){
        table.push([
          colOne,
          backtest.finalNetworth.toFixed(2),
          backtest.returnOnInvestment,
          backtest.numTrades,
          backtest.winRatio,
          backtest.expectancy.toFixed(2),
          backtest.profitFactor.toFixed(2),
          backtest.maxDrawdown,
        ]);
      colClasses.push(this.getColumnClasses(backtest,b));
    }
    else{
      table.push([
        colOne,
        backtest.finalNetworth.toFixed(2),
        backtest.returnOnInvestment,
        backtest.numTrades
      ]);
      const classes = this.getColumnClasses(backtest,b);
      classes[3] = "text-black";
      colClasses.push(classes);
    }
    }

    for(let l=0;l<linesBuyAndHold.length;l++){
      lines.push(linesBuyAndHold[l]);
    }
    for(let s=0;s<linesSells.length;s++){
      lines.push(linesSells[s]);
    }
    for(let b=0;b<linesBuys.length;b++){
      lines.push(linesBuys[b]);
    }

    return {
      lines: lines,
      table: table,
      colClasses: colClasses
    }
  }

  buildDatum(){
    if(this.props.backtestResults && this.props.backtestResults.length > 0){
      return this._buildDatum(this.props.backtestResults,this.buildKeys(this.props.backtestParams.backtests));
    }
    return {
      lines: [],
      table: [],
      colClasses: []
    }
  }

  getEmptyTests(backtestResults){
    if(!backtestResults){
      return 0;
    }
    let empties = 0;
    for(let b=0;b<backtestResults.length;b++){

      const backtest = backtestResults[b];
      let values     = [];
      let buyAndHold = [];
      
      let p=0;
      if(Object.keys(backtest).length === 0){
        empties++;
      }
    }
    return empties;
  }

  getColumnClasses(backtest,index){
    return[
      "text-nowrap font-weight-bold",
      this.getClassFromValue(backtest.finalNetworth,backtest.initialInvestment),
      this.getClassFromValue(Number(backtest.returnOnInvestment.replace('%','')),0),
      "text-nowrap font-weight-bold",
      this.getClassFromValue(Number(backtest.winRatio.replace('%','')),50),
      this.getClassFromValue(backtest.expectancy,0),
      this.getClassFromValue(backtest.profitFactor,1.0),
      "text-nowrap font-weight-bold",
      "text-nowrap font-weight-bold"
    ]
  }

  getClassFromValue(value, threshold){
    if(value < threshold){
      return "text-danger text-nowrap font-weight-bold";
    }
    else if(value > threshold){
      return "text-success text-nowrap font-weight-bold";
    }
    return "text-nowrap font-weight-bold";
  }

  render() {

    //If no backtests, return blank
    if(!this.props.backtestResults || 
        this.props.backtestResults.length === 0){
        return <h2 className="text-center margin-top-100">
            No data.
        </h2>
    }
    const data     = this.buildDatum();

    return (
        <div className="text-center" style={ MARGIN_TOP }>
          <LineWithFocusChart showLegend={ true }
                            domain={ this.state.domain } 
                            datum={ data.lines }
                            height={ window.innerHeight / HEIGHT_CONSTANT }
                            width={ window.innerHeight / (GlobalStateController.getValue("platformToggled") ? WIDTH_CONSTANT : WIDTH_CONSTANT_TOGGLED ) }
                            precision={ 2 }
                            logScale={ this.props.logScale }
                            focusHeight={ 100 }
                            tooltip={{contentGenerator: function(data){
                              const x = d3.time.format('%d/%m/%y')(new Date(data.point.x));
                              const y = data.point.y.toFixed(2);
                              const z = data.point.z;
                              const w = data.point.w;

                              if(z === "BUY"){
                                return "<h4 class='text-success border-bottom' style='margin-top:10px;margin-left:10px;margin-bottom:10px;margin-right:10px'>" + x + " - BUY</h4>" +
                                       "<h5 class='text-left text-black' style='margin-left:10px'> Networth: " + y + "</h5>";
                              }
                              else if(z === "SELL" && parseFloat(w) >= 0){
                                return "<h4 class='text-danger border-bottom' style='margin-top:10px;margin-left:10px;margin-bottom:10px;margin-right:10px'>" + x + " - SELL</h4>" +
                                       "<h5 class='text-left text-black' style='margin-left:10px'> Networth: " + y + "</h5>" +
                                       "<h5 class='text-left text-black' style='margin-left:10px;margin-right:10px'> Gain: " + "<span class='text-success'>" + w + "</span>" + "</h5>";
                              }
                              else if(z === "SELL" && parseFloat(w) < 0){
                                return "<h4 class='text-danger border-bottom' style='margin-top:10px;margin-left:10px;margin-bottom:10px;margin-right:10px'>" + x + " - SELL</h4>" +
                                       "<h5 class='text-left text-black' style='margin-left:10px'> Networth: " + y + "</h5>" +
                                       "<h5 class='text-left text-black' style='margin-left:10px;margin-right:10px'> Loss: " + "<span class='text-danger'>" + w + "</span>" + "</h5>";
                              }
                              return "<h4 class='text-primary border-bottom' style='margin-top:10px;margin-left:10px;margin-bottom:10px;margin-right:10px'>" + x + " - HOLD</h4>" +
                                      "<h5 class='text-left text-black' style='margin-left:10px;margin-right:10px'> Networth: " + y + "</h5>";
                            }}}/>
        </div>
    );
  }
}

