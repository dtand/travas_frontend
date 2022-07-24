import React from "react";
import Constants from "../../js/Constants";
import Constraints from "../../js/Constraints";
import InitialInvestmentInput from "./initial_investment_input";
import SubmitBacktestButton from "./submit_backtest_button";
import DateInputField from "../generic/date_input_field";
import Dropdown from "../generic/dropdown";
import MarketStack from "./market_stack";
import MarketPanelHeader from "./markets_panel_header";
import FilterTable from "../generic/filter_table";
import IconHeader from "../generic/icon_header";
import CryptoIcon from "../generic/crypto_coin";
import NotificationController from "../../js/NotificationController"
import ReactTooltip from "react-tooltip"

const MAX_MARKETS = Constants.IS_MOBILE ? 3 : 5;

const STYLE = {
  marginTop: "10px"
}

const MARGIN_BOTTOM = {
  marginBottom: "10px"
}

const TAB_MARGIN = {
  marginTop: "5px",
  marginLeft: "15px",
  marginRight: "15px"
}

const FLOAT_RIGHT = {
  right: "15px"
}

const MARGIN_TOP = {
  marginTop: "25px"
}

const PADDING_LEFT = {
  right: "15px"
}

const TABLE_HEIGHT = {
  maxHeight: "900px",
}

const MARKETS_STYLE = {
  backgroundColor: "#f7f7f7"
}

export default class BacktestSettingsTab extends React.Component {

  constructor(props){
   super(props);

   if(this.props.archivedTests.length === 0){
    this.state={
      selectedInterval: "1D",
      selectedQuote: this.props.quotes.get(Constants.SUPPORTED_EXCHANGES[0])[0],
      selectedStrategy: this.props.userStrategies[0],
      selectedExchange: Constants.SUPPORTED_EXCHANGES[0],
      selectedMarkets: [],
      currentTest: 0
    }
   }
   else{
     
    const lastTest           = this.props.archivedTests[0].parameters.backtests;
    const mostRecentBacktest = lastTest[lastTest.length-1];
    this.state={
      selectedInterval: mostRecentBacktest.candleSize,
      selectedQuote: mostRecentBacktest.market.split('-')[1],
      selectedStrategy: this.props.getStrategyWithId(mostRecentBacktest.strategyId) ? 
                        this.props.getStrategyWithId(mostRecentBacktest.strategyId) :
                        this.props.userStrategies[0],
      selectedExchange: mostRecentBacktest.exchange,
      selectedMarkets: [],
      currentTest: lastTest.length-1
    }
    for(let b=0;b<lastTest.length;b++){
      const backtest = lastTest[b];
      if(this.props.getStrategyWithId(backtest.strategyId)){
        this.state.selectedMarkets.push({
          interval: backtest.candleSize,
          quote: backtest.market.split('-')[1],
          strategy: this.props.getStrategyWithId(backtest.strategyId),
          exchange: backtest.exchange,
          market: backtest.market,
        });
      }
    }
   }
   this.updateInterval = this.updateInterval.bind(this);
   this.updateStrategy = this.updateStrategy.bind(this);
   this.updateExchange = this.updateExchange.bind(this);
   this.updateQuote    = this.updateQuote.bind(this);
   this.removeMarket   = this.removeMarket.bind(this);
   this.addMarket      = this.addMarket.bind(this);
   this.clearMarkets   = this.clearMarkets.bind(this);
   this.randomizeMarkets = this.randomizeMarkets.bind(this);
   this.submitBacktest    = this.submitBacktest.bind(this);
   this.marketExistsInStack    = this.marketExistsInStack.bind(this);
   this.index    = this.indexOfMarket.bind(this);
  }

  updateInterval(interval){
    this.setState({
      selectedInterval: interval
    });
  }

  updateStrategy(strategy){
    this.setState({
      selectedStrategy: strategy
    });
  }

  updateExchange(exchange){
    this.setState({
      selectedExchange: exchange,
      selectedQuote: this.props.quotes.get(exchange)[0]
    });
  }

  updateQuote(quote){
    this.setState({
      selectedQuote: quote
    });
  }

  marketExistsInStack(marketString){
    for(let m=0;m<this.state.selectedMarkets.length;m++){
      const market = this.state.selectedMarkets[m];

      if(this.state.selectedExchange.toUpperCase() === market.exchange.toUpperCase() &&
         this.state.selectedInterval.toUpperCase() === market.interval.toUpperCase() &&
         this.state.selectedQuote.toUpperCase() === market.quote.toUpperCase() && 
         this.state.selectedStrategy.name.toUpperCase() === market.strategy.name.toUpperCase() && 
         marketString.toUpperCase() === market.market.toUpperCase()){
        return true;  
      } 
    }
    return false;
  }

  indexOfMarket(market){
    for(let m=0;m<this.state.selectedMarkets.length;m++){
      const marketBox = this.state.selectedMarkets[m];
      if(marketBox.exchange.toUpperCase() === market.exchange.toUpperCase() &&
        marketBox.interval.toUpperCase() === market.interval.toUpperCase() &&
        marketBox.quote.toUpperCase() === market.quote.toUpperCase() && 
        marketBox.strategy.name.toUpperCase() === market.strategy.name.toUpperCase() && 
        marketBox.market.toUpperCase() === market.market.toUpperCase()){
        return m;  
      } 
    }
    return -1;
  }

  addMarket(market){
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
    if(this.state.selectedMarkets.length == MAX_MARKETS){
      NotificationController.displayNotification(
        "ERROR",
        "Only " + MAX_MARKETS + " markets can be selected at a time",
        "error"
      );
      return;
    }
    if(!this.marketExistsInStack(market[0])){
      this.state.selectedMarkets.push({
        market: market[0],
        quote: this.state.selectedQuote,
        exchange: this.state.selectedExchange,
        strategy: this.state.selectedStrategy,
        interval: this.state.selectedInterval,
        index: this.state.currentTest
      });
      this.setState({
        selectedMarkets: this.state.selectedMarkets,
        currentTest: this.state.currentTest+1
      });
    }
  }

  removeMarket(market){
    this.state.selectedMarkets.splice(this.indexOfMarket(market),1);
    this.setState({
      selectedMarkets: this.state.selectedMarkets,
      currentTest: this.state.currentTest-1
    });
  }

  clearMarkets(){
    this.setState({
      selectedMarkets: []
    });
  }

  buildStrategiesDropdownList(){
    let strategies = [];
    for(let s=0;s<this.props.userStrategies.length;s++){
      const strategyName = this.props.userStrategies[s].name;
      strategies.push(strategyName);
    } 
    return strategies;
  }

  getMarketsFromQuote(){
    let markets = [];
    for(let m=0;m<this.props.markets.get(this.state.selectedExchange).length;m++){
      const quote = this.props.markets.get(this.state.selectedExchange)[m].quote;
      if(quote === this.state.selectedQuote){
        markets.push(this.props.markets.get(this.state.selectedExchange)[m]);
      }
    }
    return markets;
  }

  buildTableDataMarkets(){
    let markets = [];
    for(let m=0;m<this.props.markets.get(this.state.selectedExchange).length;m++){
      const base  = this.props.markets.get(this.state.selectedExchange)[m].base;
      const quote = this.props.markets.get(this.state.selectedExchange)[m].quote;
      const vol   = this.props.markets.get(this.state.selectedExchange)[m].volume;
      const market = base.toUpperCase() + "-" + quote.toUpperCase();
      if(quote === this.state.selectedQuote){

        let supportedTrading = Constraints.volumeIsGood(this.state.selectedExchange,quote,vol) ? 
                                <i className="text-primary fa fa-check"/> :
                                <i/>;

        let columnZero = <CryptoIcon coinName={base.toLowerCase()}/>

        let columnOne = market;
        let columnTwo = vol.toFixed(2);
        let columnThree = <span className="clickable" 
                              onClick={ () => this.addMarket([market]) }
                              style={ { marginLeft: "25px", color: "blue" } }>
                          ADD
                          <a style={ { marginLeft: "5px" } } className="fa fa-plus-circle"/>
                        </span>
        markets.push([supportedTrading,columnZero,columnOne,columnTwo,columnThree]);
      }
    }
    return markets;
  }


  getRandomBacktest(){

    const randomStrategyIndex  = Math.floor(Math.random() * this.props.userStrategies.length);
    const randomStrategy       = this.props.userStrategies[randomStrategyIndex];

    const randomExchangeIndex  = Math.floor(Math.random() * Constants.SUPPORTED_EXCHANGES.length);
    const randomExchange       = Constants.SUPPORTED_EXCHANGES[randomExchangeIndex];

    const randomQuote          = this.props.quotes.get(randomExchange)
                                  [Math.floor(Math.random() * 
                                  this.props.quotes.get(randomExchange).length)
                                  ];

    this.state.selectedExchange = randomExchange;
    this.state.selectedStrategy = randomStrategy;
    this.state.selectedQuote    = randomQuote;

    let marketPool        = this.getMarketsFromQuote();
    const randMarketIndex = Math.floor(Math.random() * marketPool.length);
    const randMarket      = marketPool[randMarketIndex];

    return {
      exchange: randomExchange,
      quote: randomQuote,
      market: randMarket.base + "-" + randMarket.quote,
      strategy: randomStrategy
    }
    
  }
  randomizeMarkets(){
    
    let selectedMarkets = [];

    for(let m=0;m<MAX_MARKETS;m++){
      
      const backtest = this.getRandomBacktest();
      selectedMarkets.push({
        market: backtest.market,
        exchange: backtest.exchange,
        strategy: backtest.strategy,
        interval: this.state.selectedInterval,
        quote: backtest.quote,
        index: m
      });

    }

    this.setState({
      selectedMarkets: selectedMarkets,
      currentTest: selectedMarkets.length
    });
  }

  getStartDate(){
    if(document.getElementById("startDate").value === ""){
      return "2000-01-01T00:00:00Z";
    }
    return document.getElementById("startDate").value + "T00:00:00Z";
  }

  getEndDate(){
    if(document.getElementById("endDate").value === ""){
      return new Date().toJSON().split("T")[0] + "T23:59:59Z";
    }
    return document.getElementById("endDate").value + "T23:59:59Z";
  }

  submitBacktest(){

    const initialInvestment = document.getElementById("initialInvestmentInput").value;

    if(this.state.selectedMarkets.length === 0){
      NotificationController.displayNotification(
        "ERROR",
        "No markets have been selected, please choose at most five markets",
        "error"
      );
      return;
    }
    if(isNaN(initialInvestment) || initialInvestment === "" || initialInvestment < 1){
      NotificationController.displayNotification(
        "ERROR",
        "Initial investment value provided is not a number, please input a number >= 1",
        "error"
      );
      return;
    }

    let backtests = [];
    for(let p=0;p<this.state.selectedMarkets.length;p++){
      const selectedMarket = this.state.selectedMarkets[p];

      if(!this.props.demo){
        backtests.push({
          "market": selectedMarket.market,
          "candleSize": selectedMarket.interval.toLowerCase(),
          "exchange": selectedMarket.exchange.toLowerCase(),
          "initialInvestment": document.getElementById("initialInvestmentInput").value,
          "strategyId": selectedMarket.strategy.id,
          "startDate": this.getStartDate(),
          "endDate": this.getEndDate(),
        });
      }
      else{
        backtests.push({
          "market": selectedMarket.market,
          "candleSize": selectedMarket.interval.toLowerCase(),
          "exchange": selectedMarket.exchange.toLowerCase(),
          "initialInvestment": document.getElementById("initialInvestmentInput").value,
          "strategy": selectedMarket.strategy,
          "startDate": this.getStartDate(),
          "endDate": this.getEndDate(),
        });
      }
    }

    const payload ={
      "backtests": backtests,
      "archive": !this.props.demo
    }

    this.props.submitCallback(payload);
  } 

  limitDescription(description){
    if(description === ""){
      return "No Description Provided"
    }
    const limit = description.match(/.{1,36}/g);
    return (
        limit.map((line) => 
        <div>
          { line }
        </div>
      )
    );
  }

  generateStrategyTooltips(){
    let tooltips = [];
    for(let s=0;s<this.props.userStrategies.length;s++){
      tooltips.push(this.limitDescription(this.props.userStrategies[s].description));
    }
    return tooltips;
  }

  render(){  

    const self = this;

    let lastTest = undefined;
    if(this.props.archivedTests.length != 0) {
      const numTests = this.props.archivedTests[0].parameters.backtests.length;
      lastTest = this.props.archivedTests[0].parameters.backtests[numTests-1];
    }

    return(
      <div class="tab-pane active show" 
           id="settings" 
           style={ TAB_MARGIN }>
      <br/>
      <div className="row">
        <div class="col-md-9"
            style={ STYLE }>
          <InitialInvestmentInput value={ lastTest ? lastTest.initialInvestment : "Insert Initial Investment..." }
                                  quote={ this.state.selectedQuote }/>
        </div>
        <div class="col-md-3"
            style={ STYLE }>
          <SubmitBacktestButton submit={ this.submitBacktest }/>
        </div>  
      </div>
      <div className="row border-2-bottom-secondary">
          <div className={ Constants.IS_MOBILE ? "col-md-2 margin-top-10" : "col-md-2" } style={ MARGIN_BOTTOM }>
            <DateInputField label="Start Date" id="startDate"/>
          </div>
          <div className="col-md-2" style={ MARGIN_BOTTOM }>
            <DateInputField label="End Date" id="endDate"/> 
          </div>
          <div className="col-md-2"
               style={ {marginTop: "20px", marginBottom: "10px"} } >
            <Dropdown id="intervalDropdown"
                    dropdownList={ Constants.SUPPORTED_INTERVALS }
                    header={ <IconHeader iconClass="fa fa-bar-chart" textClass="text-center" header="INTERVALS" /> }
                    onClickRow={ this.updateInterval }
                    buttonText={ this.state.selectedInterval }/>
          </div>
          <div className="col-md-2"
               style={ {marginTop: "20px",marginBottom:"20px"} }>
            <Dropdown id="strategyDropdown"
                      tooltips={ 
                        this.generateStrategyTooltips()
                      }
                      tooltipAnchor={ "left" }
                      dropdownList={ this.buildStrategiesDropdownList() }
                      header={ <IconHeader textClass="text-center" iconClass="fa fa-fw fa-sliders" header="STRATEGIES" /> }
                      actions={ !this.props.demo ? [ 
                        <span onClick={ () => self.props.selectService("Strategies") }>
                          <IconHeader textClass="text-left text-primary"
                                      iconClass="fa fa-plus"
                                      anchor="left"
                                      header="ADD STRATEGY"/>
                        </span>
                      ] : undefined}
                      onClickRow={ this.updateStrategy }
                      mappedData={ this.props.userStrategies }
                      buttonText={ this.state.selectedStrategy ? 
                                  this.state.selectedStrategy.name.toUpperCase() : 
                                  "NONE" }/>
          </div>
          <div className="col-md-2"></div>
          <div className={ Constants.IS_MOBILE ?  "col-md-2" : "col-md-2 text-right"  }>
          <button className={ Constants.IS_MOBILE ?  "btn btn-secondary btn-sm" : "float-right btn btn-secondary btn-sm" }
                  onClick={ this.clearMarkets }
                  type="button" 
                  style={ Constants.IS_MOBILE ? {} : FLOAT_RIGHT }>
                    RESET
                  <i class="fa fa-fw fa-refresh" 
                     style={ PADDING_LEFT } />  
            </button>
            <button class={ Constants.IS_MOBILE ? "btn btn-link" : "float-right btn btn-link" } 
                    style={ Constants.IS_MOBILE ? {} : { marginTop: "30px" } }>
              <img src={require("../../img/dice-png-30.png")} 
                   width="32" 
                   height="32"
                   onClick={ this.randomizeMarkets }/>
				    </button>
          </div> 
        </div>
        <br/><br/>
        <div className="row text-center">
          { Constants.IS_MOBILE &&
              <MarketStack data={ this.state.selectedMarkets }
                          removeMarket={ this.removeMarket } />
          }
          { Constants.IS_MOBILE && <br/> }
          <div className="col-md-9 border-2-secondary" style={ MARKETS_STYLE }>
            <div className="row">
            <div className="col-md-6">
            <MarketPanelHeader exchange={ this.state.selectedExchange }
                               quote={ this.state.selectedQuote }/>
            </div>
            <div className="col-md-3 text-right" style={ MARGIN_TOP }>
              <Dropdown id="exchangeDropdown"
                        dropdownList={ Constants.SUPPORTED_EXCHANGES }
                        header={ <IconHeader iconClass="fa fa-university"  textClass="text-center"  header="EXCHANGES" /> }
                        onClickRow={ this.updateExchange }
                        buttonText={ this.state.selectedExchange.toUpperCase( ) }/>
              </div>
              <div className="col-md-3 text-right" style={ MARGIN_TOP }>
              <Dropdown id="quoteDropdown" 
                        style={ MARGIN_TOP }
                        dropdownList={ this.props.quotes.get(this.state.selectedExchange) }
                        header={ <IconHeader iconClass="fa fa-exchange"  textClass="text-center"  header="QUOTES" /> }
                        onClickRow={ this.updateQuote }
                        buttonText={ this.state.selectedQuote }/>
              </div>
            
            </div>
            <br/>
            <FilterTable header={ [   <span>
                                              <a className="text-secondary fa fa-info-circle"
                                                data-tip data-for="confirmed-tooltip"> 
                                              </a>
                                                <ReactTooltip id="confirmed-tooltip" 
                                                              type="info" 
                                                              place="right" 
                                                              effect="solid"
                                                              className="react-tooltip-fixed">
                                                <span>
                                                  <p className="text-left"> 
                                                    Any markets with a blue check mark are Travas Confirmed.  This means that they meet 
                                                    the minimum 30-day average volume requirements for live trading.  Such requirements 
                                                    only apply when running funded trading bots.
                                                  </p>
                                                </span>
                                              </ReactTooltip>
                                    </span>,
                                    "SYM",
                                   "MARKET",  
                                   <IconHeader iconClass="fa fa-sort"  textClass="text-center"  anchor="right" header="30D AVG VOL" />, 
                                   "ADD TEST"
                                ]} 
                         sortable={
                          [
                            false,
                            false,
                            false,
                            true,
                            false
                          ]
                         }
                         data={ this.buildTableDataMarkets() }
                         searchText="Search Markets..."
                         onClick={ this.addMarket }
                         height={ TABLE_HEIGHT }
                         disableClick={ true }/>
          </div>
          { !Constants.IS_MOBILE &&
            <div className="col-md-3 text-center">
              <MarketStack data={ this.state.selectedMarkets }
                          removeMarket={ this.removeMarket } />
            </div>
          }
        </div>
        <br/><br/><br/>
    </div>
    );
  }
}