import React from "react";


export default class BotTitle extends React.Component {

  constructor(props){
    super(props);
  }

  getRoi(bot){
    const roi      = bot.roi;
    let roiElement = undefined;

    if(bot.trades === 0){
      roiElement = <span className="text-secondary">NO TRADES</span>;
    }

    if(roi < 0){
      roiElement = 
      <span className="text-danger">
        { "↓" + (roi*100).toFixed(2)+"%" }
      </span>
    }
    else if(roi > 0){
      roiElement = 
      <span className="text-success">
        { "↑" + (roi*100).toFixed(2)+"%" }
      </span>
    }
    else{
      roiElement = 
      <span className="text-secondary">
        { "0.00%" }
      </span>
    }

    return roiElement;
  }

  getSubTitle(bot){
    return bot.exchange.toUpperCase() + " (" +
           bot.interval.toUpperCase() + ")";
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
    const self = this;
    return (
      <div className="text-center">
        <h1 className="bot-title">
          { this.props.bot.name.toUpperCase() } - { this.props.bot.market.toUpperCase() }
        </h1>
        <h2 className="text-secondary bot-sub-title">
          <span className="margin-right-15">{ this.getSubTitle(this.props.bot) }</span>
        </h2>
      </div>
    );
  }
}

