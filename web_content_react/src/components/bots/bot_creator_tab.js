import React from "react";
import Constants from "../../js/Constants";
import Constraints from "../../js/Constraints";
import Dropdown from "../generic/dropdown";
import FilterTable from "../generic/filter_table";
import CryptoIcon from "../generic/crypto_coin";
import IconHeader from "../generic/icon_header";
import SimpleToggle from "../generic/simple_toggle"
import Loader from "../generic/loader"
import ParameterInputSpinner from "../generic/parameter_input_spinner"
import ApiController from "../../js/ApiController"
import NotificationController from "../../js/NotificationController"
import ReactTooltip from "react-tooltip"
import Switch from "react-switch";
import ModalController from "../../js/ModalController";
import QuoteCurrencies from "../../js/QuoteCurrencies";

const STYLE = {
  marginTop: "10px"
}

const TAB_MARGIN = {
  marginTop: "5px",
  marginLeft: "20px",
  marginRight: "20px"
}

const FLOAT_RIGHT = {
  right: "15px"
}

const MARGIN_TOP = {
  marginTop: "25px"
}

const PADDING_LEFT = {
  left: "15px"
}

const PADDING = {
  marginLeft: "10px"
}


const TABLE_HEIGHT = {
  maxHeight: "900px",
}

const MARKETS_STYLE = {
  backgroundColor: "#f7f7f7"
}

const STYLE_INPUT = {
  marginTop: "10px",
  width: "100%",
}

const HEIGHT = {
  height: "64px",
  fontSize: "32px"
}

const SUBMIT_STYLE = {
  width: "100%",
  height: "64px",
  marginTop: "10px",
  right: "40px"
}

export default class BotCreatorTab extends React.Component {

  constructor(props){
   
    super(props);

    this.state={
      selectedInterval: "1H",
      selectedQuote: this.props.quotes.get(Constants.SUPPORTED_EXCHANGES[0])[0],
      selectedStrategy: this.props.userStrategies[0],
      selectedExchange: Constants.SUPPORTED_EXCHANGES[0],
      selectedMarket: this.props.markets.get(Constants.SUPPORTED_EXCHANGES[0])[0].base.toUpperCase() + "-" +
                      this.props.markets.get(Constants.SUPPORTED_EXCHANGES[0])[0].quote.toUpperCase(),
      selectedMarketVolume: this.props.markets.get(Constants.SUPPORTED_EXCHANGES[0])[0].volume,
      private: false,
      autoStart: false,
      nonSimulated: false,
      tradingLimitType: "PERCENT",
      building: false,
      botName: undefined,
      selectedTemplate: "NO TEMPLATES",
      loadingTemplate: false,
      showConfiguration: true,
      flagVolume: false
    }

   this.updateInterval = this.updateInterval.bind(this);
   this.updateStrategy = this.updateStrategy.bind(this);
   this.updateExchange = this.updateExchange.bind(this);
   this.updateQuote    = this.updateQuote.bind(this);
   this.updateMarket   = this.updateMarket.bind(this);
   this.toggleAutoStart = this.toggleAutoStart.bind(this);
   this.toggleNonSimulated = this.toggleNonSimulated.bind(this);
   this.togglePrivate      = this.togglePrivate.bind(this);
   this.getRandomBot      = this.getRandomBot.bind(this);
   this.saveBot           = this.saveBot.bind(this);
   this.onSaveBotSuccess  = this.onSaveBotSuccess.bind(this);
   this.onStartBotSuccess = this.onStartBotSuccess.bind(this);
   this.strategyExists = this.strategyExists.bind(this);
   this.signalEqual = this.signalEqual.bind(this);
   this.loadTemplate = this.loadTemplate.bind(this);
   this.loadTemplateSuccess = this.loadTemplateSuccess.bind(this);
   
  }

  maxMarkets = new Map();

  toggleTradingLimitType = (type) => {
    this.setState({
      tradingLimitType: type
    });
  }

  togglePrivate(){
    this.setState({
      private: !this.state.private
    });
  }

  toggleNonSimulated(){

    //Exchange is not supported
    if(!this.state.nonSimulated && 
       !Constraints.supportedTrading.includes(this.state.selectedExchange.toLowerCase())){
        this.setState({
          selectedExchange: Constraints.supportedTrading[0],
          nonSimulated: !this.state.nonSimulated
        });
        return;
    }

    //Update market to max market, 
    //if current market has bad volume
    if( !this.state.nonSimulated && 
        !Constraints.volumeIsGood(this.state.selectedExchange,this.state.selectedQuote,this.state.selectedMarketVolume)){
        this.maxMarkets.get(this.state.selectedExchange)();
    }

    //Update toggle
    this.setState({
      nonSimulated: !this.state.nonSimulated
    });

  }

  toggleAutoStart(){
    this.setState({
      autoStart: !this.state.autoStart
    });
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
      selectedQuote: this.props.quotes.get(exchange)[0],
      selectedMarket: this.props.markets.get(exchange)[0].base.toUpperCase() + "-" +
                      this.props.markets.get(exchange)[0].quote.toUpperCase()
    });
  }

  updateQuote(quote){
    this.setState({
      selectedQuote: quote,
    });
  }

  updateMarket(market,minVolume,volume){
    this.setState({
      selectedMarket: market,
      selectedMarketVolume: volume,
      flagVolume: minVolume > volume
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

  loadTemplateSuccess(template){
    this.setState({
      loadingTemplate: false,
      selectedInterval: template.interval.toUpperCase(),
      selectedQuote: template.quote.toUpperCase(),
      selectedStrategy: this.strategyExists(template.strategy),
      selectedExchange: template.exchange,
      selectedMarket: template.base.toUpperCase() + "-" + template.quote.toUpperCase()
    });
  }

  loadTemplate(template){
    const self = this;
    if(!this.strategyExists(template.strategy)){
      const payload = {
        buySignals: template.strategy.buySignals,
        sellSignals: template.strategy.sellSignals,
        stopLoss: template.strategy.stopLoss,
        strategyName: template.strategy.name,
        description: template.strategy.description,
        targets: template.strategy.targets
      }
      ApiController.doPostWithToken(
        "save_strategy",
        payload,
        function(response,strategy){
          strategy.id = response.id;
          NotificationController.displayNotification(
            "ADDED STRATEGY",
            "Strategy: " + strategy.name + 
            " was not present and has been automatically added to your current set of strategies",
            "info"
          );
          self.props.addStrategy(strategy);
          self.loadTemplateSuccess(template);
        },
        template.strategy
      );
      this.setState({
        loadingTemplate: true
      });
    }
    else{
      this.loadTemplateSuccess(template);
    }
  }

  strategyExists(strategy){
    for(let s=0;s<this.props.userStrategies.length;s++){
      const rhsStrategy = this.props.userStrategies[s];
      if(rhsStrategy.buySignals.length != strategy.buySignals.length ||
         rhsStrategy.sellSignals.length != strategy.sellSignals.length ||
         strategy.name != rhsStrategy.name ){
           continue;
      }
      for(let buy=0;buy<strategy.buySignals.length;buy++){
        if(!this.signalEqual(strategy.buySignals[buy],rhsStrategy.buySignals[buy])){
          continue;
        }
      }
      for(let sell=0;sell<strategy.buySignals.length;sell++){
        if(!this.signalEqual(strategy.sellSignals[sell],rhsStrategy.sellSignals[sell])){
          continue;
        }
      }
      return rhsStrategy;
    }
    return false;
  }

  signalEqual(signalLeft,signalRight){
    for(let key in signalLeft){
      if(signalLeft[key] != signalRight[key]){
        return false;
      }
    }
    return true;
  }

  buildTableDataMarkets(){
    let markets = [];
    let maxVolume = 0;
    for(let m=0;m<this.props.markets.get(this.state.selectedExchange).length;m++){
      const base  = this.props.markets.get(this.state.selectedExchange)[m].base;
      const quote = this.props.markets.get(this.state.selectedExchange)[m].quote;
      const market = base.toUpperCase() + "-" + quote.toUpperCase();
      const volume = this.props.markets.get(this.state.selectedExchange)[m].volume;
      const minVolume = Constraints[this.state.selectedExchange] ? Constraints[this.state.selectedExchange][quote] : 0;
      if(quote === this.state.selectedQuote && this.volumeIsGood(this.state.selectedExchange,quote,volume)){
        let columnZero = <CryptoIcon coinName={ base.toLowerCase() }/>
        let columnOne = market;
        let columnTwo = volume;
        let columnThree = <span className="clickable" 
                              style={ { color: "blue" } } 
                              onClick={ () => this.updateMarket(market,minVolume,volume) }>
                          ADD
                          <a style={ { marginLeft: "5px" } } className="fa fa-plus-circle"/>
                        </span>
        markets.push([columnZero, columnOne,columnTwo,columnThree]);
      }
      if(volume > maxVolume){
        maxVolume = volume;
        this.maxMarkets.set(this.state.selectedExchange,() => this.updateMarket(market,minVolume,volume));
      }
    }
    return markets;
  }

  volumeIsGood(exchange, quote, volume){
    if(!this.state.nonSimulated){
      return true;
    }
    const minVolume = Constraints[exchange] ? Constraints[exchange][quote] : 0;
    return volume >= minVolume;
  }


  getRandomBot(){

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

    const randomIntervalIndex  = Math.floor(Math.random() * Constants.SUPPORTED_INTERVALS.length);
    const randomInterval       = Constants.SUPPORTED_INTERVALS[randomIntervalIndex];

    this.setState({
      selectedExchange: randomExchange,
      selectedQuote: randomQuote,
      selectedMarket: randMarket.base + "-" + randMarket.quote,
      selectedStrategy: randomStrategy,
      selectedInterval: randomInterval
    });
    
  }

  async onStartBotSuccess(response,userBot){

    this.state.building = false;
    
    NotificationController.displayNotification(
      "BOT STARTED",
      userBot.name + " is now available in your bot manager and is has began trading.",
      "info"
    );

    this.setState({
      building: false
    });
      
    this.props.appendBot(userBot);
  }

  async onSaveBotSuccess(response,request){
    
    const userBot = {
      avgRoi: 0,
      exchange: request.exchange,
      id: response.id,
      interval: request.interval,
      isSimulated: request.isSimulated,
      market: request.baseCurrency + "-" + request.counterCurrency,
      name: request.botName,
      numTrades: 0,
      rank: 0,
      roi: 0,
      avgRoi: 0,
      running: this.state.autoStart,
      strategyId: request.strategyId,
      public: !this.state.private,
      strategy: this.props.getStrategyWithId(request.strategyId),
      totalLosses: 0,
      totalWins: 0,
      tradingLimit: request.tradingLimit,
      winLoss: 0
    }

    const self = this;

    if(this.state.autoStart){
      ApiController.doPostWithToken("start_stop_bot",{
        "botId": response.id,
        "command": "start" 
        },
        this.onStartBotSuccess,
        userBot,
        () => function(response,botName){
          self.setState({
            building: false
          });
        },
        response.botName
      );
    }
    
    NotificationController.displayNotification(
      "BOT CREATED",
      request.botName + " is now available in your bot manager.",
      "info"
    );

    this.setState({
      building: false
    });
      
    this.props.appendBot(userBot);
  }
  
  saveBot(){

    //Check live trading constraints
    if(this.state.nonSimulated){

      //Check if user has consented to terms
      if(!this.props.userInfo.betaConsent){
        ModalController.showModal("betaConsentModal", { accepted: false });
        return;
      }

      //Check volume is good, if not send error message
      if(!Constraints.volumeIsGood(this.state.selectedExchange,this.state.selectedQuote,this.state.selectedMarketVolume)){
        NotificationController.displayNotification(
          "INVALID MARKET",
          "The market you selected is currently not supported for live trading.  This is either due to poor market liquidity or an unsupported exchange.",
          "error"
        )
      }


      let hasKey = false;

      //Iterate and check for key
      for(let k=0;k<this.props.linkedExchanges.length;k++){
        const exchange = this.props.linkedExchanges[k].name.toLowerCase();
        if(exchange === this.state.selectedExchange.toLowerCase()){
          hasKey = true;
          break;
        }
      }

      //Check that exchange key is present
      if(!hasKey){
        
        //Present error message
        NotificationController.displayNotification(
          "NO API KEY",
          "You currently have no API key linked to exchange: " + this.state.selectedExchange + ".  Please " + 
          "go to the accounts tab to add one",
          "error"
        );
  
        return;
      }
    }

    if(this.props.userStrategies.length === 0){
      NotificationController.displayNotification(
        "NO STRATEGIES",
        <span> 
          You have yet to create any strategies, please navigate to the 
            <a href="strategies"> 
              { " Strategy Manager " }
            </a>
          to create a strategy before building a bot
        </span>,
        "error"
      );
      return;
    }
    const payload={
      "strategyId": this.state.selectedStrategy.id,
      "botName": document.getElementById("botNameInput").value,
      "private": this.state.private,
      "tradingLimit": this.state.nonSimulated ? (this.state.tradingLimitType === "PERCENT" ? 
                                                      (Number(document.getElementById("TRADING LIMIT-input").value)/100) :
                                                      Number(document.getElementById("TRADING LIMIT-input").value) ) :
                                                      .98,
      "exchange": this.state.selectedExchange.toLowerCase(),
      "baseCurrency": this.state.selectedMarket.split("-")[0].toLowerCase(),
      "counterCurrency": this.state.selectedMarket.split("-")[1].toLowerCase(),
      "interval": this.state.selectedInterval.toLowerCase(),
      "isSimulated": !this.state.nonSimulated,
      "tradingLimitType": this.state.tradingLimitType
    }

    if(document.getElementById("botNameInput").value === ""){
      NotificationController.displayNotification(
        "ERROR",
        "Bot name cannot be empty",
        "error"
      );
      return;
    }


    const self = this;
    
    ApiController.doPostWithToken(
      "save_bot",
      payload,
      this.onSaveBotSuccess,
      payload,
      () => {
        self.setState({
          building: false
        });
      }
    );
    this.setState({
      building: true,
      botName: payload.botName
    });
  } 

  buildBufferedBotsList(){
    let bots = [];
    for(let b=0; b < this.props.botTemplates.length;b++){
      bots.push(this.props.botTemplates[b].name);
    }
    return bots;
  }

  limitDescription(description){
    if(description === ""){
      return "No Description Provided"
    }
    const limit = description.match(/.{1,30}/g);
    return (
        limit.map((line) => 
        <div>
          { line }
        </div>
      )
    );
  }

  generateTemplateTooltips(){
    return (this.props.botTemplates.map((bot) =>  
        <div>
          { "EXCHANGE: " + bot.exchange.toUpperCase() } <br/>
          { "MARKET: " + bot.base.toUpperCase() + "-" + bot.quote.toUpperCase() } <br/>
          { "INTERVAL: " + bot.interval.toUpperCase() } <br/>
          { bot.strategy.description != "" ? 
          this.limitDescription(bot.strategy.description) :
          "No description provided" }
        </div>
    ));
  }

  componentDidMount(){
    const self = this;
    ApiController.doPostWithToken("get_buffered_bots",{},function(response){
      self.setState({
        bufferedBots: response.bufferedBots,
        selectedTemplate:  response.bufferedBots.length != 0 ? 
                           response.bufferedBots[0].name : 
                           "NO TEMPLATES"
      });
    });
  }

  render(){  

    const self = this;
    const quoteObject = QuoteCurrencies[this.state.selectedQuote.toUpperCase()];

    return(
      <div class="tab-pane active show" 
           id="settings" 
           style={ TAB_MARGIN }>
      <div className="row margin-top-10 text-center">

        <div className="float-right" style={{right:"40px",marginBottom:"25px"}}>
          <Dropdown id="exchangeDropdown"
                    tooltips={ 
                      this.generateTemplateTooltips()
                    }
                    tooltipAnchor={ "left" }
                    dropdownList={ this.buildBufferedBotsList() }
                    mappedData={ this.props.botTemplates }
                    header={ <IconHeader iconClass="fa fa-male" textClass="text-center" header="TEMPLATES" /> }
                    onClickRow={ this.loadTemplate }
                    buttonText={ this.state.selectedTemplate.toUpperCase( ) }
                    flippedHalf={ true }/>
        </div>
      </div>
      <br/>
      { !this.state.loadingTemplate && <div>
        { this.state.nonSimulated && 
        <div className="row">
          <div className="col-md-3 border-right">
            { <span>
                <h3>
                  Funding Mode 
                </h3> 
                  <SimpleToggle active={ this.state.tradingLimitType === "FLAT" }
                                label="Flat Capital Amount"
                                onChange={ () => this.toggleTradingLimitType("FLAT") }/> 
                  <SimpleToggle active={ this.state.tradingLimitType === "PERCENT" }
                                label="Percentage of Quote"
                                onChange={ () => this.toggleTradingLimitType("PERCENT") }/> 
              </span>
            }
          </div>
           <div className="col-md-9">
              { this.state.tradingLimitType === "PERCENT" && 
                <ParameterInputSpinner  key={ "TRADING LIMIT" }
                                        max={ Constants.INDICATOR_METADATA["TRADING LIMIT"].max }
                                        step={ Constants.INDICATOR_METADATA["TRADING LIMIT"].step }                                    
                                        inputId={ "TRADING LIMIT" + "-input" } 
                                        parameter={ "TRADING LIMIT" }
                                        defaultValue={ Constants.INDICATOR_METADATA["TRADING LIMIT"].defaultValue } 
                                        min={ Constants.INDICATOR_METADATA["TRADING LIMIT"].min }
                                        signalId={ "TRADING LIMIT" }
                                        precision={ Constants.INDICATOR_METADATA["TRADING LIMIT"].precision }/> 
              }
              { this.state.tradingLimitType === "FLAT" && quoteObject &&
                <ParameterInputSpinner  key={ "TRADING LIMIT" }
                                        max={ quoteObject.max }
                                        step={ quoteObject.step }                                    
                                        inputId={ "TRADING LIMIT" + "-input" } 
                                        parameter={ "TRADING LIMIT" }
                                        defaultValue={ quoteObject.defaultValue } 
                                        min={ quoteObject.min }
                                        signalId={ "TRADING LIMIT" }
                                        precision={ quoteObject.precision }/> 
              }
            </div>
        </div>
        }
      <div className="row">
        <div class="col-md-9"
            style={ STYLE }>
          <div class="input-group input-group-md mb-3"
               style={ STYLE_INPUT }>
            <input  type="text" 
                    id="botNameInput" 
                    name="investment" 
                    className="form-control text-secondary font-weight-bold" 
                    placeholder={ !this.state.nonSimulated ? "Insert Simulated Bot Name..." : "Insert Live Bot Name..." }
                    style={ HEIGHT }/>
          </div>
        </div>
        <div class="col-md-3"
            style={ STYLE }>
            <button className="btn btn-large btn-secondary" 
                    style={ SUBMIT_STYLE }
                    onClick={ this.saveBot }>
                    <i><strong>
                    <h5 style={{marginTop:"10px"}}>
                      <span className="text-white">BUILD BOT
                        { !this.state.building && 
                          <i className="fa fa-magic" style={ PADDING }/> 
                        }
                        { this.state.building && 
                          <i className="fa fa-spin fa-spinner" style={ PADDING }/> 
                        }
                      </span>
                    </h5></strong>
                    </i>
            </button>
        </div>  
      </div>
        <div className="row border-2-bottom-secondary">
          <div class="col-md-2 margin-bottom-5">
            { <SimpleToggle active={ this.state.nonSimulated }
                               label="Non-Simulated"
                               onChange={ this.toggleNonSimulated }/> }
            <SimpleToggle active={ this.state.private }
                          label="Private"
                          onChange={ this.togglePrivate }/>
            <SimpleToggle active={ this.state.autoStart }
                          label="Auto Start"
                          onChange={ this.toggleAutoStart }/>              
          </div>
          <div className="col-md-2" style={ {marginTop: "20px",marginBottom:"20px"} }>
              <Dropdown id="exchangeDropdown"
                        dropdownList={ self.state.nonSimulated ?
                          Constraints.supportedTrading :
                          Constants.SUPPORTED_EXCHANGES 
                        }
                        header={ <IconHeader textClass="text-center" iconClass="fa fa-university" header="EXCHANGES" /> }
                        onClickRow={ this.updateExchange }
                        buttonText={ this.state.selectedExchange.toUpperCase( ) }/>
          </div>
          <div className="col-md-2" style={ {marginTop: "20px",marginBottom:"20px"} }>
            <Dropdown id="quoteDropdown" 
                      style={ MARGIN_TOP }
                      dropdownList={ this.props.quotes.get(this.state.selectedExchange) }
                      header={ <IconHeader textClass="text-center"  iconClass="fa fa-exchange" header="QUOTES" /> }
                      onClickRow={ this.updateQuote }
                      buttonText={ this.state.selectedQuote }/>
          </div>
          <div className="col-md-2"
               style={ {marginTop: "20px", marginBottom: "10px"} } >
            <Dropdown id="intervalDropdown"
                    dropdownList={ Constants.SUPPORTED_INTERVALS }
                    header={ <IconHeader textClass="text-center"  iconClass="fa fa-bar-chart" header="INTERVALS" /> }
                    onClickRow={ this.updateInterval }
                    buttonText={ this.state.selectedInterval }/>
          </div>
          <div className="col-md-2"
               style={ {marginTop: "20px",marginBottom:"20px"} }>
            <Dropdown id="strategyDropdown"
                    dropdownList={ this.buildStrategiesDropdownList() }
                    header={ <IconHeader textClass="text-center"  iconClass="fa fa-fw fa-sliders" header="STRATEGIES" /> }
                    onClickRow={ this.updateStrategy }
                    mappedData={ this.props.userStrategies }
                    actions={[ 
                    <span onClick={ () => self.props.selectService("Strategies") }>
                      <IconHeader textClass="text-left text-primary"
                                  iconClass="fa fa-plus"
                                  anchor="left"
                                  header="ADD STRATEGY"/>
                    </span>
                    ]}
                    buttonText={ 
                      this.state.selectedStrategy ? 
                        this.state.selectedStrategy.name.toUpperCase() :
                        "STRATEGIES"
                    }/>
          </div>
          { /**!this.state.nonSimulated && <div className="col-md-2 text-right" style={ {marginTop:"20px"} }>
            <button class="float-right btn btn-link" style={ FLOAT_RIGHT }>
              <img src={require("../../img/dice-png-30.png")} 
                   width="32" 
                   height="32"
                   onClick={ this.getRandomBot }/>
				    </button>
          </div>**/ 
          }
        </div>
        <br/>
        <div className="row text-center">
          <div className="col-md-12">
              { this.state.nonSimulated && <h5 className="text-black text-center"> 
                You a currently building a <span className="text-primary"> live trading bot 
                <span>
                  <a className="fa fa-info-circle text-primary margin-left-5"
                    data-tip data-for="tooltip-live-trading"> 
                  </a>
                    <ReactTooltip id="tooltip-live-trading" 
                                  type="info" 
                                  place="bottom" 
                                  effect="solid"
                                  className="react-tooltip-fixed">
                    <span className="text-white text-left"> 
                      <p className="text-left">
                      Live trading bots trade with real capital present on a supported exchange.  Currently,
                      live trading is enable for the Binance exchange.  Live trading bots also have minimum quote volume 
                      constraints such as:
                      <br/><br/>
                        <ul>
                          <li> USDT: { Constraints["binance"]["USDT"] }</li>
                          <li> BTC: { Constraints["binance"]["BTC"] }</li>
                          <li> ETH: { Constraints["binance"]["ETH"] }</li>
                          <li> BNB: { Constraints["binance"]["BNB"] }</li>
                        </ul>
                    </p>
                    </span>
                  </ReactTooltip>
                </span>
              </span>
              </h5>}
              { !this.state.nonSimulated && <h5 className="text-black text-center"> 
                You a currently building a <span className="text-secondary"> simulated trading bot 
                <span>
                  <a className="fa fa-info-circle text-secondary margin-left-5"
                    data-tip data-for="tooltip-sim-trading"> 
                  </a>
                    <ReactTooltip id="tooltip-sim-trading" 
                                  type="info" 
                                  place="bottom" 
                                  effect="solid"
                                  className="react-tooltip-fixed">
                    <span className="text-white text-left"> 
                    <p className="text-left">
                      Simulated trading bots are used for forward testing purposes.  Currently, simulated bots may be
                      ran on any tradeable market and on all supported exchanges.
                    </p>
                    </span>
                  </ReactTooltip>
                </span>
                </span>
              </h5>}
          </div>
        </div>
        <br/>
        <div className="row">
          <div className="col-md-12 text-center">
            <p className="clickable" onClick={ () => { 
                self.setState({
                  showConfiguration: !self.state.showConfiguration
                });
              } }> Current Configuration { this.state.showConfiguration ? 
              <i className="fa fa-caret-down"/> : 
              <i className="fa fa-caret-up"/> } { !this.state.showConfiguration && 
                <span className="margin-left-5">{" " + this.state.selectedExchange.toUpperCase() + " | " + 
                this.state.selectedMarket + " | " + 
                this.state.selectedInterval + " | " + 
                (this.state.selectedStrategy ? 
                  this.state.selectedStrategy.name :
                  "NO STRATEGIES")}
                </span>
              }
            </p>
          </div>
        </div>
        <br/>
        { this.state.flagVolume &&
          <div className="row text-center danger-banner">
             <div className="col-md-1 margins-5">
                <h1 className="text-danger"><i className="fa fa-exclamation"/> </h1>
             </div>
            <div className="col-md-10 margins-5">
              <h5 className="text-danger text-center"> 
                  The market you have selected has low volume 
                  and may suffer from high slippage.  <br/>
                  This could result in skewed trading metrics while forward testing. 
              </h5>
            </div>
          </div>
        }
        { this.state.showConfiguration && 
        <div className={ !this.state.nonSimulated ? 
                          "row theme-banner-one bot-factory-info margin-top-5" : 
                          "row theme-banner-one bot-factory-info-live margin-top-5" 
                        }
             style={ this.state.nonSimulated ? { marginTop:"25px"} : {} }>
            <div className={ !this.state.nonSimulated ? "col-md-3 text-center bot-factory-info-box" : "col-md-3 text-center bot-factory-info-box-live" }>
              <span>EXCHANGE</span> <br/> <span>{ this.state.selectedExchange.toUpperCase() }
            </span></div>
                  <div className={ !this.state.nonSimulated ? "col-md-3 text-center bot-factory-info-box" : "col-md-3 text-center bot-factory-info-box-live" }>
                  <span>MARKET</span> <br/> <span>
                    { this.state.selectedMarket }
                  </span></div>
                  <div className={ !this.state.nonSimulated ? "col-md-3 text-center bot-factory-info-box" : "col-md-3 text-center bot-factory-info-box-live" }>
                  <span>INTERVAL</span> <br/> <span>{ this.state.selectedInterval }</span></div>
            <div className="col-md-3 text-center margin-top-10 margin-bottom-10"><span>STRATEGY</span> <br/> <span>{ (this.state.selectedStrategy ? 
              this.state.selectedStrategy.name :
              "NO STRATEGIES") }</span></div>
        </div> }
        <br/>
        <FilterTable header={[
                        "",
                        "MARKET",
                        <IconHeader header="30D AVG VOL" iconClass="fa fa-sort" anchor="right" textClass="text-left clickable"/>,
                        "SELECT"
                     ]}
                     sortable={[
                       false,
                       false,
                       true,
                       false
                     ]}
                     align="left"
                     data={ this.buildTableDataMarkets() }
                     searchText={ "Search " + 
                                  this.state.selectedExchange.toUpperCase() + "/" +
                                  this.state.selectedQuote.toUpperCase() +
                                  " Markets..." }
                     height={ TABLE_HEIGHT }
                     disableClick={ true }/>
        <br/><br/><br/>
    </div> }
    { this.state.loadingTemplate && 
      <Loader loadingMessage="Baking template..."/>
    }
    </div>
    
    );
  }
}