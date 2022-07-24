import React from "react";
import BotSummaryPanel from "./bot_summary_panel";
import ApiController from "../../js/ApiController";
import BotGraphInteractive from "./bot_graph_interactive";
import BotManagerHeader from "./bot_manager_header";
import BotViewSelector from "./bot_view_selector";
import BotTradesTable from "./bot_trades_table";
import TVChartLiveBot from "../tradingview_charts/tv_chart_live_bot";

const ODD_COLOR = {
  backgroundColor: "white",
}

export default class BotManager extends React.Component {

  constructor(props){
    super(props);
    this.state={
      selectedBot: this.props.userBots[0],
      selectedBotIndex: 0,
      selectedBotLogs: undefined,
      selectedView: "summary",
      showTitle: true,
      liveView: false
    }

    this.pageSize  = 5;
    this.selectBot = this.selectBot.bind(this);
    this.selectView = this.selectView.bind(this);
    this.getBotLogs = this.getBotLogs.bind(this);
    this.deleteBot = this.deleteBot.bind(this);
  }

  updateBot = false

  afterUpdateBot = () => {
    this.updateBot = false;
    this.setState({
      update: true
    });
  }

  selectView(view){
    this.setState({
      selectedView: view
    });
  }

  selectBot(bot,index){
    this.updateBot = true;
    this.setState({
      selectedBot: bot,
      selectedBotIndex: index,
      selectedBotLogs: undefined
    });
    this.getBotLogs(bot.id);
  }

  deleteBot(botId){
    this.props.updateBot.deleteBot(botId);
    
    if(this.state.selectedBotIndex >= this.props.userBots.length && this.props.userBots.length !== 0){
      this.selectBot(this.props.userBots[this.state.selectedBotIndex-1],this.state.selectedBotIndex-1);
    }
    else if(this.props.userBots.length !== 0){
      this.selectBot(this.props.userBots[this.state.selectedBotIndex],this.state.selectedBotIndex);
    }
  }

  /**
   * Grab user bot logs
   * @param {*} id 
   */
  async getBotLogs(id){

    //Reference self
    const self = this;

    //Hit bot logs endpoint
    ApiController.doPostWithToken(
      "bot_logs",
      {
        "botId": id
      },

      //On Success, update logs
      function(response,id){

        //Only update if logs belong to this bot
        if(id !== self.state.selectedBot.id){
          return;
        }

        //Update
        self.setState({
          selectedBotLogs: response.botLogs
        });

      },
      id
    );
  }

  componentDidMount(){
    this.getBotLogs(this.state.selectedBot.id);
  }

  render() {
    const self = this;

    /**
     * Return the vanilla bot manager
     */
    if(!this.state.liveView){
      return (
        <div>
          <br/>
          { this.state.selectedBot.running &&
            <div className="margin-left-5 row">
              <h5 onClick={ () => { self.setState( { liveView: !self.state.liveView } ) } }
                  className="clickable">
                <button className="btn btn-primary">LAUNCH LIVE VIEW <i className="fa fa-external-link margin-left-5"/></button>
              </h5>
            </div>
          }
          <div className="margin-left-5 margin-right-5 margin-top-10 border-bottom">
            <BotManagerHeader selectBot={ this.selectBot }
                              bot={ this.state.selectedBot }
                              userBots={ this.props.userBots }
                              botTemplates={ this.props.botTemplates }
                              botLogs={ this.state.selectedBotLogs }
                              updateBot={ this.props.updateBot }
                              deleteBot={ this.deleteBot }
                              appendBotTemplate={ this.props.appendBotTemplate }
                              volume={ this.props.volumes[this.state.selectedBotIndex] }
                              linkedExchanges={ this.props.linkedExchanges }
                              liveView={ this.state.liveView }/>
          </div>
          { this.state.selectedBot.errorMessage  && this.state.selectedBot.errorMessage !== "" &&
            <div className="row text-center danger-banner">
              <div className="col-md-1 margins-5">
                  <h1 className="text-danger"><i className="fa fa-exclamation"/> </h1>
              </div>
              <div className="col-md-10 margins-5">
                <h5 className="text-danger text-center"> 
                    This bot encountered an error while trading and has forced shutdown: <br/>
                    { this.state.selectedBot.errorMessage }
                </h5>
              </div>
            </div>
          }
          <br/><br/><br/>
          <BotViewSelector selectedView={ this.state.selectedView }
                          selectView={ this.selectView }/>
          <br/><br/><br/>
          <div className="margin-top-50">
            { this.state.selectedView === "summary" &&
              <div>
              <BotSummaryPanel panelId={ "bot-" + this.state.selectedBotIndex }
                              bot={ this.state.selectedBot } 
                              botLogs={ this.state.selectedBotLogs }
                              index={ this.state.selectedBotIndex }
                              backgroundColor={ ODD_COLOR }
                              updateBot={ this.props.updateBot }/>
              <br/><br/> 
              </div>
            }
            { this.state.selectedView === "graphs" && 
            <div>
              <BotGraphInteractive panelId={ "bot-" + this.state.selectedBotIndex }
                                  bot={ this.state.selectedBot } 
                                  botLogs={ this.state.selectedBotLogs }
                                  backgroundColor={ ODD_COLOR }/>
              <br/><br/><br/>
            </div>
            }
            { this.state.selectedView === "trades" && 
              <div>
                <BotTradesTable botLogs={ this.state.selectedBotLogs }/>
                <br/><br/><br/>
              </div>
            }
          </div>
        </div>
      );
    }

    /**
     * Launch the live bot view
      */
    else {
      return <div>
          <br/>
          { this.state.selectedBot.running &&
            <div className="margin-left-5 row">
              <h5 onClick={ () => { self.setState( { liveView: !self.state.liveView } ) } }
                  className="clickable">
                  <button className="btn btn-primary"><i className="fa fa-arrow-left margin-left-5"/> RETURN TO BOTS</button>
              </h5>
            </div>
          }
          <div className="margin-left-5 margin-right-5 margin-top-10 border-bottom">
            <BotManagerHeader selectBot={ this.selectBot }
                              bot={ this.state.selectedBot }
                              userBots={ this.props.userBots }
                              botTemplates={ this.props.botTemplates }
                              botLogs={ this.state.selectedBotLogs }
                              updateBot={ this.props.updateBot }
                              deleteBot={ this.deleteBot }
                              appendBotTemplate={ this.props.appendBotTemplate }
                              volume={ this.props.volumes[this.state.selectedBotIndex] }
                              linkedExchanges={ this.props.linkedExchanges }
                              liveView={ this.state.liveView }/>
          </div>
          <TVChartLiveBot updateBot={ this.updateBot }
                          afterUpdateBot={ this.afterUpdateBot }
                          bot={ this.state.selectedBot }
                          botLogs={ this.state.selectedBotLogs }/>
          <br/><br/>
      </div>
    }
  }
}

