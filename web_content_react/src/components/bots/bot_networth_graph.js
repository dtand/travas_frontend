import React from "react"
import LineWithFocusChart from "../generic/line_with_focus_chart";
import Loader from "../generic/loader";
import SimpleToggle from "../generic/simple_toggle";
import GlobalStateController from "../../js/GlobalStateController"
import d3 from 'd3';
import Utils from "../../js/Utils";

const WIDTH_CONSTANT_TOGGLED=2.75;

const WIDTH_CONSTANT=3.25;

const HEIGHT_CONSTANT=1.3;


export default class BotNetworthGraph extends React.Component {

  constructor(props){
    super(props);

    this.min = 1000000000;
    this.max = 0;

    this.yMin = 1000000000;
    this.yMax = 0;

    const self = this;
    GlobalStateController.registeredComponentWithState(self,"platformToggled");
  }

  buildDatum() {

    this.min = 1000000000;
    this.max = 0;

    this.yMin = 1000000000;
    this.yMax = 0;

    let data       = [];
    let buyAndHold = [];
    let lastBuy    = undefined;
    let start      = undefined;
    let bh         = 0;
    let buys       = [];
    let sells      = [];
    let stopLine   = [];

    const stopLoss = this.props.botLogs.length > 0 && 
                     this.getCurrentStopLoss(this.props.botLogs) ? 
                      this.getCurrentStopLoss(this.props.botLogs) :
                      0;

    for(let l=0;l<this.props.botLogs.length;l++){

      const log = this.props.botLogs[l];
      let networth = log.networth;
      let gain  = 0;

      if(l === 0){
        bh = 1.00 / log.closePrice;
      }

      if(start === undefined){
        start = log.networth;
      }

      if(log.action === "SELL" && lastBuy != undefined){
        gain = (parseFloat(log.networth)/lastBuy) - 1.00;
      }

      const percentChangeNetworth = 
        (((log.networth/start) - 1.00)).toFixed(4);

      this.min = Math.min(this.min,log.networth);
      this.max = Math.max(this.max,log.networth);

      this.yMin = Math.min(this.yMin,log.networth);
      this.yMax = Math.max(this.yMax,log.networth);

      data.push({
        y: this.props.percentChange ? percentChangeNetworth : parseFloat(networth).toFixed(4),
        x: new Date(log.timestamp),
        z: parseFloat(log.closePrice).toFixed(8),
        classed: "test",
        w: gain,
        a: log.action,
        m: log.message,
        b: log.assets,
        i: this.getIndicators(log.indicators.buyIndicators, log.indicators.sellIndicators),
      });

      stopLine.push({
        y: stopLoss,
        x: new Date(log.timestamp),
        stopLoss: stopLoss ? 
                    this.props.botLogs[this.props.botLogs.length-1].indicators.stopLoss.stopLoss :
                    0
      });

      if(log.action === "BUY"){
        buys.push({
          y: this.props.percentChange ? percentChangeNetworth : parseFloat(networth).toFixed(4),
          x: new Date(log.timestamp),
          shape: 'circle',
          z: parseFloat(log.closePrice).toFixed(8), 
          w: gain,
          a: log.action,
          m: log.message,
          b: log.assets,
          i: this.getIndicators(log.indicators.buyIndicators, log.indicators.sellIndicators),
        });
      }
      if(log.action === "SELL"){
        sells.push({
          y: this.props.percentChange ? percentChangeNetworth : parseFloat(networth).toFixed(4),
          x: new Date(log.timestamp),
          shape: 'circle',
          z: parseFloat(log.closePrice).toFixed(8), 
          w: gain,
          a: log.action,
          m: log.message,
          b: log.assets,
          i: this.getIndicators(log.indicators.buyIndicators, log.indicators.sellIndicators),
        });
      }
      if(log.action !== "SELL"){
        sells.push({});
      }

      let buyAndHoldValue = (bh * log.closePrice).toFixed(4);

      const percentChangeBh = 
        (((buyAndHoldValue/start) - 1.00)).toFixed(4);

      if(this.props.buyAndHold){
        const compare = Number(bh * log.closePrice);
        this.yMin = Math.min(this.yMin,compare);
        this.yMax = Math.max(this.yMax,compare);
      }

      buyAndHold.push({
        x: new Date(log.timestamp),
        y: this.props.percentChange ? percentChangeBh : buyAndHoldValue,
        s: (((bh * log.closePrice - log.networth) / buyAndHoldValue) * 100).toFixed(4),
        buyAndHold: true
      });

      if(log.action === "BUY"){
        lastBuy = log.networth;
      }
    }

    let lines = [];

    lines.push({
      values: data,
      color: '#007bff',
      area: true,
    });

    if(this.props.buyAndHold){
      lines.push({
        key: "buy-and-hold",
        values: buyAndHold,
        color: 'rgba(14, 54, 95, 1)',
        area: false
      });
    }

    if(this.props.buySignals){
      lines.push({
        key: 'buySeries',
        values: buys,
        classed: 'buy-series'
      });
    }

    if(this.props.sellSignals){
      lines.push({
        key: 'sellSeries',
        values: sells,
        classed: 'sell-series'
      });
    }

    if(this.props.showStopLoss && stopLoss != 0){
      lines.push({
        key: "stop loss",
        values: stopLine,
        color: 'red'
      });
    }

    return lines;
  }

  getCurrentStopLoss(botLogs){
    if(botLogs.length === 0){
      return undefined;
    }
    if(botLogs[botLogs.length-1].indicators.stopLoss){
      return botLogs[botLogs.length-1].indicators.stopLoss.stopLoss * 
             botLogs[botLogs.length-1].assets;
    }
    return undefined;
  }

  getIndicators(buyIndicators,sellIndicators){
    var result = {};
    for(var key in buyIndicators) result[key]  = buyIndicators[key];
    for(var key in sellIndicators) result[key] = sellIndicators[key];
    return result;
  }

  getGraphInfo(){
    return (<strong className="graph-info text-secondary">
      MAX NETWORTH: { this.max } 
      {" | "} 
      MIN NETWORTH: { this.min }
      {" | "} 
      MAX DRAWDOWN (sell to buy): { this.props.maxDrawdown } 
    </strong>);
  }

  componentDidUpdate(){
    Utils.clearTooltips();
  }

  render() {
    const self = this;
    const datum = this.buildDatum();

    return (
      <div id={ this.props.panelId }>
        { this.props.botLogs &&
        <div> 
         { this.getGraphInfo() } 
        <LineWithFocusChart 
          showYAxis={ true }
          showLegend={ false }
          graphId={ this.props.panelId + "-graph" }
          datum={ datum }
          precision={ 2 }
          showLegend={ false }
          focusHeight={ 75 }
          yDomain={ this.getCurrentStopLoss(this.props.botLogs) !== 0 ? 
                      [Math.min(this.yMin,this.getCurrentStopLoss(this.props.botLogs)),this.yMax] :
                      [this.yMin,this.yMax]  }
          height={ (window.innerHeight / HEIGHT_CONSTANT) }
          width={window.innerWidth / (GlobalStateController.getValue("platformToggled") ? WIDTH_CONSTANT : WIDTH_CONSTANT_TOGGLED )}
          tooltip={{contentGenerator: function(data){
            
            const x = d3.time.format('%d/%m/%y')(new Date(data.point.x));
            const y = parseFloat(data.point.y).toFixed(4); /** Date */

            if(data.point.buyAndHold){
              const s = data.point.s;
              return "<h4 class='text-danger border-bottom' style='margin-top:10px;margin-left:10px;margin-bottom:10px;margin-right:10px'>" + x + " - SELL</h4>" +
              "<h5 class='text-left text-black' style='margin-left:10px'> Networth: " + y + "</h5>" + 
              "<h5 class='text-left text-black' style='margin-left:10px'> Spread: " + s + "%</h5>";
            }
            else if(data.point.stopLoss){
              return "<h4 class='text-danger border-bottom' style='margin-top:10px;margin-left:10px;margin-bottom:10px;margin-right:10px'> STOP LOSS </h4>" +
              "<h5 class='text-left text-black' style='margin-left:10px'> Networth Value: " + data.point.y.toFixed(4) + "</h5>" +
              "<h5 class='text-left text-black' style='margin-left:10px'> Stop Price: " + data.point.stopLoss + "</h5>";
            }

            const z = parseFloat(data.point.z).toFixed(8); /** Close price */
            const w = parseFloat(data.point.w).toFixed(4); /** Gain */
            const a = data.point.a; /** Current Action */
            const b = data.point.b; /** Assets held */
            const i = data.point.i; /** Indicators */

            let indicatorString = "";
            const keys = Object.keys(i);
            for(let k=0; k < keys.length;k++){
              const key = keys[k];
              const value = i[key];
              if(key !== "class"){
                indicatorString += "<h5 class='text-black' style='margin-left:10px'>" + 
                key.toUpperCase() + ": " + 
                parseFloat(value) + "</h5>";
              }
            }

            if(a === "BUY"){
              return "<h4 class='text-success border-bottom' style='margin-top:10px;margin-left:10px;margin-bottom:10px;margin-right:10px'>" + x + " - BUY</h4>" +
                     "<h5 class='text-left text-black' style='margin-left:10px'> Networth: " + y + "</h5>" +
                     "<h5 class='text-left text-black' style='margin-left:10px'> Assets Held: " + b + "</h5>" +
                     "<h5 class='text-left text-black' style='margin-left:10px'> Last Price: " + z + "</h5>" +
                     indicatorString;
            }
            else if(a === "SELL" && w >= 0){
              return "<h4 class='text-danger border-bottom' style='margin-top:10px;margin-left:10px;margin-bottom:10px;margin-right:10px'>" + x + " - SELL</h4>" +
                     "<h5 class='text-left text-black' style='margin-left:10px'> Networth: " + y + "</h5>" +
                     "<h5 class='text-left text-black' style='margin-left:10px'> Assets Held: " + b + "</h5>" +
                     "<h5 class='text-left text-black' style='margin-left:10px'> Last Price: " + z + "</h5>" +
                     "<h5 class='text-left text-black' style='margin-left:10px;margin-right:10px'> Gain: " + "<span class='text-success'>" + (w*100).toFixed(4)+"%" + "</span>" + "</h5>" +
                     indicatorString;
            }
            else if(a === "SELL" && w < 0){
              return "<h4 class='text-danger border-bottom' style='margin-top:10px;margin-left:10px;margin-bottom:10px;margin-right:10px'>" + x + " - SELL</h4>" +
                     "<h5 class='text-left text-black' style='margin-left:10px'> Networth: " + y + "</h5>" +
                     "<h5 class='text-left text-black' style='margin-left:10px'> Assets Held: " + b + "</h5>" +
                     "<h5 class='text-left text-black' style='margin-left:10px'> Last Price: " + z + "</h5>" +
                     "<h5 class='text-left text-black' style='margin-left:10px;margin-right:10px'> Loss: " + "<span class='text-danger'>" + (w*100).toFixed(4)+"%" + "</span>" + "</h5>" +
                     indicatorString;
            }
            else{
              return "<h4 class='text-primary border-bottom' style='margin-top:10px;margin-left:10px;margin-bottom:10px;margin-right:10px'>" + x + " - HOLD</h4>" +
              "<h5 class='text-left text-black' style='margin-left:10px'> Networth: " + y + "</h5>" +
              "<h5 class='text-left text-black' style='margin-left:10px'> Assets Held: " + b + "</h5>" +
              "<h5 class='text-left text-black' style='margin-left:10px'> Last Price: " + z + "</h5>" +
              indicatorString;
            }
            }}}/>
            </div>
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

