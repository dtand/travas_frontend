import React from "react"
import Loader from "../generic/loader";
import SimpleToggle from "../generic/simple_toggle";
import GlobalStateController from "../../js/GlobalStateController"
import BotNetworthGraph from "./bot_networth_graph";
import BotGraphButton from "../landing_page/bot_graph_button";
import BotStreakGraph from "./bot_streak_graph";
import BotIndicatorGraph from "./bot_indicator_graph";
import BotGainsGraph from "./bot_gains_graph";
import Constants from "../../js/Constants";

export default class BotGraphInteractive extends React.Component {

  constructor(props){
    super(props);

    //Setup state
    this.state={
      buyAndHold: false,
      logScale: false,
      percentChange: false,
      winOnly: false,
      lossOnly: false,
      streakMovingAvg: false,
      gainWeighted: false,
      closePrices: false,
      buySignals: true,
      sellSignals: true,
      showStopLoss: false,
      indicatorGraphType: [false,false,false,false,false],
      selectedGraph: "networth"
    }

    this.updatedFlag = false;
    this.selectGraph = this.selectGraph.bind(this);

    const self = this;
    GlobalStateController.registeredComponentWithState(self,"platformToggled");
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

  /**
   * Called in constructor to set indicator graph type
   */
  getDefaultGraphTypeIndicators(){
    if(this.props.botLogs && this.props.botLogs.length > 0){
      const buyIndicators = this.props.botLogs[this.props.botLogs.length-1].indicators.buyIndicators;
      for(let key in buyIndicators){
        if(Constants.INDICATOR_CATEGORIES.allIndicators.exists(key)){
           return this.getIndicatorChart(key).chart;
        }
      }
    }
   return 0;
  }

  selectGraph(graph){
    this.setState({
      selectedGraph: graph
    });
  }

  componentDidUpdate(){

    //Check that no indiator graph is set and 
    //bot logs exist - update graph type
    if(!this.state.indicatorGraphType[0] && 
       !this.state.indicatorGraphType[0] &&
       !this.state.indicatorGraphType[0] &&
       !this.state.indicatorGraphType[0] &&
       this.props.botLogs &&
       this.props.botLogs.length > 0 &&
       !this.updatedFlag){

      //Init indicator graph types
      const defaultIndicatorGraph = this.getDefaultGraphTypeIndicators();
      let indicatorGraphType      = [false,false,false,false,false];
      indicatorGraphType[defaultIndicatorGraph] = true;

      //Update indicator graph type
      this.setState({
        indicatorGraphType: indicatorGraphType
      });

      this.updatedFlag = true;
    }

  }

  render() {
    const self = this;
    return (
      <div id={ this.props.panelId }>
        <div className="row margin-left-50">
          <div className="col-md-2 border-right">
            { this.state.selectedGraph === "networth" && 
              <SimpleToggle active={ this.state.buyAndHold }
                            label="Buy & Hold"
                            onChange={ () => 
                              { self.setState( { buyAndHold: !self.state.buyAndHold } ) } 
                            }/>
            }
            { this.state.selectedGraph === "networth" && 
              <SimpleToggle active={ this.state.logScale }
                            label="Log Scale"
                            onChange={ () => 
                              { self.setState( 
                                { 
                                  logScale: !self.state.logScale,
                                  percentChange: false
                                } 
                              ) 
                            }
                            }/>
            }
            { this.state.selectedGraph === "networth" && 
              <SimpleToggle active={ this.state.showStopLoss }
                            label="Stop Loss"
                            onChange={ () => 
                              { self.setState( 
                                { 
                                  showStopLoss: !self.state.showStopLoss,
                                  percentChange: false
                                } 
                              ) 
                            }
                            }/>
            }
            { this.state.selectedGraph === "streak" && 
              <SimpleToggle active={ this.state.gainWeighted }
                            label="Gain Weighted"
                            onChange={ () => 
                              { self.setState( { gainWeighted: !self.state.gainWeighted } ) } 
                            }/>
            }
            { this.state.selectedGraph === "streak" && 
              <SimpleToggle active={ this.state.winOnly }
                            label="Only Wins"
                            onChange={ () => 
                              { self.setState( 
                                { 
                                  winOnly: !self.state.winOnly,
                                  lossOnly: false
                                } 
                              ) 
                            }
                            }/>
            }
            { this.state.selectedGraph === "streak" && 
              <SimpleToggle active={ this.state.lossOnly }
                            label="Only Losses"
                            onChange={ () => 
                              { self.setState( 
                                { 
                                  lossOnly: !self.state.lossOnly,
                                  winOnly: false
                                } 
                              ) 
                            }
                            }/>
            }
            { (this.state.selectedGraph === "% returns") && 
              <SimpleToggle active={ this.state.streakMovingAvg }
                            label="Moving AVG"
                            onChange={ () => 
                              { self.setState( { streakMovingAvg: !self.state.streakMovingAvg } ) } 
                            }/>
            }
            { (this.state.selectedGraph === "networth") && 
              <SimpleToggle active={ this.state.buySignals }
                            label="Buy Signals"
                            onChange={ () => 
                              { self.setState( { buySignals: !self.state.buySignals } ) } 
                            }/>
            }
            { (this.state.selectedGraph === "networth") && 
              <SimpleToggle active={ this.state.sellSignals }
                            label="Sell Signals"
                            onChange={ () => 
                              { self.setState( { sellSignals: !self.state.sellSignals } ) } 
                            }/>
            }
            { (this.state.selectedGraph === "indicators") && 
              <SimpleToggle active={ this.state.indicatorGraphType[0] }
                            label="Patterns"
                            onChange={ () => 
                              { self.setState( { indicatorGraphType: [true,false,false,false,false] } ) } 
                            }/>
            }
            { (this.state.selectedGraph === "indicators") && 
              <SimpleToggle active={ this.state.indicatorGraphType[1] }
                            label="Price Based"
                            onChange={ () => 
                              { self.setState( { indicatorGraphType: [false,true,false,false,false] } ) } 
                            }/>
            }
            { (this.state.selectedGraph === "indicators") && 
              <SimpleToggle active={ this.state.indicatorGraphType[2] }
                            label="Streaks"
                            onChange={ () => 
                              { self.setState( { indicatorGraphType: [false,false,true,false,false] } ) } 
                            }/>
            }
             { (this.state.selectedGraph === "indicators") && 
              <SimpleToggle active={ this.state.indicatorGraphType[3] }
                            label="Percent Based"
                            onChange={ () => 
                              { self.setState( { indicatorGraphType: [false,false,false,true,false] } ) } 
                            }/>
            }
            { (this.state.selectedGraph === "indicators") && 
              <SimpleToggle active={ this.state.indicatorGraphType[4] }
                            label="MACD"
                            onChange={ () => 
                              { self.setState( { indicatorGraphType: [false,false,false,false,true] } ) } 
                            }/>
            }
          </div>
          <div className="col-md-1"/>
          <div className="col-md-2 text-right">
            <BotGraphButton selected={ this.state.selectedGraph === "networth"}
                            select={ this.selectGraph } 
                            text="NETWORTH"/>
          </div>
          <div className="col-md-2 text-right">
            <BotGraphButton selected={ this.state.selectedGraph === "streak"}
                            select={ this.selectGraph } 
                            text="STREAK"/>
          </div>
          <div className="col-md-2 text-right">
            <BotGraphButton selected={ this.state.selectedGraph === "indicators"}
                            select={ this.selectGraph } 
                            text="INDICATORS"/>
          </div>
          <div className="col-md-2 text-right">
            <BotGraphButton selected={ this.state.selectedGraph === "% returns"}
                            select={ this.selectGraph } 
                            text="% RETURNS"/>
          </div>
        </div>
        { 
          this.props.botLogs && 
          this.state.selectedGraph === "networth" &&
          <BotNetworthGraph botLogs={ this.props.botLogs ? this.props.botLogs : [] } 
                            maxDrawdown={ this.props.bot.maxDrawdown }
                            paneId={ this.props.panelId } 
                            buyAndHold={ this.state.buyAndHold }
                            logScale={ this.state.logScale }
                            percentChange={ this.state.percentChange }
                            buySignals={ this.state.buySignals }
                            sellSignals={this.state.sellSignals }
                            showStopLoss={ this.state.showStopLoss }/>
        }
        { 
          this.props.botLogs && 
          this.state.selectedGraph === "streak" &&
          <BotStreakGraph botLogs={ this.props.botLogs ? this.props.botLogs : [] } 
                          paneId={ this.props.panelId }
                          gainWeighted={ this.state.gainWeighted }
                          winOnly={ this.state.winOnly }
                          lossOnly={ this.state.lossOnly }/>
        }
        { 
          this.props.botLogs && 
          this.state.selectedGraph === "indicators" &&
          <div className="margin-top-10">
            <BotIndicatorGraph botLogs={ this.props.botLogs ? this.props.botLogs : [] } 
                               paneId={ this.props.panelId }
                               graphType={ this.state.indicatorGraphType }/>
          </div>
        }
        {
          this.props.botLogs && 
          this.state.selectedGraph === "% returns" &&
          <div className="margin-top-10">
            <BotGainsGraph botLogs={ this.props.botLogs ? this.props.botLogs : [] } 
                           paneId={ this.props.panelId }
                           winLoss={ this.props.bot.winLoss }  
                           movingAverage={ this.state.streakMovingAvg }/>
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

