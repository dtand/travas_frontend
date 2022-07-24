import React from "react";
import TabMenu from "../platform/tab_menu";
import PlatformTemplate from "../platform/platform_template";
import BacktestSettingsTab from "../backtest_settings_tab";
import ApiController from "../../js/ApiController"
import Constants from "../../js/Constants"
import BacktestResultsTab from "./backtest_results_tab";
import Loader from "../generic/loader";
import NotificationController from "../../js/NotificationController"

export default class BacktestMain extends React.Component {

  constructor(props){
    super(props);
    this.state={
      loading: true,
      markets: new Map(),
      quotes: new Map(),
      userStrategies: undefined,
      archivedTests: undefined,
      exchangeCount: 0,
      currentTab: 0,
      backtestResults: undefined,
      backtestParams: [],
      backtestStrategy: "",
      backtestExchange: "",
      backtestInitial: 0,
      backtestQuote: "",
      loadingMessage: "Loading...",
      selectedTest: -1
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
      currentTab: 1,
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
      currentTab: 1,
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
      "backtest",
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

  checkInit(){
    if( this.state.exchangeCount === Constants.SUPPORTED_EXCHANGES.length &&
        this.state.userStrategies != undefined && 
        this.state.archivedTests != undefined ) {
          this.setState({
            loading: false
          }); 
      }
  }

  getTab(){

    if(this.state.currentTab === 0) {
      return <BacktestSettingsTab submitCallback={ this.submitBacktestCallback }
                                  backtestCompleteCallback={ this.loadResultsTab }
                                  userStrategies={ this.state.userStrategies }
                                  archivedTests={ this.state.archivedTests }
                                  markets={ this.state.markets }
                                  quotes={ this.state.quotes }
                                  getStrategyWithId={ this.getStrategyWithId }
                                  archivedTests={ this.state.archivedTests }/>
    }
    else if(this.state.currentTab === 1){
      return <BacktestResultsTab archivedTests={ this.state.archivedTests }
                                 demo={ this.props.demo }
                                 backtestResults={ this.state.backtestResults }
                                 backtestParams={ this.state.backtestParams }
                                 getStrategyWithId={ this.getStrategyWithId }
                                 toggleLoading={ this.toggleLoading }
                                 loadArchivedResults={ this.loadArchivedResults }
                                 selectedTest={ this.state.selectedTest }/>
    }
  }

  updateTab(newTab){
     this.setState({
       currentTab: newTab,
     });
  }

  componentDidMount(){
    ApiController.doPostWithToken("get_strategies",{},this.onGetStrategiesSuccess);
    for(let e=0;e<Constants.SUPPORTED_EXCHANGES.length;e++){
      const payload = {
        "exchange": Constants.SUPPORTED_EXCHANGES[e]
      };
      ApiController.doPostWithToken("market_lookup",payload,this.onGetMarketsSuccess,Constants.SUPPORTED_EXCHANGES[e]);
    }
  }

  render() {
    return (
      <PlatformTemplate title="Analytics"
      subtitle="Backtest"
      serviceComponent={ 
        <div>
          <TabMenu updateTab={ this.updateTab }
                   currentTab={ this.state.currentTab } 
                   tabs={ [
            { 
              name: "SETTINGS",
              href: "setting" 
            },
            { 
              name: "RESULTS",
              href: "results"
            } ] }/>
          <div class="tab-content">
            { this.state && 
              !this.state.loading &&
              this.getTab()
            }
            {
              this.state &&
              this.state.loading &&
              <Loader loadingMessage={ this.state.loadingMessage }/>
            }
          </div>
        </div>
      } /> 
    );
  }
}

