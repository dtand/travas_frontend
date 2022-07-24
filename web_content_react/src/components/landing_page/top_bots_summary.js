import React from "react";
import BotTicker from "./bot_ticker"

export default class TopBotsSummary extends React.Component {

  constructor (props){
    super(props);
  }

  render() {
    return (
      <div>
        <div className="margin-top-20">
            <BotTicker bgColor="white" 
                       updateBot={ this.props.updateBot === 0 }
                       afterBotUpdate={ this.props.afterBotUpdate }
                       bot={ this.props.bot }
                       period={ this.props.period }/>
            <div className="container margin-top-25">
              { this.props.mode === "bots" && <p className="text-center">
                  *All trading bots shown here are created by our users.  As such, no strategies will 
                  be disclosed <a href="#bots" onClick={ () => this.props.toggleMode("strategies") }> click here to view our public strategies </a>.
              </p> }
              { this.props.mode === "strategies" && 
              <p className="text-center">
                  *All Travas strategies are hypothetical, trading is risky and most lose money. Strategy metrics may
                  vary based on exchange fees and slippage. All strategies use a 10% stop loss calculated when the position opens.
              </p>
              }
            </div>
        </div>
        <br/>
      </div>
    )}
}