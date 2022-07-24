import React from "react";
import NVD3Chart from "react-nvd3";
import GlobalStateController from "../../js/GlobalStateController";
import Loader from "../generic/loader";
import d3 from 'd3';
import Utils from "../../js/Utils";
import StrategyDescription from "../generic/strategy_description";

const MARGIN_TOP={
  marginTop: "10px"
}

const GRAPH_CONTAINER={
  height: "20em",
}

const WIDTH_CONSTANT_TOGGLED=2.25;

const WIDTH_CONSTANT=2.59;

const HEIGHT_CONSTANT=1.65;

export default class BotSummaryPanel extends React.Component {

  constructor(props){
    super(props);
    this.state={
      update: false,
      loadingGraph: true,
      toggleGraph: true
    }
    this.min = 1000000000;
    this.max = 0;
    const self = this;
    GlobalStateController.registeredComponentWithState(self,"platformToggled");
  }

  getDatum() {

    this.min = 1000000000;
    this.max = 0;

    var data = [];
    var lastBuy = undefined;

    for(let l=0;l<this.props.botLogs.length;l++){
      const log = this.props.botLogs[l];
      let gain  = 0;
      this.min = Math.min(this.min,log.networth);
      this.max = Math.max(this.max,log.networth);
      if(log.action.toUpperCase() === "BUY"){
        lastBuy = parseFloat(log.closePrice);
      }
      if(log.action.toUpperCase() === "SELL"){
        gain = (parseFloat(log.closePrice)/lastBuy) - 1.00;
      }
      if(log.action.toUpperCase() === "BUY" || 
         log.action.toUpperCase() === "SELL"){
        data.push({
          y: parseFloat(log.networth).toFixed(4),
          x: new Date(log.timestamp),
          z: parseFloat(log.closePrice).toFixed(8), 
          w: gain.toFixed(4),
          a: log.action,
          m: log.message
        });
      }
    }

    return [
      {
        values: data,
        color: '#007bff',
        area: true
      }
    ];
  }

  
  componentDidUpdate(){
    Utils.clearTooltips();
  }

  render() {
    const self = this;
    return (
      <div>
        <div className="row margin-left-5" style={ MARGIN_TOP }>
          <div className="col-md-10">
          <span>
            <h1 className="text-left"> 
              { this.props.bot.name.toUpperCase() }
            </h1>
          </span>
          </div>
        </div>
        <div className="row border-bottom margin-left-5 margin-right-10 text-black">
          <div className="col-md-12">
            <h4 className="text-left text-black"> 
              { this.props.bot.exchange.toUpperCase() + " | " + this.props.bot.market.toUpperCase() }
            </h4>
          </div>
          <div className="col-md-12 margin-bottom-20">
            <h6 className={ "text-left text-black" }>
            <i>
              { this.props.bot.public ? "PUBLIC/" : "PRIVATE/" }
            </i>
            <i>
              { this.props.bot.isSimulated ? "SIMULATED" : "REALTIME" }
            </i>
            <span className="clickable float-right primary-hover">
              { this.state.toggleGraph && 
                <span onClick={ () => { self.setState( { toggleGraph: false } ) } }>
                  <span> SHOW STRATEGY </span> 
                  <i className="fa fa-caret-down"/>
                </span>
              }
              { !this.state.toggleGraph && 
                <span onClick={ () => { self.setState( { toggleGraph: true } ) }}>
                  <span> SHOW GRAPH </span> 
                  <i className="fa fa-caret-down"/>
                </span>
              }
            </span>
            </h6>
          </div>
        </div>
        <div  className="container text-center" 
              style={ GRAPH_CONTAINER }>
          <br/>
          { this.props.botLogs && 
            this.state.toggleGraph &&
            <div>
            <NVD3Chart type='lineChart'
                      domain={{min:0,max:10}}
                      datum={this.getDatum()}
                      showXAxis={false}
                      showYAxis={false}
                      showLegend={ false }
                      yDomain={[this.min,this.max]}
                      height={window.innerHeight / HEIGHT_CONSTANT}
                      width={window.innerWidth / (GlobalStateController.getValue("platformToggled") ? WIDTH_CONSTANT : WIDTH_CONSTANT_TOGGLED )}
                      margin={ {top: 25, right:5, bottom: 50, left:5} }
                      tooltip={{contentGenerator: function(data){
                        const x = d3.time.format('%d/%m/%y')(new Date(data.point.x));
                        const y = parseFloat(data.point.y).toFixed(4);
                        const z = parseFloat(data.point.z).toFixed(8); //Last price
                        const w = parseFloat(data.point.w).toFixed(4); //Gain
                        const a = data.point.a;
                        const m = data.point.m;

                        if(a === "BUY"){
                          return "<h4 class='text-success border-bottom' style='margin-top:10px;margin-left:10px;margin-bottom:10px;margin-right:10px'>" + x + " - BUY</h4>" +
                                "<h5 class='text-left text-black' style='margin-left:10px'> Networth: " + y + "</h5>";
                        }
                        else if(a === "SELL" && w >= 0){
                          return "<h4 class='text-danger border-bottom' style='margin-top:10px;margin-left:10px;margin-bottom:10px;margin-right:10px'>" + x + " - SELL</h4>" +
                                "<h5 class='text-left text-black' style='margin-left:10px'> Networth: " + y + "</h5>" +
                                "<h5 class='text-left text-black' style='margin-left:10px;margin-right:10px'> Gain: " + "<span class='text-success'>" + (w*100)+"%" + "</span>" + "</h5>" +
                                "<div class='text-left text-black' style='margin-left:10px'>";
                        }
                        else if(a === "SELL" && w < 0){
                          return "<h4 class='text-danger border-bottom' style='margin-top:10px;margin-left:10px;margin-bottom:10px;margin-right:10px'>" + x + " - SELL</h4>" +
                                "<h5 class='text-left text-black' style='margin-left:10px'> Networth: " + y + "</h5>" +
                                "<h5 class='text-left text-black' style='margin-left:10px'> Last Price: " + z + "</h5>" +
                                "<h5 class='text-left text-black' style='margin-left:10px;margin-right:10px'> Loss: " + "<span class='text-danger'>" + (w*100)+"%" + "</span>" + "</h5>" +
                                "<div class='text-left text-black' style='margin-left:10px'>";
                        }
                      }}}/>
            </div>
          }{
            !this.state.toggleGraph &&
            <StrategyDescription strategy={ this.props.bot.strategy }/>
          }
          { this.state.toggleGraph &&
            !this.props.botLogs &&
              <Loader styleOverride={{marginTop: "120px"}}
                      loadingMessage={ "" }/>
          }
        </div>
      </div>
    );
    
  }
}

