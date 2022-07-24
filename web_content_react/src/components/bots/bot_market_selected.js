import React from "react";
import BotSummaryTable from "./bot_summary_table"
import Loader from "../generic/loader"
import NVD3Chart from "react-nvd3"
import GlobalStateController from "../../js/GlobalStateController"
import Dropdown from "../generic/dropdown"
import IconHeader from "../generic/icon_header"
import HoverIcon from "../generic/hover_icon"
import ApiController from "../../js/ApiController"
import SimpleToggle from "../generic/simple_toggle";
import ModalController from "../../js/ModalController";
import Utils from "../../js/Utils"

const GRAPH_CONTAINER={
  height: "20em"
}

const WIDTH_CONSTANT_TOGGLED=1.7;

const WIDTH_CONSTANT=2;

const HEIGHT_CONSTANT=1.5;

export default class BotMarketSelected extends React.Component {

  constructor(props){
   
    super(props);
    this.state={
      buyAndHold: false
    }
    /** 
    this.metricsCallbacks={
      "best trade": function(value){ return parseFloat(value*100).toFixed(2) + "%" },
      "worst trade": function(value){ return parseFloat(value*100).toFixed(2)  + "%" },
      "expectancy": function(value){ return parseFloat(value*100).toFixed(2)  + "%" },
      "max drawdown": function(value){ return parseFloat(value*100).toFixed(2)  + "%" }
    }*/
    const self = this;
    GlobalStateController.registeredComponentWithState(self,"platformToggled");
    this.selectFromWatchList = this.selectFromWatchList.bind(this);
    this.selectFromWatchListSuccess = this.selectFromWatchListSuccess.bind(this);
    this.isWatched = this.isWatched.bind(this);
  }

  isWatched(){
    for(let b=0; b<this.props.watchList.length;b++){
      const bot = this.props.watchList[b]["alltime"];
      if( bot === undefined){
        continue;
      }
      if(bot.botId == this.props.bot.botId){
        return true;
      }
    }
    return false;
  }

  getDatum() {

    var data    = [];
    var buyHold = [];
    var lastBuy = undefined;
    let x=1;
    const initialInvestment = 1.00;
    let firstBuy = undefined;

    for(let l=0;l<this.props.botLogs.length;l++){
      const log = this.props.botLogs[l];
      let gain  = 0;
      if(log.action.toUpperCase() === "BUY"){
        lastBuy = parseFloat(log.networth);
      }
      else if(log.action.toUpperCase() === "SELL"){
        gain = (parseFloat(log.networth)/lastBuy) - 1.00;
      }
      if(log.action.toUpperCase() === "BUY" || 
         log.action.toUpperCase() === "SELL" ||
         l === this.props.botLogs.length-1 ){
        data.push({
          y: parseFloat(log.networth).toFixed(4),
          x: x++,
          z: parseFloat(log.closePrice).toFixed(8), 
          w: gain.toFixed(4),
          a: log.action,
          m: log.message
        });
        if(firstBuy == undefined && this.state.buyAndHold){
          firstBuy = initialInvestment / parseFloat(log.closePrice);
        }
        if(this.state.buyAndHold){
          let buyAndHoldPoint = firstBuy * parseFloat(log.closePrice);
          let buyAndHoldGain  = (buyAndHoldPoint/initialInvestment) - 1.00;
          buyHold.push({
            y: buyAndHoldPoint.toFixed(4),
            x: x-1,
            a: "BUY AND HOLD",
            w: buyAndHoldGain
          });
        }
      }
    }

    if(this.state.buyAndHold){
      return [
        {
          values: data,
          color: '#007bff',
          area: false,
          key: this.props.bot.username + " #" + this.props.rank
        },
        {
          values: buyHold,
          color: '#6eaff5',
          area: false,
          key: "Buy And Hold"
        }
      ];
    }
    return [
      {
        values: data,
        color: '#007bff',
        area: false,
        key: this.props.bot.username + " #" + this.props.rank
      }
    ];
  }

  selectFromWatchListSuccess(response,bot){
    this.props.selectBot(bot,response.rank-1,true);
  }

  selectFromWatchList(bot){
    ApiController.doPostWithToken("get_bot_rank",{
      "botId": bot.botId,
      "leaderboard": this.props.filter  
      }, this.selectFromWatchListSuccess, 
      bot);
  }

  buildWatchlist(){
    let bots = []
    for(let b=0;b<this.props.watchList.length;b++){
      const bot = this.props.watchList[b][this.props.filter];
      if(Object.keys(bot).length != 0){
        bot.username = bot.botOwner;
        bots.push(bot.botOwner.toUpperCase() + "/" + bot.botName.toUpperCase());
      }
    }
    return bots;
  }

  buildMappedData(){
    let bots = []
    for(let b=0;b<this.props.watchList.length;b++){
      let bot = this.props.watchList[b][this.props.filter];
      if(Object.keys(bot).length != 0){
        bot.username = bot.botOwner;
        bots.push(bot);
      }
    }
    return bots;
  }

  adaptBot(){
    return{
      name: this.props.bot.botName,
      averageROI: this.props.bot.avgRoi,
      exchange: this.props.bot.exchange,
      market: this.props.bot.market,
      numTrades: this.props.bot.numTrades,
      winLoss: this.props.bot.winLoss,
      bestTrade: this.props.bot.bestTrade,
      worstTrade: this.props.bot.worstTrade,
      expectancy: this.props.bot.expectancy,
      profitFactor: this.props.bot.profitFactor,
      maxDrawdown: this.props.bot.maxDrawdown,
      highestBid: 100,
      id: this.props.bot.botId
    }
  }
  
  getRoiText(){
    const roi = parseFloat(this.props.bot.roi);

    if(roi < 0){
      return <span className="text-danger">
              { " ↓" + (parseFloat(this.props.bot.roi)*100).toFixed(2) + "%" }
             </span>
    }
    else if(roi > 0){
      return <span className="text-success">
              { " ↑" + (parseFloat(this.props.bot.roi)*100).toFixed(2) + "%" }
             </span>
    }
    return <span className="text-secondary">
            { " " + (parseFloat(this.props.bot.roi)*100).toFixed(2) + "%" }
           </span>
  }

  componentDidUpdate(){
    Utils.clearTooltips();
  }

  render(){  

    const self = this;
    const isWatched = this.isWatched();

    return(
      <div className="row" style={{marginBottom:"10px"}}>
      <div class="col-md-4 theme-banner-one text-left border">
        <h2 class="text-black" style={{marginTop:"10px"}}>
          RANK #{this.props.rank} ({this.props.filter.toUpperCase()})
        </h2>	
        <div class="border-bottom">
          <h3 style={{marginLeft:"5px",marginBottom:"10px"}} class="text-secondary">
              {this.props.bot.exchange.toUpperCase() + " | " + 
               this.props.bot.market.toUpperCase() }
          </h3>
        </div>  
        <div className="margins-10">     
        <BotSummaryTable bot={ this.adaptBot() }
                         metrics={ this.props.metrics }
                         fields={[
                           "avg roi", "trades", "win/loss","best trade", "worst trade", "expectancy",
                            "profit factor", "max drawdown", "highest bid"
                         ]}
                         metricsCallbacks={ this.metricsCallbacks }/>
        </div>  
        <div className="row text-center margin-top-10 margin-bottom-10">
            <div className="col-md-6">
            <HoverIcon classOverride = { isWatched ? "text-primary" : "text-secondary" }
                       tooltipId="watchBot"
                       icon="fa-binoculars"
                       onClick={ function(){ 
                                  self.props.watchBot(self.props.bot, self.props.bot.botId, !isWatched);
                                }
                               }
                       info={ isWatched ? "UNWATCH" : "WATCH" }/>
            </div>
            <div className="col-md-6">
            <HoverIcon tooltipId="bidBot"
                      icon="fa-money"
                       onClick={ function(){
                         ModalController.updateData(
                           "bidBotModal",
                           {
                             bot: self.props.bot,
                             onBidBotSuccess: self.props.onBidBotSuccess
                           },
                        );
                        ModalController.showModal("bidBotModal");
                       } }
                      info="BID"/>
            </div>
        </div>
			</div>
        <div className="col-md-8 text-right">
        <div className="container text-center" style={ GRAPH_CONTAINER }>
        <div className="row border-bottom margin-left-10 margin-right-10">
          <div className="col-md-9 text-left">
            <h2 className="text-black margin-bottom-20">{this.props.bot.botName.toUpperCase()}{this.getRoiText() }</h2>
          </div>
          <div className="col-md-3 text-right margin-bottom-20">
            <Dropdown id="watchListDropdown"
                          dropdownList={ this.buildWatchlist() }
                          header={ <IconHeader textClass="text-center"
                                               iconClass="fa fa-binoculars"
                                               anchor="left"
                                               header="WATCHLIST"/> }
                          onClickRow={ this.selectFromWatchList }
                          mappedData={ this.buildMappedData() }
                          buttonText={ "WATCHLIST" }
                          flipped={ this.props.watchList.length != 0 }/>
            </div>
        </div>
        <div className="float-left margin-top-10">
            <SimpleToggle onChange={ function(){ 
                            self.setState({
                              buyAndHold: !self.state.buyAndHold
                            })}
                          }
                          active={ this.state.buyAndHold }
                          label="Buy And Hold"/> 
        </div>
          { !this.props.loadingGraph &&
          <div className="border-bottom margin-top-10">
          <NVD3Chart type='lineChart'
                    yAxis={{
                      showMaxMin: false,
                    }}
                    xAxis={{
                      showMaxMin: false,
                    }}
                    showLegend={false}
                    showXAxis={false}
                    showYAxis={false}
                     domain={{min:0,max:10}}
                     datum={this.getDatum()}
                     height={window.innerHeight / HEIGHT_CONSTANT}
                     width={window.innerWidth / (GlobalStateController.getValue("platformToggled") ? WIDTH_CONSTANT : WIDTH_CONSTANT_TOGGLED )}
                     margin={ {top: 5, right:0, bottom: 40, left:0} }
                     tooltip={{contentGenerator: function(data){
                      const x = data.point.x;
                      const y = parseFloat(data.point.y).toFixed(4);
                      const z = parseFloat(data.point.z).toFixed(8); //Last price
                      const w = parseFloat(data.point.w).toFixed(4); //Gain
                      const a = data.point.a;

                      if(a === "BUY AND HOLD" && w >= 0){
                        return "<h4 class='text-primary border-bottom' style='margin-top:10px;margin-left:10px;margin-bottom:10px;margin-right:10px'>BUY AND HOLD</h4>" +
                               "<h5 class='text-left' style='margin-left:10px'> Networth: " + y + "</h5>" +
                               "<h5 class='text-left' style='margin-left:10px;margin-right:10px'> Gain: " + "<span class='text-success'>" + (w*100).toFixed(2)+"%" + "</span>" + "</h5>"
                      }
                      if(a === "BUY AND HOLD" && w < 0){
                        return "<h4 class='text-primary border-bottom' style='margin-top:10px;margin-left:10px;margin-bottom:10px;margin-right:10px'>BUY AND HOLD</h4>" +
                               "<h5 class='text-left' style='margin-left:10px'> Networth: " + y + "</h5>" +
                               "<h5 class='text-left' style='margin-left:10px;margin-right:10px'> Loss: " + "<span class='text-danger'>" + (w*100).toFixed(2)+"%" + "</span>" + "</h5>"
                      }
                      if(a === "BUY"){
                        return "<h4 class='text-success border-bottom' style='margin-top:10px;margin-left:10px;margin-bottom:10px;margin-right:10px'>TRADE #" + Math.ceil(x/2) + " - BUY</h4>" +
                               "<h5 class='text-left' style='margin-left:10px'> Networth: " + y + "</h5>";
                      }
                      else if(a === "SELL" && w >= 0){
                        return "<h4 class='text-danger border-bottom' style='margin-top:10px;margin-left:10px;margin-bottom:10px;margin-right:10px'>TRADE #" + Math.ceil(x/2)  + " - SELL</h4>" +
                               "<h5 class='text-left' style='margin-left:10px'> Networth: " + y + "</h5>" +
                               "<h5 class='text-left' style='margin-left:10px;margin-right:10px'> Gain: " + "<span class='text-success'>" + (w*100).toFixed(2)+"%" + "</span>" + "</h5>" +
                               "<div class='text-left' style='margin-left:10px'>";
                      }
                      else if(a === "SELL" && w < 0){
                        return "<h4 class='text-danger border-bottom' style='margin-top:10px;margin-left:10px;margin-bottom:10px;margin-right:10px'>TRADE #" + Math.ceil(x/2) + " - SELL</h4>" +
                               "<h5 class='text-left' style='margin-left:10px'> Networth: " + y + "</h5>" +
                               "<h5 class='text-left' style='margin-left:10px;margin-right:10px'> Loss: " + "<span class='text-danger'>" + (w*100).toFixed(2)+"%" + "</span>" + "</h5>" +
                               "<div class='text-left' style='margin-left:10px'>";
                      }
                      else if(a === "HOLD"){
                        return "<h4 class='text-primary border-bottom' style='margin-top:10px;margin-left:10px;margin-bottom:10px;margin-right:10px'>HOLD (LAST ACTION)</h4>" +
                               "<h5 class='text-left' style='margin-left:10px'> Networth: " + y + "</h5>";
                      }
                    }}}/>
            </div>
          }
          {
            this.props.loadingGraph &&
              <Loader styleOverride={{marginTop: "240px"}}
                      loadingMessage={ "" }/>
          }
        </div>
        </div>
      </div>
    );
  }
}