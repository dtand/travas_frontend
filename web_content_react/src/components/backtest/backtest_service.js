import React from "react";
import TabMenu from "../platform/tab_menu";
import BacktestSettingsTab from "./backtest_settings_tab";
import ApiController from "../../js/ApiController"
import BacktestResultsTab from "./backtest_results_tab";
import NotificationController from "../../js/NotificationController"
import Loader from "../generic/loader";

export default class BacktestService extends React.Component {

  constructor(props){
    super(props);
    this.state={
      loading: false,
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
    for(let s=0;s<this.props.userStrategies.length;s++){
      const strategy = this.props.userStrategies[s];
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
      archivedTests: this.props.archivedTests,
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

    this.props.appendArchive(archive);

    this.setState({
      backtestResults: backtestResults,
      backtestParams: params,
      loading: false,
      currentTab: 1,
      archivedTests: this.props.archivedTests,
      selectedTest: 0
    });

  }

  async resetLoading(){
    this.setState({
      loading: false
    });
  }

  async submitBacktestCallback(payload){
    if(this.props.userStrategies.length === 0){
      NotificationController.displayNotification(
        "NO STRATEGIES",
        <span> 
          You have yet to create any strategies, please navigate to: 
          <br/>
          <span className="text-primary clickable" onClick={ () => this.props.selectService("Strategies") }> STRATEGY MANAGER </span> 
          <br/>
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
      this.resetLoading,
      function(){
        self.setState({
          loading: false
        });
      }
    );
    this.setState({
      loading: true,
      loadingMessage: "Running Backtest..."
    });
  }

  strategyExists(id){
    for(let s=0;s<this.props.userStrategies.length;s++){
      const strategy = this.props.userStrategies[s];
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

  getTab(){

    if(this.state.currentTab === 0) {
      return <BacktestSettingsTab submitCallback={ this.submitBacktestCallback }
                                  backtestCompleteCallback={ this.loadResultsTab }
                                  userStrategies={ this.props.userStrategies }
                                  archivedTests={ this.props.archivedTests }
                                  markets={ this.props.markets }
                                  quotes={ this.props.quotes }
                                  getStrategyWithId={ this.getStrategyWithId }
                                  archivedTests={ this.props.archivedTests }
                                  selectService={ this.props.selectService }/>
    }
    else if(this.state.currentTab === 1){
      return <BacktestResultsTab archivedTests={ this.props.archivedTests }
                                 backtestResults={ this.state.backtestResults }
                                 backtestParams={ this.state.backtestParams }
                                 getStrategyWithId={ this.getStrategyWithId }
                                 toggleLoading={ this.toggleLoading }
                                 loadArchivedResults={ this.loadArchivedResults }
                                 selectedTest={ this.state.selectedTest }
                                 appendBot={ this.props.appendBot }/>
    }
  }

  updateTab(newTab){
     this.setState({
       currentTab: newTab,
     });
  }

  render() {
    return (
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
            { !this.state.loading && this.getTab() }
            { this.state.loading && <Loader loadingMessage={ this.state.loadingMessage }/> }
        </div>
      </div>
    );
  }
}

