import React from "react"
import LineWithFocusChart from "../generic/line_with_focus_chart";
import Loader from "../generic/loader";
import GlobalStateController from "../../js/GlobalStateController"
import d3 from 'd3';
import Utils from "../../js/Utils";
import Constants from "../../js/Constants";

const WIDTH_CONSTANT_TOGGLED=2.75;

const WIDTH_CONSTANT=3.25;

const HEIGHT_CONSTANT=1.35;

export default class BotIndicatorGraph extends React.Component {

  constructor(props){
    super(props);

    const self = this;
    GlobalStateController.registeredComponentWithState(self,"platformToggled");
  }

  /**
   * Returns the current selected chart
   */
  getSelectedChart(){
    for(let i=0;i<5;i++){
      if(this.props.graphType[i]){
        return i;
      }
    }
    return 0;
  }

  /**
   * Iterates over all indicators to find matching graph category object
   * @param {inicator string} indicator 
   */
  getIndicatorChart(indicator){
    for(let k=0;k<Object.keys(Constants.INDICATOR_CATEGORIES.allIndicators).length;k++){
      const key = Object.keys(Constants.INDICATOR_CATEGORIES.allIndicators)[k];
      if (indicator.toLowerCase().includes(key.toLowerCase()) || indicator.toLowerCase() === key.toLowerCase()){
        return Constants.INDICATOR_CATEGORIES.allIndicators[key];
      }
    }
  }

  buildDatum() {

    //Check that data exists
    if(this.props.botLogs.length === 0){
      return [];
    }

    //Grab keys for all unique indicators
    const indicatorKeys = this.getIndicatorKeys(
      this.props.botLogs[this.props.botLogs.length-1].indicators.buyIndicators,
      this.props.botLogs[this.props.botLogs.length-1].indicators.sellIndicators
    );

    //Set data arrays
    let indicatorData = [];
    let closePrices   = [];
    let buys          = [];
    let sells         = [];
    let stopLosses    = [];

    //Preset length of indicator data lines
    for(let k=0;k<indicatorKeys.length;k++){
      indicatorData.push([]);
    }

    //Which chart are we using
    const chartId = this.getSelectedChart();


    //Iterate over all logs
    for(let l=0;l<this.props.botLogs.length;l++){

      //Grab log
      const log = this.props.botLogs[l];

      //Grab current indicators
      let indicators = this.getIndicators(
        log.indicators.buyIndicators,
        log.indicators.sellIndicators
      );
     
      //Iterate indicators
      for(let k=0;k<indicatorKeys.length;k++){

        //Callback function for indicator displays
        const callback = this.getIndicatorChart(indicatorKeys[k]).callback;

        //Push indicator value
        if(indicators[indicatorKeys[k]] !== 0 ){
          indicatorData[k].push({
            x: new Date(log.timestamp),
            y: callback(indicators[indicatorKeys[k]]),
            a: log.action,
            k: indicatorKeys[k]
          });
        }else{
          indicatorData[k].push({});
        }

        //Push buy signals
        if(log.action === "BUY" && k === 0){
          buys.push({
            x: new Date(log.timestamp),
            y: chartId !== 1 ? callback(indicators[indicatorKeys[k]]) : log.closePrice,
            a: log.action,
            buy: "BUY",
            close: log.closePrice
          });
        }
        else{
          buys.push({});
        }

        //Push sell signals
        if(log.action === "SELL" && k === 0){
          sells.push({
            x: new Date(log.timestamp),
            y: chartId !== 1 ? callback(indicators[indicatorKeys[k]]) : log.closePrice,
            a: log.action,
            sell: "SELL",
            close: log.closePrice
          });
        }
        else{
          sells.push({});
        }

      }

      //Show close price on price based chart
      if(chartId === 1){
        closePrices.push({
          x: new Date(log.timestamp),
          y: log.closePrice,
          closePrice: true
        });
      }

      //Show stop loss values
      if(chartId === 1){

        if(log.indicators.stopLoss && log.indicators.stopLoss.stopLoss !== 0){
          stopLosses.push({
            x: new Date(log.timestamp),
            y: log.indicators.stopLoss.stopLoss,
            stopLoss: true
          });
        }
        else{
          stopLosses.push({});
        }
      }
    }
    
    //All lines
    let lines = [];

    //Add indicator values
    for(let k=0;k<indicatorKeys.length;k++){
      lines.push({
        key: indicatorKeys[k],
        values: indicatorData[k],
        area: false
      });
    }

    //Only show close price on price based graph
    if(chartId === 1){
      lines.push({
        key: "close-prices",
        values: closePrices,
        color: "#1c2e40a3",
        area: false
      });
    }

    //Only show stop loss on price based
    if(chartId === 1){
      lines.push({
        key: "stop-losses",
        values: stopLosses,
        color: "red",
        area: false
      });
    }

    //Buy series
    lines.push({
      key: "buy-series",
      values: buys,
      classed: 'buy-series'
    });

    //Sell series
    lines.push({
      key: "sell-signals",
      values: sells,
      classed: 'sell-series'
    });

    return lines;

  }

  getIndicatorKeys(buyIndicators,sellIndicators){
    let keys = Object.keys(this.getIndicators(buyIndicators,sellIndicators));
    let index = keys.indexOf("class");
    if (index !== -1) keys.splice(index, 1);
    return keys;
  }

  getIndicators(buyIndicators,sellIndicators){
    var result = {};
    var all = new Map();
    for(let b in buyIndicators){
       if(b != "class" && !all.get(b)){
          let newKey = b;
          const graphObject = this.getIndicatorChart(b);
          if(graphObject && graphObject.chart === this.getSelectedChart()){
            result[newKey] = buyIndicators[b];
          }
       }
       all.set(b,true);
    }
    for(var s in sellIndicators){
      if(s != "class" && !all.get(s)){
        let newKey = s;
        const graphObject = this.getIndicatorChart(s);
        if(graphObject && graphObject.chart === this.getSelectedChart()){
          result[newKey] = sellIndicators[s];
        }
     }
     all.set(s,true);
   }
    return result;
  }

  componentDidUpdate(){
    Utils.clearTooltips();
  }

  render() {
    const self = this;
    return (
      <div id={ this.props.panelId }>
        { this.props.botLogs &&
        <LineWithFocusChart 
          showYAxis={true}
          showLegend={true}
          graphId={ this.props.panelId + "-graph" }
          datum={ this.buildDatum() }
          precision={ 2 }
          focusHeight={ 75 }
          height={ (window.innerHeight / HEIGHT_CONSTANT) }
          width={window.innerWidth / (GlobalStateController.getValue("platformToggled") ? WIDTH_CONSTANT : WIDTH_CONSTANT_TOGGLED )}
          tooltip={{contentGenerator: function(data){
            const x = d3.time.format('%d/%m/%y')(new Date(data.point.x));
            const y = data.point.y;
            const a = data.point.a;
            const k = data.point.k;
            
            if(data.point.closePrice){
              return "<h4 class='border-bottom text-black' style='margin-top:10px;margin-left:10px;margin-bottom:10px;margin-right:10px'>" + x + "</h4>" +
              "<h5 class='text-left text-black' style='margin-left:10px'> Close: " + y + "</h5>";
            }
            else if(data.point.stopLoss){
              return "<h4 class='border-bottom text-black' style='margin-top:10px;margin-left:10px;margin-bottom:10px;margin-right:10px'>" + x + "</h4>" +
              "<h5 class='text-left text-black' style='margin-left:10px'> Stop Price: " + y + "</h5>";
            }
            else if(data.point.sell || data.point.buy){
              if(data.point.buy){
                return "<h4 class='border-bottom text-success' style='margin-top:10px;margin-left:10px;margin-bottom:10px;margin-right:10px'>Signal - " + a + "</h4>" +
                "<h5 class='text-left text-black' style='margin-left:10px'> Close Price: " + data.point.close + "</h5>";
              }
              else if(data.point.sell){
                return "<h4 class='border-bottom text-danger' style='margin-top:10px;margin-left:10px;margin-bottom:10px;margin-right:10px'>Signal - " + a + "</h4>" +
                "<h5 class='text-left text-black' style='margin-left:10px'> Close Price: " + data.point.close + "</h5>";
              }
            }
            else{
              return "<h4 class='border-bottom  text-black' style='margin-top:10px;margin-left:10px;margin-bottom:10px;margin-right:10px'>" + x + " - " + a + "</h4>" +
              "<h5 class='text-left text-black' style='margin-left:10px'> " + k + ": " + y + "</h5>";
            }
          }}}/>
          }
      { !this.props.botLogs && 
        <div style={ { marginBottom: "400px" } }>
          <Loader loadingMessage="Loading trades..."/>
        </div>
      }
      </div>
    );
  }
}

