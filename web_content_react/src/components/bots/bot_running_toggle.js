import React from "react";
import ApiController from "../../js/ApiController";
import Switch from "react-switch";
import NotificationController from "../../js/NotificationController";

export default class BotRunningToggle extends React.Component {

  constructor(props){
    super(props);
    this.state={
      loading: false
    }
    this.onChangeRunning = this.onChangeRunning.bind(this);
    this.onChangeRunningSuccess = this.onChangeRunningSuccess.bind(this);
  }

  handleChange(running) {
    this.setState({
      running: !running
    });
  }

  onChangeRunning(){

    //Ref bot
    const bot = this.props.bot;

    if(this.state.loading){
      return;
    }
    this.setState({
      loading: true
    });
    const payload = {
      "botId":this.props.bot.id,
      "command": this.props.bot.running ? "stop" : "start"
    }
    const self = this;
    ApiController.doPostWithToken(

      //Endpoint
      "start_stop_bot",

      //Parameters
      payload,

      //Success function
      this.onChangeRunningSuccess,

      //Success function additional params
      payload,

      //Fail function -> usually insufficient funds
      function(response){
        //Reset loading
        self.setState({
          loading: false
        });
      }
    );
  }

  onChangeRunningSuccess(response,params){
     
    NotificationController.displayNotification(
      "BOT STATUS CHANGED",
      params.command.toLowerCase() === "start" ?
        "Your bot is now in active trading mode" :
        "Your bot has been stopped, and has ceased trading" ,
      "info"
    );

    this.props.updateBot.setRunning(
      params.botId,
      params.command.toLowerCase() === "start"
    );

    this.setState({
      loading: false
    });
  }
  
  getRunning(bot){
    const running  = bot.running;
    let runElement = undefined;
    if(running){
      runElement = 
      <span className="text-success">
        ON
      </span>
    }
    else{
      runElement = 
      <span className="text-danger">
        OFF
      </span>
    }
    return runElement;
  }

  render() {
    return (
      <div className="text-center">
        { !this.state.loading && 
        <div>
          <h2 className="text-black text-uppercase">
            { 
              <span>
                { this.props.bot.name + " is " } 
                { this.getRunning(this.props.bot) }
              </span>   
            } 
          </h2>
          <i className="text-secondary">
            Click the toggle below to 
            { this.props.bot.running ? " stop " : " start " }
          </i>
        </div>
        }
        { this.state.loading &&
          <h1 className="text-secibdart text-center" style={ { fontSize: "48px" } }>
            <i className="fa fa-spin fa-spinner"/>
          </h1>
        }
        <br/>
        <label htmlFor="normal-switch">
            <Switch
              onChange={ this.onChangeRunning }
              checked={ this.props.bot.running }
              id="normal-switch"
            />
        </label>
      </div>
    );
  }
}

