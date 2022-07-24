import React from "react"
import ApiController from "../../js/ApiController"
import Alert from "./alert"
import AlertFilterBox from "./alert_filter_box"
import IconHeader from "../generic/icon_header"

const TAB_MARGIN = {
  marginTop: "5px",
  marginLeft: "15px",
  marginRight: "15px"
}

export default class AlertsTab extends React.Component {

  constructor(props){
    super(props);
    this.state={
      selectedFilter: "strategies",
      processing: new Map()
    }
    this.selectFilter     = this.selectFilter.bind(this);
    this.accept           = this.accept.bind(this);
    this.finishProcessing = this.finishProcessing.bind(this);
  }

  finishProcessing(index){
    let processing = this.state.processing;
    processing.set(index,false);
    this.setState({
      processing: processing
    });
  }

  accept(alertIndex){
    let processing = this.state.processing;
    processing.set(alertIndex,true);
    this.setState({
      processing: processing
    });
    if(this.state.selectedFilter === "strategies"){
      const strategy = this.props.sharedItems.strategies[alertIndex];
      this.props.saveStrategy(strategy,alertIndex,undefined,this);
    }
    else if(this.state.selectedFilter === "bots"){
      const bot = this.props.sharedItems.bots[alertIndex];
      this.props.saveStrategy(bot.strategy,alertIndex,bot,this);
    }
    else if(this.state.selectedFilter === "invites"){
      const group = this.props.sharedItems.invites[alertIndex];
      this.props.joinGroup(group,alertIndex,this);
    }
  }

  dismiss(alertIndex){
    let processing = this.state.processing;
    processing.set(alertIndex,true);
    this.setState({
      processing: processing
    });
    if(this.state.selectedFilter === "strategies"){
      const payload = {
        "key": this.props.sharedItems.strategies[alertIndex].strategy.id,
        "item": "strategy"
      }
      ApiController.doPostWithToken(
        "dismiss_item",
        payload,
        this.props.removeStrategy,
        {
          index: alertIndex,
          alerts: this
        }
      );
    }
    else if(this.state.selectedFilter === "bots"){
      const payload = {
        "key": this.props.sharedItems.bots[alertIndex].botId,
        "item": "bot"
      }
      ApiController.doPostWithToken(
        "dismiss_item",
        payload,
        this.props.removeBot,
        {
          index: alertIndex,
          alerts: this
        }
      );
    }
    else if(this.state.selectedFilter === "invites"){
      const payload = {
        "key": this.props.sharedItems.invites[alertIndex].groupName,
        "item": "invite"
      }
      ApiController.doPostWithToken(
        "dismiss_item",
        payload,
        this.props.removeInvite,
        {
          index: alertIndex,
          alerts: this
        }
      );
    }
  }

  selectFilter(filter){
    this.setState({
      selectedFilter: filter
    });
  }

  hasAlerts(){
    return( 
      this.props.sharedItems.strategies.length != 0 ||
      this.props.sharedItems.bots.length != 0 ||
      this.props.sharedItems.invites.length != 0);
  }

  generateAlertList(){

    let alertsList      = [];
    let messageFunction = undefined;

    if(this.state.selectedFilter === "strategies"){
      alertsList = this.props.sharedItems.strategies;
      messageFunction = function(value){
        return value.strategy.name + ": " + (value.strategy.description != "" ? value.strategy.description : "NO DESCRIPTION");
      }
    }
    else if(this.state.selectedFilter === "bots"){
      alertsList = this.props.sharedItems.bots;
      messageFunction = function(value){
        return "BOT NAME: " + value.botName.toUpperCase() + " | " +
               "EXCHANGE: " + value.exchange.toUpperCase() + " | " +
               "MARKET: " + value.base.toUpperCase() + "-" + value.quote.toUpperCase() + " | " +
               "STRATEGY: " + value.strategy.name.toUpperCase();
      }
    }
    else if(this.state.selectedFilter === "backtests"){
      alertsList = this.props.sharedItems.backtests;
      messageFunction = function(value){
        return "some backtest";
      }
    }
    else if(this.state.selectedFilter === "invites"){
      alertsList = this.props.sharedItems.invites;
      messageFunction = function(value){
        return value.description;
      }
    }

    const alerts = alertsList.map((value,index) => 
                    <div>
                      <Alert index={index+1} 
                             processing={ this.state.processing.get(index) }
                             message={ messageFunction(value) } 
                             fromUser={ this.state.selectedFilter != "invites" ? value.fromUser.toUpperCase() : value.groupName.toUpperCase() } 
                             backgroundColor={ index % 2 === 0 ? "rgb(235, 236, 236)" : "rgb(214, 216, 216)" }
                             onAccept={ () => this.accept(index) }
                             onDecline={ () => this.dismiss(index) }/>
                      <br/>
                    </div>);
    return alerts;
  }

  render() {

    return (
      <div class="tab-pane active show" style={ TAB_MARGIN }>
        <br/><br/>
        <div className="border-bottom">
          <div className="row text-center" style={ {marginLeft:"50px"} }>
            <AlertFilterBox filterName="STRATEGIES" 
                            filterIcon="fa fa-line-chart"  
                            messageCount={ this.props.sharedItems.strategies ? this.props.sharedItems.strategies.length : 0 }
                            onClick={ () => this.selectFilter("strategies") }/>
            <AlertFilterBox filterName="BOTS"
                            filterIcon="fa fa-gears"  
                            messageCount={ this.props.sharedItems.bots ? this.props.sharedItems.bots.length : 0 }
                            onClick={ () => this.selectFilter("bots") }
                            onAccept={ this.onAcceptBot }
                            onDecline={ this.onDeclineBot }/>
            <AlertFilterBox filterName="INVITES" 
                            filterIcon="fa fa-users"  
                            messageCount={ this.props.sharedItems.invites ? this.props.sharedItems.invites.length : 0 }
                            onClick={ () => this.selectFilter("invites") }
                            onAccept={ this.onAcceptGroup }
                            onDecline={ this.onDeclineGroup }/>
          </div>
        </div>
        <br/>
        { this.state.selectedFilter === "strategies" && 
          <IconHeader textClass="text-primary" iconClass="fa fa-line-chart" header="SHARED STRATEGIES" anchor="right"/>
        }
        { this.state.selectedFilter === "bots" && 
          <IconHeader textClass="text-primary"  iconClass="fa fa-gears" header="SHARED BOTS" anchor="right"/>
        }
        { this.state.selectedFilter === "invites" && 
          <IconHeader textClass="text-primary"  iconClass="fa fa-users" header="GROUP INVITES" anchor="right"/>
        }
        <br/>
        <div>
          { this.hasAlerts() && this.generateAlertList() }
          { !this.hasAlerts() && 
            <div className="container"><br/><br/>
              <h1 className="text-secondary text-center">
                You currently have no new alerts at this time.
              </h1>
            </div>
          }
        </div>
        <br/><br/><br/><br/>
      </div>
    );
  }
}
