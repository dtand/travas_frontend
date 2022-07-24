import React from "react"
import LineWithFocusChart from "../generic/line_with_focus_chart";
import Loader from "../generic/loader";
import GlobalStateController from "../../js/GlobalStateController"
import d3 from 'd3';

const WIDTH_CONSTANT_TOGGLED=2.5;

const WIDTH_CONSTANT=3.0;

const HEIGHT_CONSTANT=1.25;

export default class BacktestStreakGraph extends React.Component {

  constructor(props){
    super(props);

    //Overall maximum streak/win
    this.maxWin = 0;

    //Overall maximum streak/loss
    this.maxLoss = 0;

    //Register with toggler state
    GlobalStateController.registeredComponentWithState(this,"platformToggled");
  }

  /**
   * Build data for line chart
   */
  buildDatum() {

    let lines    = [];
    this.maxLoss = 0;
    this.maxWin  = 0;

    for(let b=0;b<this.props.backtestResults.length;b++){

      //Grab backtest
      const backtest = this.props.backtestResults[b];

      //Gain counter
      let p=0;

      //No data for test
      if(Object.keys(backtest).length === 0){
        continue;
      }
      
      //Init macro data list and initial streak
      let data   = [];
      let streak = 0;

      //Iterate over all tests
      for(let i = 0; i < backtest.loggedReturns.length; i++) {

        //Init gain to 0
        let gain  = 0;

        //Is this a sell action update streak
        if(backtest.loggedActions[i] === "SELL"){

          //Grab gain from list
          gain = parseFloat(backtest.percentGains[p++]);

          //This was a loss
          if(parseFloat(gain) < 0){
            if(streak < 0){
              streak--;
            }
            else{
              streak = -1;
            }
            this.maxLoss = Math.min(this.maxLoss,streak);
          } 


          //This was a win
          if(parseFloat(gain) > 0){
            if(streak > 0){
              streak++;
            }
            else{
              streak = 1;
            }
            this.maxWin = Math.max(this.maxWin,streak);
          }
            
          //Push streak datapoint
          data.push({
            y: this.props.gainWeighted ? streak * Math.abs(gain) : streak,  //Add streak, check for gain weighted toggle
            x: new Date(backtest.timestamps[i]),                            //Add timestamp
            w: gain.toFixed(4)                                              //Add gain with precision 4
          }); 
        }

        //Force straight line up until first streak
        else if(streak === 0){
          //Push streak datapoint
          data.push({
            y: this.props.gainWeighted ? streak * Math.abs(gain) : streak,  //Add streak, check for gain weighted toggle
            x: new Date(backtest.timestamps[i]),                            //Add timestamp
            w: gain.toFixed(4)                                              //Add gain with precision 4
          }); 
        }
      }

      //Add backtest to all data
      lines.push({
        key: "#" + (b+1) + " -streak",
        values: data,
        area: false 
      });
    }

    return lines;
  }

  /**
   * Return macro graph info
   */
  getGraphInfo(){
    return (<strong className="graph-info text-black">
      MAX WIN STREAK: { this.maxWin } 
      { " | " }
      MAX LOSE STREAK: { this.maxLoss }
    </strong>);
  }

  render() {
    //If no backtests, return blank
    if(!this.props.backtestResults || 
      this.props.backtestResults.length === 0){
      return <h2 className="text-center margin-top-100">
          No data.
      </h2>
    }
    const datum = this.buildDatum()
    return (
      <div id={ this.props.panelId }>
         <div> 
          { this.getGraphInfo() } 
          <LineWithFocusChart 
            showYAxis={false}
            showLegend={ false }
            graphId={ this.props.panelId + "-graph" }
            datum={ datum }
            precision={ 1 }
            showLegend={ true }
            focusHeight={ 75 }
            yDomain={ this.props.gainWeighted ? 
                      [-1,1] :
                      [this.maxLoss,this.maxWin]
                    }
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
                      "<h5 class='text-left text-black' style='margin-left:10px;margin-right:10px'> Gain: " + "<span class='text-success'>" + w+"%" + "</span>" + "</h5>";
              }
              else{
                return "<h4 class='text-danger border-bottom' style='margin-top:10px;margin-left:10px;margin-bottom:10px;margin-right:10px'>" + x + " (LOSS)" + "</h4>" +
                "<h5 class='text-left text-black' style='margin-left:10px'> Streak: " + y + "</h5>" +
                "<h5 class='text-left text-black' style='margin-left:10px;margin-right:10px'> Loss: " + "<span class='text-danger'>" + w+"%" + "</span>" + "</h5>";
              }
              }}}/>
           </div>
      </div>
    );
  }
}

