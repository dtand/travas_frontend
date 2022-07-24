import React from "react"
import LineWithFocusChart from "../generic/line_with_focus_chart";
import Loader from "../generic/loader";
import GlobalStateController from "../../js/GlobalStateController"
import d3 from 'd3';
import Utils from "../../js/Utils";

const WIDTH_CONSTANT_TOGGLED=2.75;

const WIDTH_CONSTANT=3.25;

const HEIGHT_CONSTANT=1.35;

export default class BotStreakGraph extends React.Component {

  constructor(props){
    super(props);
    const self = this;
    this.maxWin = 0;
    this.maxLoss = 0;
    GlobalStateController.registeredComponentWithState(self,"platformToggled");
  }


  buildDatum() {

    let data       = [];
    let dataLoss   = [];
    let lastBuy    = undefined;
    let streakWin  = 0;
    let streakLoss = 0;

    this.maxLoss = 0;
    this.maxWin  = 0;

    for(let l=0;l<this.props.botLogs.length;l++){

      const log = this.props.botLogs[l];
      let gain  = 0;
      
      if(log.action.toUpperCase() === "SELL"){
        gain = (parseFloat(log.networth)/lastBuy) - 1.00;
        if(gain < 0){
          streakLoss = streakLoss+1; 
          streakWin  = 0;

          if(this.props.gainWeighted){
            this.maxLoss = Math.max(this.maxLoss,streakLoss * Math.abs(gain));
          }
          else{
            this.maxLoss = Math.max(this.maxLoss,streakLoss);
          }
        } 
        else if(gain > 0){
          streakWin = streakWin+1;  
          streakLoss = 0;

          if(this.props.gainWeighted){
            this.maxWin = Math.max(this.maxWin,streakWin * Math.abs(gain));
          }
          else{
            this.maxWin = Math.max(this.maxWin,streakWin);
          }
        }

        data.push({
          y: this.props.gainWeighted ? streakWin * Math.abs(gain) : streakWin,
          x: new Date(log.timestamp),
          w: gain.toFixed(4)
        });

        dataLoss.push({
          y: this.props.gainWeighted ? streakLoss * Math.abs(gain) : streakLoss,
          x: new Date(log.timestamp),
          w: gain.toFixed(4)
        });
      }
      else if(log.action.toUpperCase() === "BUY"){
        lastBuy = parseFloat(log.networth);
      }
    }

    if(this.props.winOnly){
      return [
        {
          key: 1,
          values: data,
          color: '#28a745',
          area: false
        }
      ];
    }
    else if(this.props.lossOnly){
      return [
        {
          key: 1,
          values: dataLoss,
          color: '#dc3545',
          area: false
        }
      ]
    }
    else{
      return [
        {
          key: 1,
          values: data,
          color: '#28a745',
          area: false
        },
        {
          key: 2,
          values: dataLoss,
          color: '#dc3545',
          area: false
        }
      ];
    }
  }

  getGraphInfo(){
    return (<strong className="graph-info text-secondary">
      MAX WIN STREAK: { this.maxWin } 
      { " | " }
      MAX LOSE STREAK: { this.maxLoss }
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
            showYAxis={false}
            showLegend={ false }
            graphId={ this.props.panelId + "-graph" }
            datum={ datum }
            precision={ 2 }
            showLegend={ false }
            focusHeight={ 75 }
            yDomain={ [0,Math.max(this.maxWin,this.maxLoss)] }
            height={ (window.innerHeight / HEIGHT_CONSTANT) }
            width={window.innerWidth / (GlobalStateController.getValue("platformToggled") ? WIDTH_CONSTANT : WIDTH_CONSTANT_TOGGLED )}
            tooltip={{contentGenerator: function(data){
              
              const x = d3.time.format('%d/%m/%y')(new Date(data.point.x));
              const y = data.point.y;
              const w = data.point.w;

              if(data.point.movingAverage){
                return "<h4 class='text-danger border-bottom' style='margin-top:10px;margin-left:10px;margin-bottom:10px;margin-right:10px'>" + x + "</h4>" +
                "<h5 class='text-left text-black' style='margin-left:10px'> Moving Avg: " + y + "</h5>" + 
                "<h5 class='text-left text-black' style='margin-left:10px'> Spread: " + w + "%</h5>";
              }

              if(w >= 0){
                return "<h4 class='text-success border-bottom' style='margin-top:10px;margin-left:10px;margin-bottom:10px;margin-right:10px'>" + x + " (WIN)" + "</h4>" +
                      "<h5 class='text-left text-black' style='margin-left:10px'> Streak: " + y + "</h5>" +
                      "<h5 class='text-left text-black' style='margin-left:10px;margin-right:10px'> Gain: " + "<span class='text-success'>" + (w*100).toFixed(4)+"%" + "</span>" + "</h5>";
              }
              else{
                return "<h4 class='text-danger border-bottom' style='margin-top:10px;margin-left:10px;margin-bottom:10px;margin-right:10px'>" + x + " (LOSS)" + "</h4>" +
                "<h5 class='text-left text-black' style='margin-left:10px'> Streak: " + y + "</h5>" +
                "<h5 class='text-left text-black' style='margin-left:10px;margin-right:10px'> Loss: " + "<span class='text-danger'>" + (w*100).toFixed(4)+"%" + "</span>" + "</h5>";
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

