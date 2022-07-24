import React from "react"
import BotSummaryFrame from "./bot_summary_frame"
import BotMetrics from "./bot_metrics"

export default class BotSummaryPanel extends React.Component {

  constructor(props){
    super(props);
  }

  getLastActionMessage(){

    for(let b=this.props.botLogs.length-1;b>0;b--){
      const log = this.props.botLogs[b];
      if(log.action.toLowerCase() === 'buy'){
        return this.getSellMessage(log);
      }
      else if(log.action.toLowerCase() === 'sell'){
        return this.getBuyMessage(log);
      }
    }

    return this.getDefaultMessage();
  }

  getDefaultMessage(){
    return this.props.bot.name.toUpperCase() + " has not made any trades yet."
  }

  getBuyMessage(log){
    return <span>
      { this.props.bot.name.toUpperCase() + " recently closed a position and is currently waiting to " }
      <span className="text-success"> BUY </span>
    </span>
  }

  getSellMessage(log){
    return <span>
      { this.props.bot.name.toUpperCase() + " recently opened a position and is currently waiting to " }
      <span className="text-danger"> SELL </span>
    </span>
  }

  render() {
    return (
      <div>
        <h6 className="text-secondary">
          <i>{ this.props.botLogs && this.getLastActionMessage() }</i>
        </h6>
        <div className="row text-center border-bottom-4"
            id={ this.props.panelId }
            style={ this.props.backgroundColor }>
          <div className="col-md-6 text-center">
            <BotSummaryFrame panelId={ this.props.panelId }
                            bot={ this.props.bot }
                            botLogs={ this.props.botLogs }
                            updateBot={ this.props.updateBot }
                            changeBotName={ this.props.changeBotName }/>
          </div>
          <div className="col-md-6">
            <BotMetrics bot={ this.props.bot } 
                        index={ this.props.index }
                        appendBotTemplate={ this.props.appendBotTemplate }/>
          </div>
        </div>
      </div>
    );
  }
}

