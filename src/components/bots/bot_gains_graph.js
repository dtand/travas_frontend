import React from "react"
import LineWithFocusChart from "../generic/line_with_focus_chart";
import Loader from "../generic/loader";
import GlobalStateController from "../../js/GlobalStateController"
import d3 from 'd3';
import Utils from "../../js/Utils";

const WIDTH_CONSTANT_TOGGLED=2.75;

const WIDTH_CONSTANT=3.25;

const HEIGHT_CONSTANT=1.35;

const HEIGHT_CONSTANT_GRID=1.75;

export default class BotGainsGraph extends React.Component {

  constructor(props){
    super(props);
    const self = this;
    this.min=100000000;
    this.max=-10000000;
    GlobalStateController.registeredComponentWithState(self,"platformToggled");
  }

  buildDatum() {

    let data      = [];
    let dataAvg   = [];
    let lastBuy   = undefined;
    let movingSum = 0;
    let movingAvg = 0;
    let trades    = 0;
    this.min=100000000;
    this.max=-10000000;

    for(let l=0;l<this.props.botLogs.length;l++){

      const log = this.props.botLogs[l];
      let gain  = 0;

      if(log.action === "SELL" && lastBuy != undefined){
        gain = (parseFloat(log.networth)/lastBuy) - 1.00;
      }

      this.min = Math.min(this.min,gain);
      this.max = Math.max(this.max,gain);

      if(log.action === "SELL"){
        data.push({
          x: new Date(log.timestamp),
          y: gain,
          a: log.action
        });
        dataAvg.push({
          x: new Date(log.timestamp),
          y: movingAvg,
          s: (((Math.abs(movingAvg)-gain) / Math.abs(movingAvg)) * 100).toFixed(4)         
        });
      }

      if(log.action === "BUY"){
        lastBuy = log.networth;
      }
    }

    if(this.props.movingAverage){
      return [{
        key: 0,
        color: '#007bff',
        values: data,
        area: false
      },
      {
        key: 1,
        color: 'rgba(14, 54, 95, 1)',
        values: dataAvg,
        area: false       
      }]
    }
    return [{
      color: '#007bff',
      values: data,
      area: false
    }]


  }

  getGraphInfo(){
    return (<strong className="graph-info text-secondary">
      MAX RETURN: { this.max } 
      {" | "} 
      MIN RETURN: { this.min }
      {" | "} 
      WIN/LOSS: { this.props.winLoss } 
    </strong>);
  }

  componentDidUpdate(){
    Utils.clearTooltips();
  }

  render() {
    const self = this;
    const datum = this.buildDatum()
    return (
      <div id={ this.props.panelId }>
        { this.props.botLogs &&
         <div> 
          { this.getGraphInfo() } 
          <LineWithFocusChart 
            percents={ true }
            showYAxis={true}
            showLegend={false}
            graphId={ this.props.panelId + "-graph" }
            datum={ datum }
            precision={ 2 }
            focusHeight={ 75 }
            height={ (window.innerHeight / HEIGHT_CONSTANT) }
            width={window.innerWidth / (GlobalStateController.getValue("platformToggled") ? WIDTH_CONSTANT : WIDTH_CONSTANT_TOGGLED )}
            tooltip={{contentGenerator: function(data){
              const x = d3.time.format('%d/%m/%y')(new Date(data.point.x));
              const y = data.point.y;

              if(data.point.s){
                return "<h4 class='border-bottom text-black' style='margin-top:10px;margin-left:10px;margin-bottom:10px;margin-right:10px'>" + x + "</h4>" +
                "<h5 class='text-left' style='margin-left:10px'> Moving Avg: " + data.point.y + "%</h5>";
              }
              else if(y >= 0){
                return "<h4 class='border-bottom text-black' style='margin-top:10px;margin-left:10px;margin-bottom:10px;margin-right:10px'>" + x + "</h4>" +
                  "<h5 class='text-left text-success' style='margin-left:10px'> Gain: " + (y*100).toFixed(2) + "%</h5>";
              }
              else{
                return "<h4 class='border-bottom text-black' style='margin-top:10px;margin-left:10px;margin-bottom:10px;margin-right:10px'>" + x + "</h4>" +
                  "<h5 class='text-left text-danger' style='margin-left:10px'> Loss: " + (y*100).toFixed(2) + "%</h5>";
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

