import React from "react";
import TabMenu from "../platform/tab_menu";
import BacktestSettingsTab from "./backtest_settings_tab";
import ApiController from "../../js/ApiController"
import Constants from "../../js/Constants"
import BacktestResultsTab from "./backtest_results_tab";
import Loader from "../generic/loader";
import NotificationController from "../../js/NotificationController";
import StrategiesManagerTab from "../strategies/strategies_manager_tab";
import ModalController from "../../js/ModalController";
import ModalFactory from "../modals/modal_factory";
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

const DEMO_LIMITS = 20;


export default class BacktestMainPublic extends React.Component {

  constructor(props){
    super(props);
    this.state={
      loading: true,
      markets: new Map(),
      quotes: new Map(),
      userStrategies: Constants.DEMO_STRATEGIES,
      archivedTests: [],
      exchangeCount: 0,
      currentTab: 0,
      backtestResults: undefined,
      backtestParams: [],
      backtestStrategy: "",
      backtestExchange: "",
      backtestInitial: 0,
      backtestQuote: "",
      loadingMessage: "Loading...",
      selectedTest: -1,
      inHouseSignals: undefined
    }
    this.onGetMarketsSuccess    = this.onGetMarketsSuccess.bind(this);
    this.onGetStrategiesSuccess = this.onGetStrategiesSuccess.bind(this);
    this.onGetArchivesSuccess   = this.onGetArchivesSuccess.bind(this);
    this.loadResultsTab         = this.loadResultsTab.bind(this);
    this.updateTab              = this.updateTab.bind(this);
    this.getStrategyWithId      = this.getStrategyWithId.bind(this);
    this.submitBacktestCallback = this.submitBacktestCallback.bind(this);
    this.toggleLoading          = this.toggleLoading.bind(this);
    this.loadArchivedResults    = this.loadArchivedResults.bind(this);
    this.strategyExists         = this.strategyExists.bind(this);
    this.filterArchives         = this.filterArchives.bind(this);
    this.resetLoading           = this.resetLoading.bind(this);
    this.getInHouseSignals      = this.getInHouseSignals.bind(this);
    this.appendStrategy         = this.appendStrategy.bind(this);
    this.showDemoLimits         = this.showDemoLimits.bind(this);
    this.notificationSystem = null;

    ModalController.registerModal("saveStrategyModal",this);
    ModalController.registerModal("deleteStrategyModal",this);
    ModalController.registerModal("demoLimitsModal",this);
  }
  
  async appendStrategy(strategy){
    let strategies = this.state.userStrategies;
    strategies.push(strategy);
    this.setState({
      userStrategies: strategies
    });
  }

  toggleLoading(flag,message){
    if(message){
      this.state.loading = flag;
      this.state.loadingMessage = message;
      this.setState({
        loading: flag,
        loadingMessage: message
      });
    }
    else{
      this.setState({
        loading: flag
      });
    }
  }

  getStrategyWithId(id){
    for(let s=0;s<this.state.userStrategies.length;s++){
      const strategy = this.state.userStrategies[s];
      if(strategy.id === id){
        return strategy;
      }
    }
    return undefined;
  }

  async loadArchivedResults(response,backtestParams,selectedTest){
    this.setState({
      backtestResults: response.backtestResults,
      loading: false,
      currentTab: 2,
      archivedTests: this.state.archivedTests,
      selectedTest: selectedTest,
      backtestParams: backtestParams
    });
  }

  loadResultsTab(response,params){
    
    const backtestResults = response.backtestResults;

    const archive = {
        parameters: params,
        timestamp: new Date()
    }

    this.state.archivedTests.unshift(archive);

    this.setState({
      backtestResults: backtestResults,
      backtestParams: params,
      loading: false,
      currentTab: 2,
      archivedTests: this.state.archivedTests,
      selectedTest: 0
    });
  }

  async resetLoading(){
    this.setState({
      loading: false
    });
  }

  async submitBacktestCallback(payload){
    if(this.state.archivedTests.length === DEMO_LIMITS){
      this.showDemoLimits();
      return;
    }
    if(this.state.userStrategies.length === 0){
      NotificationController.displayNotification(
        "NO STRATEGIES",
        <span> 
          You have yet to create any strategies, please navigate to the 
            <a href="strategies"> 
              { " Strategy Manager " }
            </a>
          to create a strategy before running a backtest
        </span>,
        "error"
      );
      return;
    }
    const self = this;
    ApiController.doPostWithToken(
      "backtest_public",
      payload, 
      this.loadResultsTab, 
      payload,
      this.resetLoading
    );
    this.setState({
      loading: true,
      loadingMessage: "Running Backtest..."
    });
  }

  async onGetMarketsSuccess(response,exchange){
    this.state.markets.set(exchange,response.markets);
    this.state.exchangeCount++;
    let quotes = [];
    for(let m=0; m<response.markets.length;m++){
      const quote = response.markets[m].quote;
      if(quotes.indexOf(quote) === -1){
        quotes.push(quote);
      }
    }
    this.state.quotes.set(exchange,quotes);
    this.checkInit();
  }

  async onGetStrategiesSuccess(response){
    this.state.userStrategies = response.strategies;
    ApiController.doPostWithToken("backtest_archives",{},this.onGetArchivesSuccess);
    this.checkInit();
  }

  strategyExists(id){
    for(let s=0;s<this.state.userStrategies.length;s++){
      const strategy = this.state.userStrategies[s];
      if(strategy.id === id){
        return true;
      }
    }
    return false;
  }

  filterArchives(response){
    let filteredArchives = []
    for(let a=0;a<response.archives.length;a++){
      const archive = response.archives[a].parameters;
      let exists    = true;
      for(let b=0;b<archive.backtests.length;b++){
        const backtest = archive.backtests[b];
        exists = exists && this.strategyExists(backtest.strategyId);
      }
      if(exists){
        filteredArchives.push(response.archives[a]);
      }
    }
    return filteredArchives;
  }

  async onGetArchivesSuccess(response){
    this.state.archivedTests = this.filterArchives(response);
    this.state.backtestResults = [];
    this.state.backtestParams  = this.state.archivedTests[0] ? 
                                 this.state.archivedTests[0].parameters : 
                                 undefined;
    this.state.selectedTest    = 0;
                                 
    this.checkInit();
  }

  async getInHouseSignals(self){
    ApiController.doPost(
      "get_signals",
      {},
      function(response){
        self.setState({
          inHouseSignals: response
        });
      }
    );
  }

  showDemoLimits(){
    ModalController.showModal(
      "demoLimitsModal",
      {
        userStrategies: this.state.userStrategies,
        archivedTests: this.state.archivedTests
      }
    )
  }

  checkInit(){
    if(this.state.exchangeCount === Constants.SUPPORTED_EXCHANGES.length) {
      this.setState({
        loading: false
      }); 
    }
  }

  getTab(){

    if(this.state.currentTab === 1) {
      return <BacktestSettingsTab demo={ true }
                                  submitCallback={ this.submitBacktestCallback }
                                  backtestCompleteCallback={ this.loadResultsTab }
                                  userStrategies={ this.state.userStrategies }
                                  archivedTests={ this.state.archivedTests }
                                  markets={ this.state.markets }
                                  quotes={ this.state.quotes }
                                  getStrategyWithId={ this.getStrategyWithId }
                                  archivedTests={ this.state.archivedTests }
                                  showDemoLimits={ this.showDemoLimits }/>
    }
    else if(this.state.currentTab === 2){
      return <BacktestResultsTab demo={ true }
                                 archivedTests={ this.state.archivedTests }
                                 backtestResults={ this.state.backtestResults }
                                 backtestParams={ this.state.backtestParams }
                                 getStrategyWithId={ this.getStrategyWithId }
                                 toggleLoading={ this.toggleLoading }
                                 loadArchivedResults={ this.loadArchivedResults }
                                 selectedTest={ this.state.selectedTest }/>
    }
    else if(this.state.currentTab === 0){
      return <StrategiesManagerTab demo={ true }
                                   userStrategies={ this.state.userStrategies }
                                   inHouseSignals={ this.state.inHouseSignals }
                                   appendStrategy={ this.appendStrategy }
                                   showDemoLimits={ this.showDemoLimits }
                                   tickers={[
                                     {
                                       base: "BTC",
                                       quote: "USD",
                                       exchange: "gemini"
                                     },
                                     {
                                      base: "ETH",
                                      quote: "USD",
                                      exchange: "gemini"
                                     },
                                     {
                                      base: "LTC",
                                      quote: "USD",
                                      exchange: "gdax"
                                     },
                                     {
                                      base: "XRP",
                                      quote: "USDT",
                                      exchange: "binance"
                                     },
                                     {
                                      base: "XLM",
                                      quote: "USDT",
                                      exchange: "binance"
                                     },
                                     {
                                      base: "EOS",
                                      quote: "USDT",
                                      exchange: "binance"
                                     },
                                     {
                                      base: "ZEC",
                                      quote: "USDT",
                                      exchange: "bittrex"
                                     },
                                     {
                                      base: "DOGE",
                                      quote: "USDT",
                                      exchange: "bittrex"
                                     }
                                   ]}/>
    }
  }

  updateTab(newTab){
     this.setState({
       currentTab: newTab,
     });
  }

  componentDidMount(){
    this.getInHouseSignals(this);
    for(let e=0;e<Constants.SUPPORTED_EXCHANGES.length;e++){
      const payload = {
        "exchange": Constants.SUPPORTED_EXCHANGES[e]
      };
      ApiController.doPost("market_lookup",payload,this.onGetMarketsSuccess,Constants.SUPPORTED_EXCHANGES[e]);
    }
    this.notificationSystem = this.refs.notificationSystem;
    NotificationController.setNotificationSystem(this.notificationSystem);
  }

  render() {
    return (
      <div>
        <div id="page-top" className="overflow-x-hidden text-black">
          <div style={ BACKGROUND }>
            <div style={ MARGINS }>
              <br/><br/>
              <TabMenu updateTab={ this.updateTab }
                       currentTab={ this.state.currentTab } 
                        tabs={ [
                { 
                  name: "STRATEGIES",
                  href: "settings" 
                },
                { 
                  name: "BACKTEST",
                  href: "results"
                },
                { 
                  name: "RESULTS",
                  href: "strategies"
                } ] }/>
              <div class="tab-content" style={ MIN_HEIGHT}>
                { this.state && 
                  !this.state.loading &&
                  this.getTab()
                }
                {
                  this.state &&
                  this.state.loading &&
                  <div style={ { height: window.innerHeight } }>
                    <Loader loadingMessage={ this.state.loadingMessage }/>
                  </div>
                }
              </div>
            </div>
          </div>
          <div className="float-right">
            <NotificationSystem ref="notificationSystem"/>
          </div>
        </div>
          <ModalFactory platform={ this }/>
      </div>
    );
  }
}

