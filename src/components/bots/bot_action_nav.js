import React from "react";
import BotButtonNav from "./bot_button_nav";


export default class BotActionNav extends React.Component {

  constructor(props){
    super(props);
    this.state={
      show: true,
      action: undefined
    }
    this.setAction    = this.setAction.bind(this);
    this.removeAction = this.removeAction.bind(this);
  }

  setAction(action){
    this.setState({
      action: action
    });
  }

  removeAction(){
    this.setState({
      action: undefined
    });
  }

  render() {
    const self = this;
    return (
      <div className="prop-up-big">
        <span class="float-left btn btn-small btn-link"
                onClick={ () => { 
                  self.setState( 
                    { 
                      show: !self.state.show
                    } 
                  )} 
                }>
          <strong>
            { this.state.show ? 
                <h6> <i className="fa fa-fw fa-minus-square"/>  TOOLS {
                  this.state.action && <i className="text-secondary">
                    { " " + this.state.action}
                  </i>
                }
                </h6> 
                :
                <h6> <i className="fa fa-fw fa-plus-square"/> TOOLS
                </h6>
            }
            </strong>
          </span>
          <br/><br/>
          { this.state.show &&
            <div className="margin-left-10">
              <BotButtonNav setAction={ this.setAction }
                            removeAction={ this.removeAction }
                            updateBot={ this.props.updateBot }
                            deleteBot={ this.props.deleteBot }
                            bot={ this.props.bot }
                            botLogs={ this.props.botLogs }
                            botTemplates={ this.props.botTemplates }
                            appendBotTemplate={ this.props.appendBotTemplate }
                            volume={ this.props.volume }
                            linkedExchanges={ this.props.linkedExchanges }/>
            </div>
          }{ !this.state.show && 
            <div className="margin-top-25"/>
          }
      </div>
    );
  }
}

