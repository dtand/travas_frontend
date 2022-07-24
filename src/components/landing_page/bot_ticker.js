import React from "react";
import NVD3Chart from "react-nvd3"
import ApiController from "../../js/ApiController"
import Loader from "../generic/loader"
import Utils from "../../js/Utils"
import BotSummaryTable from "../bots/bot_summary_table";
import Constants from "../../js/Constants";
import CryptoIcon from "../generic/crypto_coin";

const TEXT_STYLE = {
  marginTop: "10px",
  marginBottom: "5px",
  color: "black"
}

const MARGIN_SUB_TITLE = {
  marginBottom: "5px",
  fontSize: "20px"
}

const MARGIN_BOTTOM = {
  marginBottom: "5px"
}

const ROI_TEXT = {
  position: "absolute",
  bottom: "0",
  left: "0",
  fontSize: "48px",
}

export default class BotTicker extends React.Component {
  
  constructor(props){
    super(props);
    this.state={
      botLogs: undefined,
      hovered: false,
      isFront: true
    }
    this.onHover  = this.onHover.bind(this);
    this.offHover = this.offHover.bind(this);
    this.onClick  = this.onClick.bind(this);

    this.min = 99999;
    this.max = -1;
  }


  onClick(){
    this.setState({
      isFront: !this.state.isFront
    });
  }

  onHover(){
    this.setState({
      hovered: true
    });
  }

  offHover(){
    this.setState({
      hovered: false
    });
  }

  roiToString(value){
    const text = (value*100).toFixed(2) + "%";
    if(value>0){
      return <span className="text-success">{ "↑" + text }</span>
    }
    else if(value<0){
      return <span className="text-danger">{ "↓" + text }</span>
    }
    return <span className="text-secondary">{ text }</span>
  }

  getDatum() {

    var data = [];
    this.min = 99999;
    this.max = -1;
    for(let l=0;l<this.state.botLogs.length;l++){
      const log = this.state.botLogs[l];
      if(log.action.toUpperCase() === "BUY" || 
         log.action.toUpperCase() === "SELL"){
        data.push({
          y: parseFloat(log.networth).toFixed(4),
          x: new Date(log.timestamp)
        });
        this.min = Math.min(this.min,log.networth);
        this.max = Math.max(this.max,log.networth);
      }
    }

    return [
      {
        values: data,
        color: '#007bff',
        area: true
      }
    ];
  }

  getClass(){
    if(this.state.hovered){
      return "col-md-4 clickable border bot-ticker"
    }
    return "col-md-4 clickable border bot-ticker";
  }

  getBotLogs(){
    const self = this;
    ApiController.doPostWithToken(
      "bot_logs_public",
      {
        "botOwner": this.props.bot.username,
        "botId": this.props.bot.botId,
        "period": this.props.period.toLowerCase()
      },
      function(response){
        if(response.userBot.id === self.props.bot.botId){
          self.setState({
            botLogs: response.botLogs,
            bot: response.userBot
          });
        }
      }
    );
  }

  componentDidMount(){
    this.getBotLogs();
  }

  componentDidUpdate(){
    if(this.props.updateBot){
      this.getBotLogs();
      this.setState({
        botLogs: false
      });
      this.props.afterBotUpdate();
    }
    Utils.clearTooltips();
  }

  render() {

    const datum = this.state.botLogs ? this.getDatum() : [];

    return (
      <div onClick={ this.onClick }
           onMouseEnter={ this.onHover }
           onMouseLeave={ this.offHover }
           className="row">
        { this.state.botLogs && 
              <div className={ this.getClass() }>
                <h4 style={ TEXT_STYLE }>
                    <div className="row border-bottom margin-left-10 margin-right-10">
                      <div className="col-md-8 text-left text-black">
                        <span style={ MARGIN_BOTTOM }>
                          <strong>{ this.state.bot.botName.toUpperCase() }</strong>
                          <div className="text-secondary text-left margin-left-5 margin-right-5">
                            <p style={ MARGIN_SUB_TITLE }> 
                              {this.state.bot.exchange.toUpperCase() + " "}{this.state.bot.market }
                            </p>
                          </div>
                        </span>
                     </div>
                     <div className="col-md-4">
                         <h2>
                            <span className="text-black float-right text-right">
                              { "#" + this.props.bot.rank }
                            </span>
                          </h2>
                        </div>
                    </div>
                </h4>
                <div>
                  <div className="row text-right"  style={ ROI_TEXT }>
                    <div className="col-md-12">
                      <h2>
                        { this.roiToString(this.props.bot.roi) }
                      </h2>
                    </div>
                  </div>
                  <NVD3Chart type='lineChart'
                      yDomain={[this.min,this.max]}
                      margin={ {top: 15, right:5, bottom: 15, left:0} }
                      datum={ datum }
                      showXAxis={false}
                      showYAxis={false}
                      showLegend={ false }
                      useInteractiveGuideline={ false }
                      height={ 256 }/>
                </div>
            </div> 
        }
        { !this.state.botLogs &&
          <div className={ this.getClass() }>
            <h3 className="text-center">
             <br/><br/><br/>
             Loading bot <br/> { this.props.bot.botName.toUpperCase() }...
             <br/><br/>
              <i className="fa fa-spin fa-spinner"/>
            </h3>

          </div>
        }
        { !Constants.IS_MOBILE &&
          <div className="col-md-7 bot-ticker-metrics border">
            <div className="col-md-1 margin-left-25"/>
            <div className="row margin-left-5 margin-right-5">
                <div className="text-left text-secondary col-md-5 margin-left-5 margin-right-15">
                  <BotSummaryTable 
                  bot={ this.props.bot }
                  fields={[
                    "owner",
                    "score",
                    "avg roi",
                    "trades",
                    "win/loss"
                  ]}/>
                </div>
                <div className="text-left text-secondary col-md-5">
                  <BotSummaryTable 
                  bot={ this.props.bot }
                  fields={[
                    "best trade",
                    "worst trade",
                    "expectancy",
                    "profit factor",
                    "max drawdown"
                  ]}/>
                </div>
            </div>
          </div>
        }

      </div>
    );
  }
}