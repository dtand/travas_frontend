import React from "react";
import BotGraphButton from "../landing_page/bot_graph_button";
import SimpleToggle from "../generic/simple_toggle";
import Constants from "../../js/Constants";

export default class BacktestViewSelector extends React.Component {

  constructor(props){
    super(props);
  }
 
  render() {
    const self = this;
    return (
      <div className="col-md-10 text-center margin-top-15">
      <div className="row text-center">
          <div className={ Constants.IS_MOBILE ? "col-sm-2 text-right margins-10" : "col-md-2 text-right margin-top-15" }>
            <BotGraphButton selected={ this.props.selectedGraph === "summary"}
                            select={ this.props.selectGraph } 
                            text="SUMMARY"
                            tooltip="View all individual backtest metrics in this job"/>
          </div>
          <div className={ Constants.IS_MOBILE ? "col-sm-2 text-right margins-10" : "col-md-2 text-right margin-top-15" }>
            <BotGraphButton selected={ this.props.selectedGraph === "networth"}
                            select={ this.props.selectGraph } 
                            text="NETWORTH"
                            tooltip="View all backtest equity curves compared against one another"/>
          </div>
          <div className={ Constants.IS_MOBILE ? "col-sm-2 text-right margins-10" : "col-md-2 text-right margin-top-15" }>
            <BotGraphButton selected={ this.props.selectedGraph === "streak"}
                            select={ this.props.selectGraph } 
                            text="STREAK"
                            tooltip="View all backtests win and loss streaks where +1 is a win and -1 is a loss"/>
          </div>
          <div className={ Constants.IS_MOBILE ? "col-sm-2 text-right margins-10" : "col-md-2 text-right margin-top-15" }>
            <BotGraphButton selected={ this.props.selectedGraph === "% returns"}
                            select={ this.props.selectGraph } 
                            text="% RETURNS"
                            tooltip="View all gain and loss percents for all backtest trades"/>
          </div>
          <div className={ Constants.IS_MOBILE ? "col-sm-2 text-right margins-10" : "col-md-2 text-right margin-top-15" }>
            <BotGraphButton selected={ this.props.selectedGraph === "portfolio"}
                            select={ this.props.selectGraph } 
                            text="PORTFOLIO"
                            tooltip="View aggregated backtest performance as a single strategy"/>
          </div>
      </div>
  </div>
  )}
}

