import React from "react";
import BotActionNav from "./bot_action_nav";
import BotRunningToggle from "./bot_running_toggle";
import FilterTable from "../generic/filter_table";
import IconHeader from "../generic/icon_header";
import GlobalStateController from "../../js/GlobalStateController";

export default class BotManagerHeader extends React.Component {

  constructor(props){
    super(props);
    this.state={
      showTable: false
    }
    const self = this;
    GlobalStateController.registeredComponentWithState(self,"platformToggled");
  }

  buildDropdownData(){
    let data = new Array();
    for(let b=0;b<this.props.userBots.length;b++){

      const bot = this.props.userBots[b];

      const running    = this.createDropdownText(bot);
      const name       = bot.name.toUpperCase();
      const exchange   = bot.exchange.toUpperCase();
      const market     = bot.market.toUpperCase() + " (" + bot.interval.toUpperCase() + ") ";
      const mode       = bot.isSimulated ? "SIMULATED" : "REALTIME";
      const strategy   = bot.strategy.name;
      const rank       = bot.rank === "?" ? Number.MAX_VALUE : bot.rank;
      const roi        = this.getRoiElement(bot.roi);
      const error      = bot.errorMessage && bot.errorMessage !== "";

      let row = [];

      if(!error){
        row = [
          running,name,exchange,market,mode,strategy,roi,rank
        ];
      }
      else{
        row = [
          <span className="text-danger">
            <i className="fa fa-exclamation margin-right-5"/>
              { running }
            </span>,
            name,
            exchange,
            market,
            mode,
            strategy,
            roi,
            rank
        ]
      }

      data.push(row);
    }
    return data;
  }

  getRoiElement(roi){
    if(roi < 0){
      return <span className="text-danger">
        { "↓" + ((roi*100).toFixed(2)+"%") }
      </span>
    }
    else if(roi > 0){
      return <span className="text-success">
      { "↑" + ((roi*100).toFixed(2)+"%") }
    </span>
    }
    else{
      return <span className="text-secondary">
      { "0.00%" }
    </span>
    }
  }

  createDropdownText(bot){
    const roi      = bot.roi;
    const running  = bot.running;
    let runElement = undefined;

    if(running){
      runElement = 
      <span className="text-success">
        (ON)
      </span>
    }
    else{
      runElement = 
      <span className="text-danger">
        (OFF)
      </span>
    }

    return runElement;
  }

  render() {
    const self = this;
    const data = this.buildDropdownData();
    return (
    <div className="theme-banner-one">
      <div>
          <h1>
            <span className="clickable" 
                  onClick={ () => 
                    { self.setState( { showTable: !self.state.showTable } ) } }>
              MY BOTS { this.state.showTable ? 
                <i className="fa fa-caret-up"/> :
                <i className="fa fa-caret-down"/> }
            </span>
          </h1>
      { this.state.showTable && 
        <div className={ GlobalStateController.getValue("platformToggled") ?
            "container-fluid dropdown-table prop-up" :
            "container-fluid dropdown-table-toggled prop-up" 
          }>
          <div className="row dropdown-table-inner">
            <div className="col-md-12">
              <FilterTable header={[
                                    "STATUS",
                                    "BOT",
                                    "EXCHANGE",
                                    "MARKET",
                                    "TYPE",
                                    "STRATEGY",
                                    "ROI",
                                    <IconHeader header="RANK" iconClass="fa fa-sort" anchor="right" textClass="text-left clickable"/>
                                  ]}
                          sortable={[
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            true
                          ]}
                          columnCallbacks={[
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            false,
                            function(rank){
                              if(rank === Number.MAX_VALUE){
                                return "NONE"
                              }
                              return rank
                            }
                          ]}
                          align="left"
                          searchText="Search bots..."
                          data={ data }
                          mappedData={ this.props.userBots }
                          onClick={ this.props.selectBot }/>
            </div>
          </div>
        </div>
      }
    </div>
    <div className="row">
      <div className="col-md-4">
      <div className="margin-top-20">
        <BotActionNav bot={ this.props.bot }
                      botTemplates={ this.props.botTemplates }
                      botLogs={ this.props.botLogs }
                      updateBot={ this.props.updateBot }
                      deleteBot={ this.props.deleteBot }
                      appendBotTemplate={ this.props.appendBotTemplate }
                      volume={ this.props.volume }
                      linkedExchanges={ this.props.linkedExchanges }/>
      </div> 
      </div>
      <div className="col-md-4 text-center prop-up-big">
        <h1>
          RANK 
          <br/>
          { <span className="text-secondary"> 
              { this.props.bot.rank !== "?" ? this.props.bot.rank : "N/A" } | { this.getRoiElement(this.props.bot.roi) }
            </span> 
          }
        </h1>
      </div>
      <div className="col-md-4 prop-up-big">
        <BotRunningToggle updateBot={ this.props.updateBot }
                          bot={ this.props.bot }/>
      </div>
    </div>
    </div>
  )}
}

