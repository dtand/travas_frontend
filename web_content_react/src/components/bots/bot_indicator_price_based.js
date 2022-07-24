import React from "react"
import LineWithFocusChart from "../generic/line_with_focus_chart";
import Loader from "../generic/loader";
import GlobalStateController from "../../js/GlobalStateController"
import d3 from 'd3';
import Utils from "../../js/Utils";

const WIDTH_CONSTANT_TOGGLED=2.75;

const WIDTH_CONSTANT=3.25;

const HEIGHT_CONSTANT=1.35;

export default class BotIndicatorGraph extends React.Component {

  constructor(props){
    super(props);
    const self = this;
    GlobalStateController.registeredComponentWithState(self,"platformToggled");
  }

  buildDatum() {

    if(this.props.botLogs.length === 0){
      return [];
    }

    const indicatorKeys = this.getIndicatorKeys(
      this.props.botLogs[0].indicators.buyIndicators,
      this.props.botLogs[0].indicators.sellIndicators
    );

    let indicatorData = [];
    let closePrices   = [];
    let buys          = [];
    let sells         = [];

    for(let k=0;k<indicatorKeys.length;k++){
      indicatorData.push([]);
    }

    for(let l=0;l<this.props.botLogs.length;l++){

      const log = this.props.botLogs[l];

      let indicators = this.getIndicators(
        log.indicators.buyIndicators,
        log.indicators.sellIndicators
      );
     
      for(let k=0;k<indicatorKeys.length;k++){
        indicatorData[k].push({
          x: new Date(log.timestamp),
          y: indicators[indicatorKeys[k]],
          a: log.action,
          k: indicatorKeys[k]
        });
      }
      if(this.props.closePrices){
        closePrices.push({
          x: new Date(log.timestamp),
          y: log.closePrice,
          closePrice: true
        });
      }
      if(log.action === "BUY"){
        buys.push({
          x: new Date(log.timestamp),
          y: log.closePrice,
          a: log.action,
          buy: "BUY"
        });
      }
      else{
        buys.push({});
      }
      if(log.action === "SELL"){
        sells.push({
          x: new Date(log.timestamp),
          y: log.closePrice,
          a: log.action,
          sell: "SELL"
        });
      }
      else{
        sells.push({});
      }
    }

    let lines = [];

    for(let k=0;k<indicatorKeys.length;k++){
      lines.push({
        key: indicatorKeys[k],
        values: indicatorData[k],
        area: false
      });
    }

    if(this.props.closePrices){
      lines.push({
        key: "close-prices",
        values: closePrices,
        color: "#1c2e40a3",
        area: false
      });
    }

    if(this.props.buySignals){
      lines.push({
        key: "buy-series",
        values: buys,
        classed: 'buy-series'
      });
    }

    if(this.props.sellSignals){
      lines.push({
        key: "sell-signals",
        values: sells,
        classed: 'sell-series'
      });
    }

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
    
    //Check that indicators are relevant
    if(this.props.relevantIndicators.includes(buyIndicators.class)){
      for(var key in buyIndicators){
        if(key != "class"){
            let newKey = buyIndicators.class + "-" + key;
            result[newKey] = buyIndicators[key]
        }
      }
    }

  //Check that sell indicators are relevant
  if(this.props.relevantIndicators.includes(sellIndicators.class)){
    for(var key in sellIndicators){
      if(key != "class"){
        let newKey     = sellIndicators.class + "-" + key;
        result[newKey] = sellIndicators[key]
      }
   }
  }
    return result;
  }

  filterValues(){

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
              "<h5 class='text-left' style='margin-left:10px'> Close: " + y + "</h5>";
            }
            else if(data.point.sell || data.point.buy){
              if(data.point.buy){
                return "<h4 class='border-bottom text-success' style='margin-top:10px;margin-left:10px;margin-bottom:10px;margin-right:10px'>Signal - " + a + "</h4>" +
                "<h5 class='text-left text-black' style='margin-left:10px'> Close Price: " + y + "</h5>";
              }
              else if(data.point.sell){
                return "<h4 class='border-bottom text-danger' style='margin-top:10px;margin-left:10px;margin-bottom:10px;margin-right:10px'>Signal - " + a + "</h4>" +
                "<h5 class='text-left text-black' style='margin-left:10px'> Close Price: " + y + "</h5>";
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

