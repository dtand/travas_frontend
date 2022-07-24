import React from "react";
import TabMenu from "../platform/tab_menu";
import PlatformLandingHeader from "../landing_page/platform_landing_header";
import Dropdown from "../generic/dropdown";
import Constants from "../../js/Constants";

import FilterTable from "../generic/filter_table"
import ApiController from "../../js/ApiController";
let NotificationSystem = require('react-notification-system');

const BACKGROUND = {
  marginTop: "4px",
  backgroundColor: "white"
}

const MARGINS = {
  marginLeft: "15px",
  marginRight: "15px",
  marginTop: "25px"
}

const MIN_HEIGHT = {
  minHeight: window.innerHeight
}


let BOT_SERVER = "http://localhost:8090/bots/";

export default class AdminMain extends React.Component {

  constructor(props){
    super(props);
    this.state={
      currentTab: 0,
      selectedExchange: "binance",
      selectedInterval: "1m",
      selectedServer: "https://stg-platform.travas.io:443:54.37.254.47/bots/",
      init: true,
      bots: [],
      userInfo: undefined
    }
    this.updateTab = this.updateTab.bind(this);
    this.exchangeStreams = new Map();
    this.exchanges = [];
    this.getExchangeStream = this.getExchangeStream.bind(this);
    this.selectExchange = this.selectExchange.bind(this);
    this.selectInterval = this.selectInterval.bind(this);
    this.selectServer   = this.selectServer.bind(this);
  }


  buildStreamData(){
    let data = [];
    if(this.state.init){
      return [];
    }
    else{
        const exchange = this.state.selectedExchange;
        const markets  = this.filterByInterval();
        for(let r=0;r<markets.length;r++){
          const market = markets[r];

          if(Object.keys(market.last_kline).length !== 0){
            data.push([
              exchange.toUpperCase(),
              market.market.toUpperCase(),
              market.interval.toUpperCase(),
              market.last_kline.open,
              market.last_kline.close,
              market.last_kline.high,
              market.last_kline.low,
              market.last_kline.volume,
              market.last_price
            ]);
          }
          else{
            data.push([
              exchange.toUpperCase(),
              market.market.toUpperCase(),
              market.interval.toUpperCase(),
              0,
              0,
              0,
              0,
              0,
              market.last_price
            ]);
          }
        }

    }
    return data;
  }

  buildBotData(){
    let data = [];
    if(this.state.init){
      return [];
    }
    else{
        for(let r=0;r<this.state.bots.length;r++){
          const bot = this.state.bots[r];
            data.push([
              bot.exchange.toUpperCase(),
              bot.market.toUpperCase(),
              bot.interval.toUpperCase(),
              bot.bot.botId,
              bot.bot.quoteHoldings.toFixed(8),
              bot.bot.assetHoldings.toFixed(8),
              this.getIndicators(bot.bot.indicators.buyIndicators),
              this.getIndicators(bot.bot.indicators.sellIndicators),
              new Date(Number(bot.lastActionTime)).toString()
            ]);
        }

    }
    return data;
  }

  getIndicators(indicators){
    return Object.keys(indicators).map((key) => 
      <div>
        { key !== "class" && 
          key.toUpperCase() + ": " + indicators[key]
        }
      </div>
    );
  }

  selectExchange(exchange){
    exchange = exchange.toLowerCase();
    if(exchange === "coinbase pro"){
      exchange = "gdax";
    }
    this.exchangeStreams = new Map();
    this.getExchangeStream(exchange);
  }

  selectInterval(interval){
    this.setState({
      selectedInterval: interval
    });
  }

  selectServer(server){
    server = server.split(" ")[0];
    if( server === "localhost:8080"){
      this.setState({
        selectedServer: "http://" + server + "/bots/"
      });
    }
    else{
      this.setState({
        selectedServer: "https://" + server + "/bots/"
      });
    }
  }

  filterByInterval(){
    const exchange = this.state.selectedExchange;
    const markets  = this.exchangeStreams.get(exchange).markets;
    let filtered   = [];
    for(let r=0;r<markets.length;r++){
      const market = markets[r];
      if(market.interval.toLowerCase() === this.state.selectedInterval.toLowerCase()){
        filtered.push(market);
      }
    }
    return filtered;
  }

  getTab(){
    const self = this;
    if(this.state.currentTab === 1) {
      return <div className="margins-25">
        <div className="row margins-25">
        <div className="col-md-2">
          <Dropdown header="EXCHANGES"
                    buttonText={ this.state.selectedExchange.toUpperCase() }
                    dropdownList={[
                      "COINBASE PRO",
                      "BINANCE"
                    ]}
                    onClickRow={ this.selectExchange }/>
        </div>
        <div className="col-md-2">
          <Dropdown header="INTERVALS"
                    buttonText={ this.state.selectedInterval.toUpperCase() }
                    dropdownList={ Constants.SUPPORTED_INTERVALS }
                    onClickRow={ this.selectInterval }/>
        </div>
        </div>
        <FilterTable header={[
          "EXCHANGE",
          "MARKET",
          "INTERVAL",
          "OPEN",
          "CLOSE",
          "HIGH",
          "LOW",
          "VOL",
          "LAST"
        ]}
        data={ this.buildStreamData() }
        disableClick={ true }
        align="left"
        classOverride="row"
        searchText="Search markets..."/>
      </div>
    }
    else if(this.state.currentTab === 0){
      
      return <div className="margins-25">
                <FilterTable header={[
                            "EXCHANGE",
                            "MARKET",
                            "INTERVAL",
                            "ID",
                            "QUOTE HOLDINGS",
                            "BASE HOLDINGS",
                            "BUY INDICATORS",
                            "SELL INDICATORS",
                            "LAST ACTION"
                          ]}
                          data={ this.buildBotData() }
                          disableClick={ true }
                          align="left"
                          classOverride="row"
                          searchText="Search bots..."/>
            </div>
    }
    
  }

  updateTab(newTab){
     this.setState({
       currentTab: newTab,
     });
  }

  async getExchangeStream(exchange){
    if(!exchange){
      exchange = this.state.selectedExchange;
    }
    const self  = this;
    ApiController.doPostWithToken(
      "exchange_streams",
      {
        "exchange": exchange
      },
      function(data){
        self.exchangeStreams.set(exchange,data);
        self.exchanges.push(exchange);
        self.setState({
          init: false,
          selectedExchange: exchange
        });
      },
      undefined,
      () => { window.location = "../" }
    )
  }


  async getBots(){
    const self  = this;
    ApiController.doPostWithToken(
      "bot_threads",
      {},
      function(data){
        self.setState({
          init: false,
          bots: data.botThreads
        });
      },
      undefined,
      () => { window.location = "../" }
    )
  }

  componentDidMount(){
    const self = this;
    ApiController.doPostWithToken(
      "user_profile",
      {},
      function(response){
        self.setState({
          userInfo: response
        });
        if(!response.acccess){
          window.location = "../";
          return;
        }
        self.getExchangeStream();
        self.getBots();
      },
      undefined,
      () => {
        window.location = "../";
      }
    )

    setInterval(this.getExchangeStream,30000);
    setInterval(this.getBots,60000);
  }

  render() {
    return (
      <div>
        <div id="page-top" className="overflow-x-hidden">
          <PlatformLandingHeader subMessage="ADMIN"/>
          <div style={ BACKGROUND }>
            <div style={ MARGINS }>
              <TabMenu updateTab={ this.updateTab }
                       currentTab={ this.state.currentTab } 
                        tabs={ [
                { 
                  name: "BOTS",
                  href: "bots" 
                },
                { 
                  name: "STREAMS",
                  href: "exchange streams"
                }] }/>
              <div class="tab-content" style={ MIN_HEIGHT }>
                { 
                  this.getTab()
                }
              </div>
            </div>
          </div>
          <div className="float-right">
            <NotificationSystem ref="notificationSystem"/>
          </div>
        </div>
      </div>
    );
  }
}

