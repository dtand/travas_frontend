import React from "react"
import SignalCreator from "./signal_creator"
import FilterTable from "../generic/filter_table"
import ApiController from "../../js/ApiController"
import Dropdown from "../generic/dropdown"
import IconHeader from "../generic/icon_header"
import ReactTooltip from "react-tooltip"
import ModalController from "../../js/ModalController"
import Constants from "../../js/Constants"
import NotificationController from "../../js/NotificationController"
import QuicktestChart from "./quicktest_chart";
import QuickTestHeader from "./quicktest_header";
import Loader from "../generic/loader";
import AnchorLink from 'react-anchor-link-smooth-scroll'
import ParameterInputSpinner from "../generic/parameter_input_spinner"
import ParameterInputSlider from "../generic/parameter_input_slider"

const MARGIN_LEFT={
  marginLeft: "5px"
}

const TAB_MARGIN = {
  marginTop: "5px",
  marginLeft: "15px",
  marginRight: "15px"
}

const DEMO_LIMITS = 20;

export default class StrategiesManagerTab extends React.Component {

  constructor(props){
    super(props);
    this.state={
      sellSignals: undefined,
      buySignals: undefined,
      selectedStrategy: undefined,
      selectedBuySignal: "SMA Upwards Cross",
      selectedSellSignal: "SMA Downwards Cross",
      showModal: false,
      modal: "",
      strategyToDelete: "",
      currentTab: 0,
      strategyToShare: undefined,
      quicktest: {
        interval: "1h",
        stopLoss: "5%"
      },
      stopLossType: 0,
      loadingQuicktest: false,
      quicktestParams: undefined,
      backtestResults: false,
      showChart: false,
      parameters: [],
      toggledBuyClasses: Constants.SIGNAL_CLASSES.slice(0),
      toggledSellClasses: Constants.SIGNAL_CLASSES.slice(0),
      toggledBuySignals: ['buy','sell','neutral'],
      toggledSellSignals: ['buy','sell','neutral']
    }

    this.strategyDescription = "";

    this.historicalParameterValues = {
      buy: new Map(),
      sell: new Map()
    }

    this.selectStrategy         = this.selectStrategy.bind(this);
    this.onSelectSignalBuy      = this.onSelectSignalBuy.bind(this);
    this.onSelectSignalSell     = this.onSelectSignalSell.bind(this);
    this.randomizeStrategy      = this.randomizeStrategy.bind(this);
    this.getRandomStrategy      = this.getRandomStrategy.bind(this);
    this.onSaveStrategy         = this.onSaveStrategy.bind(this);
    this.updateTab              = this.updateTab.bind(this);
    this.onShareStrategy = this.onShareStrategy.bind(this);
    this.onShareStrategySuccess = this.onShareStrategySuccess.bind(this);
    this.onSaveStrategySubmit = this.onSaveStrategySubmit.bind(this);
    this.saveStrategySuccess = this.saveStrategySuccess.bind(this);
    this.doBacktest = this.doBacktest.bind(this);
    this.buildBuyAndSellSignals = this.buildBuyAndSellSignals.bind(this);
    this.updateQuicktest = this.updateQuicktest.bind(this);
    this.appendParameter = this.appendParameter.bind(this);
    this.toggleBuyClass = this.toggleBuyClass.bind(this);
    this.toggleSellClass = this.toggleSellClass.bind(this);
    this.toggleBuySignals = this.toggleBuySignals.bind(this);
    this.toggleSellSignals = this.toggleSellSignals.bind(this);

  }

  getStopLossObject(){
    if(!document.getElementById("STOP LOSS %-input")){
      return  { 
        "type": "standard", 
        "stopLossPercent": 0.1
      };
    }
    else if(this.state.stopLossType === 0){
      return { 
        "type": "standard", 
        "stopLossPercent": 
          Constants.INDICATOR_METADATA["STOP LOSS %"].convertBack(parseFloat(document.getElementById("STOP LOSS %-input").value))
      };
    }
    else if(this.state.stopLossType === 1){
      return { 
        "type": "priceTrailing", 
        "stopLossPercent": Constants.INDICATOR_METADATA["STOP LOSS %"].convertBack(parseFloat(document.getElementById("STOP LOSS %-input").value))
      }
    }
    else if(this.state.stopLossType === 2){
      if(!document.getElementById("STOP TARGET %-input")){
        return { 
          "type": "targetTrailing", 
          "stopLossPercent": Constants.INDICATOR_METADATA["STOP LOSS %"].convertBack(parseFloat(document.getElementById("STOP LOSS %-input").value)),
          "targetPercent": 0.1
        }
      }
      return { 
        "type": "targetTrailing", 
        "stopLossPercent": Constants.INDICATOR_METADATA["STOP LOSS %"].convertBack(parseFloat(document.getElementById("STOP LOSS %-input").value)),
        "targetPercent": Constants.INDICATOR_METADATA["STOP TARGET %"].convertBack(parseFloat(document.getElementById("STOP TARGET %-input").value))
      }
    }
  }

  appendParameter(parameter){
    let parameters = this.state.parameters;
    parameters.push(parameter);
    parameter.setState({
      parameters: parameters
    });
  }

  onShareStrategySuccess(response,payload){
    NotificationController.displayNotification(
      "STRATEGY SHARED",
      "Your strategy has been shared with group member: " + payload.toUser,
      "info"
    );
  }

  onShareStrategy(){
    const data = ModalController.getData("shareStrategyModal");
    if(!data.toUser || data.toUser === ""){
      NotificationController.displayNotification(
        "NO USER SELECTED",
        "You must select a user you would like to share this strategy with",
        "error"
      );
      ModalController.activeModalComponent.setState({
        loading: false
      });
      return false;
    }
    const payload = {
      "toUser": data.toUser,
      "item": "strategy",
      "key": data.strategyId
    }
    ApiController.doPostWithToken(
      "share_item", 
      payload, 
      this.onShareStrategySuccess, 
      payload
    );
    ModalController.hideModal("shareStrategyModal");
    return true;
  }

  async onSaveStrategySubmit(){
    const payload = ModalController.getData("saveStrategyModal");
    if(payload.strategyName.length === 0){
      NotificationController.displayNotification(
        "ERROR",
        "Strategy name cannot be blank",
        "error"
      );
      return;
    }
    ModalController.hideModal("saveStrategyModal");

    if(!this.props.demo){
      ApiController.doPostWithToken(
        "save_strategy",
        payload,
        this.saveStrategySuccess,
        payload
      );
    }
    else{
      this.saveStrategySuccess(undefined,payload);
    }
  }

  onSaveStrategy(){

    if(this.props.demo && this.props.userStrategies.length === DEMO_LIMITS){
      this.props.showDemoLimits();
      return;
    }

    const signals = this.buildBuyAndSellSignals();

    //Buy and sell signal are exactly the same
    if(Constants.SIGNAL_METADATA[this.state.selectedBuySignal].apiName === 
       Constants.SIGNAL_METADATA[this.state.selectedSellSignal].apiName){
        NotificationController.displayNotification(
          "BUY SIGNAL = SELL SIGNAL ",
          "Buy and sell signal cannot be the exact same signal type.",
          "error"
        );
        return;
    }
    
    ModalController.showModal("saveStrategyModal",
     {
      buySignal: signals.buySignal,
      sellSignal: signals.sellSignal,
      stopLoss: this.getStopLossObject(),
      defaultDescription: this.generateDynamicDescriptionRaw(),
      callback: this.onSaveStrategySubmit
    });
  }

  buildBuyAndSellSignals(){
    const selectedBuySignal  = this.buildParameterPayload(this.state.selectedBuySignal,'buy');
    const selectedSellSignal = this.buildParameterPayload(this.state.selectedSellSignal,'sell');

    if(selectedBuySignal.signal === "SMA-CROSS-BUY" &&
       selectedBuySignal.smaSmaller >= selectedBuySignal.smaLarger){
        NotificationController.displayNotification(
          "ERROR",
          "SMA-SMALLER must be < SMA-LARGER",
          "error"
        );
        return;
    }

    if(selectedBuySignal.signal === "EMA-CROSS-BUY" &&
       selectedBuySignal.emaSmaller >= selectedBuySignal.emaLarger){
        NotificationController.displayNotification(
          "ERROR",
          "EMA-SMALLER must be < EMA-LARGER",
          "error"
        );
        return;
    }

    if(selectedSellSignal.signal === "SMA-CROSS-SELL" &&
       selectedSellSignal.smaSmaller >= selectedSellSignal.smaLarger){
        NotificationController.displayNotification(
          "ERROR",
          "SMA-SMALLER must be < SMA-LARGER",
          "error"
        );
        return;
    }

    if(selectedSellSignal.signal === "EMA-CROSS-SELL" &&
        selectedSellSignal.emaSmaller >= selectedSellSignal.emaLarger){
        NotificationController.displayNotification(
          "ERROR",
          "EMA-SMALLER must be < EMA-LARGER",
          "error"
        );  
        return;
    }

    return {
      buySignal: selectedBuySignal,
      sellSignal: selectedSellSignal
    }
  }

  async saveStrategySuccess(response,params){
    NotificationController.displayNotification(
      "STRATEGY SAVED",
      params.strategyName + " is now available in your manager",
      "info"
    );
    params.name = params.strategyName;
    if(!this.props.demo){
      params.id   = response.id;
    }
    this.props.appendStrategy(params);
  }

  /**
   * 
   * @param {The index into the signal} signal 
   * @param {'buy' or 'sell'} type 
   */
  buildParameterPayload(signal,type){

    //Is a string or signal object passed in (copying)
    signal = typeof signal === "string" ? signal : signal.signal;

    //Setup payload
    let payload = {}

    //Iterate over parameters in signal
    for(let p=0;p<Constants.SIGNAL_METADATA[signal].parameters.length;p++){

      //Grab indicator
      const indicator = Constants.INDICATOR_METADATA[Constants.SIGNAL_METADATA[signal].parameters[p]];

      //Grab indicators parameters
      const param = Constants.SIGNAL_METADATA[signal].parameters[p];

      //Generate a key
      const key   = signal + "-" + param + "-input";

      //Grab payload key from object
      const pKey  = Constants.INDICATOR_METADATA[param].key;

      //Grab value from document
      const value = indicator.convertBack ? 
                    indicator.convertBack(document.getElementById(key).value) :
                    document.getElementById(key).value

      //Set payloads parameter key
      payload[pKey] = Number(value);

      //Update static historical values for buy signal
      if(type === 'buy'){
        this.historicalParameterValues.buy.set(param,Number(value));
      }      

      //Update static historical values for sell signal
      else if(type === 'sell'){
        this.historicalParameterValues.sell.set(param,Number(value));
      }

    }

    //Set signal name to mapped api name
    payload["signal"] = Constants.SIGNAL_METADATA[signal].apiName;

    //Return generated payload
    return payload;
  }

  updateTab(newTab){
    this.setState({
      currentTab: newTab,
    });
  }

  createTooltipTextSignal(index, signal){
    return (
      <div>
        { signal.signal } 
        <a className="text-primary fa fa-info-circle" 
           data-tip data-for={ signal.signal + "-" + index }
           style={ MARGIN_LEFT }> 
        </a>
        <ReactTooltip id={ signal.signal + "-" + index } 
                      type="info" 
                      place="right" 
                      effect="solid">
          <span className="text-white"> 
            { this.signalToHtml(signal) } 
          </span>
        </ReactTooltip>
      </div>);
  }

  createTooltipTextStrategy(strategy,index){
    return (
      <span>
        { strategy.name } 
        <a className="text-primary fa fa-info-circle" 
           data-tip data-for={ strategy.name + "-" + index }
           style={ MARGIN_LEFT }> 
        </a>
        <ReactTooltip id={ strategy.name + "-" + index } 
                      type="info" 
                      place="right" 
                      effect="solid"
                      className="react-tooltip-fixed">
          <span className="text-white"> 
            <h5 className="text-white">
              <span className="text-white">DESCRIPTION</span>
            </h5>
            { strategy.description } 
          </span>
        </ReactTooltip>
      </span>);
  }

  signalToHtml(signal){
    let keys    = Object.keys(signal);
    const index = keys.indexOf("signal");
    
    if (index !== -1) {
        keys.splice(index, 1);
    }

    const listElements = keys.map((key) => 
      <span className="text-white">
        { this.camelToHyphen(key) + ": " + signal[key] }
        <br/>
      </span>);

    return (
      <div> 
        <h5 className="text-white"> CONFIGURATION </h5>
        <div className="text-white" style={ MARGIN_LEFT }>
          { listElements } 
        </div>
      </div>);
  }

  camelToHyphen(str){
    return str.split(/(?=[A-Z])/).join("-").toUpperCase();
  }

  buildTableData(){
    let data = new Array();
    for(let s=0;s<this.props.userStrategies.length;s++){
      const strategy   = this.props.userStrategies[s];
      const buySignal  = strategy.buySignals[0].signal;
      const sellSignal = strategy.sellSignals[0].signal;
      const name       = strategy.name;
      const stopLoss   = strategy.stopLoss;
      const row = [
        !this.props.demo ? this.getDropdownMenu(s+1, strategy) : <strong> { s+1 } </strong>,
        strategy.description.length != 0 ? this.createTooltipTextStrategy(strategy, s+1) : name,
        this.createTooltipTextSignal(s,strategy.buySignals[0]),
        this.createTooltipTextSignal(s,strategy.sellSignals[0]),
        <div>
          <span> { stopLoss.type } </span>
          <br/>
          <span> { (stopLoss.stopLossPercent)*100 + "%" } </span>
        </div>,
       ];
      data.push(row);
    }
    return data;
  }


  buildTableDataMobile(){
    let data = new Array();
    for(let s=0;s<this.props.userStrategies.length;s++){
      const strategy   = this.props.userStrategies[s];
      const buySignal  = strategy.buySignals[0].signal;
      const sellSignal = strategy.sellSignals[0].signal;
      const name       = strategy.name;
      const stopLoss   = strategy.stopLoss;
      const row = [
        name,
        buySignal,
        [sellSignal,
          <span>
            <span> { stopLoss.type } </span>
            <br/>
            <span> { (stopLoss.stopLossPercent)*100 + "%" } </span>
          </span>
        ]
       ];
      data.push(row);
    }
    return data;
  }

  getDropdownMenu(id, strategy){
    const self = this;
    return (
    <div>
      <strong>{ id }</strong>
      <Dropdown dropdownList={ [
        <div>
          <i class="fa fa-share" aria-hidden="true" style={ {marginRight: "5px" } }/>
          <span onClick={ function( ){ 
            ModalController.showModal("shareStrategyModal",{
              strategyId: strategy.id,
              strategyName: strategy.name,
              callback: self.onShareStrategy,
              toUser: ""
            });
          } }> SHARE </span>
        </div>,
        <div>
          <i class="fa fa-close" aria-hidden="true" style={ {marginRight: "5px" } }/>
          <span onClick={ function( ){ 
            ModalController.showModal("deleteStrategyModal",{
              strategyId: strategy.id,
              strategyName: strategy.name
            });
          } }> DELETE </span>
        </div>,
        <div>
          <i class="fa fa-clone" aria-hidden="true" style={ { marginRight: "5px" } }/>
          <span onClick={ function(){ 
            self.setState({
                selectedBuySignal: strategy.buySignals[0],
                selectedSellSignal: strategy.sellSignals[0],
                selectedStrategy: strategy
              });
            } }> COPY PARAMS </span>
        </div>
        ] }
      header={ <IconHeader iconClass="fa fa fa-tasks"
                           header="ACTIONS"
                           anchor="left"
                           textClass="text-center"/> }
      onClickRow={ function(){} }
      buttonText={ "" }
      mini={ true }/>
    </div>
    );
  }

  randomizeStrategy(){
    this.state.selectedStrategy = this.getRandomStrategy();
    this.historicalParameterValues = {
      buy: new Map(),
      sell: new Map()
    };
    this.setState({
      selectedStrategy: this.state.selectedStrategy,
      selectedBuySignal: this.state.selectedStrategy.buySignals[0],
      selectedSellSignal: this.state.selectedStrategy.sellSignals[0]
    });
  }

  getRandomStrategy(){
    const randBuy  = this.props.inHouseSignals.preconfiguredBuySignals[Math.floor(Math.random() * 
                      this.props.inHouseSignals.preconfiguredBuySignals.length)];
    const randSell = this.props.inHouseSignals.preconfiguredSellSignals[Math.floor(Math.random() * 
                      this.props.inHouseSignals.preconfiguredSellSignals.length)];
    return {
      buySignals: [randBuy],
      sellSignals: [randSell]
    }
  }
  
  selectStrategy(strategy){
    this.state.selectedStrategy = this.props.userStrategies[(strategy[0]-1)];
    this.setState({
      selectedStrategy: this.state.selectedStrategy
    });
  }

  onSelectSignalBuy(signal){
    this.setState({
      selectedBuySignal: signal,
      selectedStrategy: undefined
    });
  }

  onSelectSignalSell(signal){
    this.setState({
      selectedSellSignal: signal,
      selectedStrategy: undefined
    });
  }

  doBacktest(params){
    const exchange = params.exchange;
    const market   = params.base + "-" + params.quote;
    const interval = params.interval;
    const stopLoss = params.stopLoss;

    const signals = this.buildBuyAndSellSignals();
    const strategy = {
      buySignals: [signals.buySignal],
      sellSignals: [signals.sellSignal],
      stopLoss: this.getStopLossObject(),
      name: "QUICKTEST",
      description: "quick testing strategy",
      advanced: false
    }

    const payload = {
      backtests: [{
        "market": market,
        "candleSize": interval,
        "exchange": exchange,
        "initialInvestment": 1000,
        "strategy": strategy,
        "startDate": "",
        "endDate": "",
      }],
      archive: false
    }
    this.setState({
      loadingQuicktest: true,
      quicktestParams: payload.backtests[0],
      selectedBase: params.base,
      selectedQuote: params.quote
    });
    const self = this;
    ApiController.doPost(
      "backtest_public",
      payload,
      function(response){
        self.setState({
          loadingQuicktest: false,
          backtestResults: response.backtestResults,
          showChart: true
        });
      },
      undefined,
      () => {
        self.setState({
          loadingQuicktest: false
        });
      }
    )
  }

  buildDropdownQuickTest(){
    let markets = [];
    for (let t=0; t<this.props.tickers.length;t++) {
      const ticker = this.props.tickers[t];
      const market = (ticker.base + "-" + ticker.quote + "  (" + ticker.exchange + ")").toUpperCase();
      markets.push(market)
    }
    return markets;
  }

  buildMappedDataQuickTest(){
    let mapped = [];
    for (let t=0; t<this.props.tickers.length;t++) {
      const ticker = this.props.tickers[t];
      mapped.push({
        exchange: ticker.exchange,
        base: ticker.base,
        quote: ticker.quote,
        stopLoss: this.state.quicktest.stopLoss,
        interval: this.state.quicktest.interval
      });
    }
    return mapped;
  }

  updateQuicktest(quicktest){
    this.setState({
      quicktest: quicktest
    });
  }

  toggleBuyClass(type){
    if(this.state.toggledBuyClasses.includes(type)){
      let toggled = this.state.toggledBuyClasses;
      const index = this.state.toggledBuyClasses.indexOf(type);
      toggled.splice(index,1);
      this.setState({
        toggledBuyClasses: toggled
      });
    }
    else{
      let toggled = this.state.toggledBuyClasses;
      toggled.push(type);
      this.setState({
        toggledSellClasses: toggled
      });
    }
  }

  toggleSellClass(type){
    if(this.state.toggledSellClasses.includes(type)){
      let toggled = this.state.toggledSellClasses;
      const index = this.state.toggledSellClasses.indexOf(type);
      toggled.splice(index,1);
      this.setState({
        toggledSellClasses: toggled
      });
    }
    else{
      let toggled = this.state.toggledSellClasses;
      toggled.push(type);
      this.setState({
        toggledSellClasses: toggled
      });
    }
  }

  toggleBuySignals(type){
    if(this.state.toggledBuySignals.includes(type)){
      let toggled = this.state.toggledBuySignals;
      const index = this.state.toggledBuySignals.indexOf(type);
      toggled.splice(index,1);
      this.setState({
        toggledBuySignals: toggled
      });
    }
    else{
      let toggled = this.state.toggledBuySignals;
      toggled.push(type);
      this.setState({
        toggledBuySignals: toggled
      });
    }
  }

  toggleSellSignals(type){
    if(this.state.toggledSellSignals.includes(type)){
      let toggled = this.state.toggledSellSignals;
      const index = this.state.toggledSellSignals.indexOf(type);
      toggled.splice(index,1);
      this.setState({
        toggledSellSignals: toggled
      });
    }
    else{
      let toggled = this.state.toggledSellSignals;
      toggled.push(type);
      this.setState({
        toggledSellSignals: toggled
      });
    }
  }

  generateDynamicDescriptionRaw(){

        //Grab signal specific buy description
        const buy  = Constants.SIGNAL_METADATA[this.state.selectedBuySignal].callback("BUY");

        //Grab signal specific sell description
        const sell = Constants.SIGNAL_METADATA[this.state.selectedSellSignal].callback("SELL");

        //Stop loss text
        const stopLossObject = this.getStopLossObject();
        const stop = this.state.stopLossType === 0 ? 
                        "triggers at a " + parseFloat((stopLossObject.stopLossPercent*100)) + "% loss" :
                          this.state.stopLossType === 1 ?
                            "triggers at a " + parseFloat((stopLossObject.stopLossPercent*100)) + "% loss - price trailing" :
                            "triggers at a " + parseFloat((stopLossObject.stopLossPercent*100)) + "% loss - target trailing";

        return "Buy " + buy + ", and sell " + sell + ". Stop loss " + stop;
  }

  generateDynamicDescription(){

    //Grab signal specific buy description
    const buy  = Constants.SIGNAL_METADATA[this.state.selectedBuySignal].callback("BUY");

    //Grab signal specific sell description
    const sell = Constants.SIGNAL_METADATA[this.state.selectedSellSignal].callback("SELL");

    //Stop loss text
    const stopLossObject = this.getStopLossObject();
    const stop = this.state.stopLossType === 0 ? 
                    "triggers at a " + parseFloat((stopLossObject.stopLossPercent*100).toFixed(4)) + "% loss" :
                      this.state.stopLossType === 1 ?
                        "triggers at a " + parseFloat((stopLossObject.stopLossPercent*100).toFixed(4)) + "% loss - price trailing" :
                        "triggers at a " + parseFloat((stopLossObject.stopLossPercent*100).toFixed(4)) + "% loss - target trailing";

    //Descriptions return blank if values were null, return blank description - only in
    //initial case
    if(buy === "" || sell === ""){
      return "";
    }

    const buyType = Constants.SIGNAL_METADATA[this.state.selectedBuySignal].type;
    const sellType = Constants.SIGNAL_METADATA[this.state.selectedSellSignal].type;
    let type       = "";

    if(buyType === sellType){
      type = buyType;
    }
    else{
      type = buyType + " & " + sellType
    }
    
    //Return joined description
    return <div className="text-black margin-left-10">
            <h4 className="text-black" >
              My Strategy | <i>{ type } Based</i>
            </h4>
            <h5 className="margin-top-10 text-left text-success"> 
              <strong> BUY </strong> { buy }
            </h5>
            <h5 className="margin-top-10 text-left text-danger">
              <strong> SELL </strong> { sell }
            </h5>
            <h5 className="margin-top-10 text-left text-primary">
              <strong> STOP LOSS </strong> { stop }
            </h5>
    </div>
  }

  /**
   * Call to force parent level update
   */
  updateCallback = () =>{
    this.setState({
      update: true
    });
  }

  /**
   * Force update if description does not exist
   */
  componentDidUpdate(){
    if(this.strategyDescription !== this.generateDynamicDescriptionRaw()){
      this.updateCallback();
    }
  }

  /**
   * Force update if description does not exist
   */
  componentDidMount(){
    if(this.strategyDescription !== this.generateDynamicDescriptionRaw()){
      this.updateCallback();
    }
  }

  render() {

    const self = this;
    this.strategyDescription = this.generateDynamicDescriptionRaw();
    const parameter = "STOP LOSS %";
    return (<div className="tab-pane active show" style={ TAB_MARGIN }>
                <div>
                <div className="row margin-top-25 margin-bottom-5 text-left">
                <div className="col-md-6">
                    <span className="margins-5">
                      { !this.state.showChart && <Dropdown id="groupsDropdown"
                                dropdownList={ this.buildDropdownQuickTest() }
                                header={ <QuickTestHeader updateQuicktest={ this.updateQuicktest }/> }
                                onClickRow={ this.doBacktest }
                                mappedData={ this.buildMappedDataQuickTest() }
                                buttonText={ "QUICK TEST" }
                                additionalClass="width-2x overflow-x-hidden"/>
                    }
                    { this.state.showChart && 
                        <button onClick={ () => { self.setState( { showChart: false } ) } }
                                className="btn btn-primary text-center"
                                style={{width:"160px"}}> 
                        <IconHeader iconClass="fa fa-object-group" 
                                    header="DESIGN" 
                                    anchor="left" 
                                    textClass="text-center"/> </button>
                    }
                    </span>
                    <span className="margins-5">
                      <button onClick={ this.onSaveStrategy }
                              className="btn btn-primary text-center"
                              style={{width:"160px"}}> 
                        <IconHeader iconClass="fa fa-share-square-o" header="SAVE" anchor="left" textClass="text-center"/> </button>
                    </span>
                    <div className="row margin-top-15">
                      <div className="col-sm-12">
                        <label for={ "standard-stoploss" }>
                          { "Standard" }&nbsp;&nbsp;
                        </label>
                        <input key={ "standard-stoploss" }
                              id={ "standard-stoploss" }
                              type="checkbox" 
                              checked={ this.state.stopLossType === 0 }
                              value={ "Standard" }
                              onChange={ () => { self.setState( { stopLossType: 0 } ) } }/>&nbsp;&nbsp;
                        <label for={ "standard-stoploss" }>
                          { "Price Trailing" }&nbsp;&nbsp;
                        </label>
                        <input key={ "pricetrailing-stoploss" }
                              id={ "pricetrailing-stoploss" }
                              type="checkbox" 
                              checked={ this.state.stopLossType === 1 }
                              value={ "Price Trailing" }
                              onChange={ () => { self.setState( { stopLossType: 1 } ) } }/>&nbsp;&nbsp;
                        <label for={ "standard-stoploss" }>
                          { "Target Trailing" }&nbsp;&nbsp;
                        </label>
                        <input key={ "targettrailing-stoploss" }
                              id={ "targettrailing-stoploss" }
                              type="checkbox" 
                              checked={ this.state.stopLossType === 2 }
                              value={ "Target Trailing" }
                              onChange={ () => { self.setState( { stopLossType: 2 } ) } }/>&nbsp;&nbsp;
                      </div>
                      <div className="col-sm-5 margin-top-5">
                          <ParameterInputSpinner inputBoxStyle={ { 
                                                  paddingLeft:  "10px",
                                                  width: "124px"
                                                } }
                                                key={ parameter }
                                                max={ Constants.INDICATOR_METADATA[parameter].max }
                                                step={ Constants.INDICATOR_METADATA[parameter].step }                                    
                                                inputId={ parameter + "-input" } 
                                                parameter={ parameter }
                                                defaultValue={ Constants.INDICATOR_METADATA[parameter].defaultValue } 
                                                min={ Constants.INDICATOR_METADATA[parameter].min }
                                                signalId={ parameter }
                                                precision={ Constants.INDICATOR_METADATA[parameter].precision }
                                                onChangeCallback={ this.updateCallback }/>
                      </div>
                      <div className="col-sm-5 margin-top-5">
                          { this.state.stopLossType === 2 &&
                            <ParameterInputSpinner  inputBoxStyle={ { 
                                                      paddingLeft:  "10px",
                                                      width: "124px"
                                                    } }
                                                    key={ "STOP TARGET %"}
                                                    max={ Constants.INDICATOR_METADATA["STOP TARGET %"].max }
                                                    step={ Constants.INDICATOR_METADATA["STOP TARGET %"].step }                                    
                                                    inputId={ "STOP TARGET %" + "-input" } 
                                                    parameter={ "STOP TARGET %" }
                                                    defaultValue={ Constants.INDICATOR_METADATA["STOP TARGET %"].defaultValue } 
                                                    min={ Constants.INDICATOR_METADATA["STOP TARGET %"].min }
                                                    signalId={ "STOP TARGET %" }
                                                    precision={ Constants.INDICATOR_METADATA["STOP TARGET %"].precision }
                                                    onChangeCallback={ this.updateCallback }/>
                          }
                      </div>
                    </div>
                  </div>
                  {
                    <div className="col-md-6 border-left">
                      <span>
                        { this.generateDynamicDescription() }
                      </span>
                    </div>
                  }
                </div>
                    <div style={ this.state.loadingQuicktest || this.state.showChart ? 
                      {
                        width: "0px",
                        height: "0px",
                        position: "absolute",
                        transform: "translate(-10000px)"
                      } :
                      {}
                      }>
                      <SignalCreator selectedStrategy={ this.state.selectedStrategy }
                                     onSelectSignalBuy={ this.onSelectSignalBuy }
                                     onSelectSignalSell={ this.onSelectSignalSell }
                                     selectedSellSignal={ this.state.selectedSellSignal }
                                     selectedBuySignal={ this.state.selectedBuySignal }
                                     randomizeStrategy={ this.randomizeStrategy }
                                     onSaveStrategy={ this.onSaveStrategy }
                                     tickers={ this.props.tickers }
                                     doBacktest={ this.doBacktest }
                                     historicalParameterValues={ this.historicalParameterValues }
                                     appendParameter={ this.props.appendParameter}
                                     toggledBuyClasses={ this.state.toggledBuyClasses }
                                     toggledSellClasses={ this.state.toggledSellClasses }
                                     toggledBuySignals={ this.state.toggledBuySignals }
                                     toggledSellSignals={ this.state.toggledSellSignals }
                                     toggleBuyClass={ this.toggleBuyClass }
                                     toggleSellClass={ this.toggleSellClass }
                                     toggleBuySignal={ this.toggleBuySignals }
                                     toggleSellSignal={ this.toggleSellSignals }
                                     updateCallback={ this.updateCallback }/>
                                     <br/><br/>
                    </div>
                  {  !this.state.loadingQuicktest && this.state.showChart &&
                    <div className="margin-top-10 margin-bottom-5">
                      <QuicktestChart backtest={ this.state.backtestResults[0] }
                                      params={ this.state.quicktestParams }/>
                    </div>
                  }
                  { this.state.loadingQuicktest &&
                    <div>
                      <Loader loadingMessage="Running backtest..." styleOverride={{ marginTop: "200px", marginBottom: "290px" } }/>
                    </div>
                  }
                </div>
                <br/>
                <div id="lower" className="text-uppercase">
                { !Constants.IS_MOBILE &&
                <FilterTable header={[
                                "#NUM",
                                "STRATEGY",
                                "BUY SIGNALS",
                                "SELL SIGNALS",
                                "STOP LOSS"
                              ]}
                              data={ this.buildTableData() }
                              mappedData={ this.props.userStrategies }
                              onClick={ this.selectStrategy }
                              align="left"
                              classOverride="row"
                              searchText="Search strategies..."
                              disableClick={ true }/>
              }
              { Constants.IS_MOBILE &&
                <FilterTable header={[
                                "STRATEGY",
                                "BUY SIGNALS",
                                "SELL SIGNALS"
                              ]}
                              columnCallbacks={{
                                "2": function(value){
                                  const sellSignal = value[0];
                                  const stop       = value[1];
                                  return <span>
                                    <div>{ sellSignal }</div>
                                    <div>{ stop }</div>
                                  </span>
                                }
                              }}
                              data={ this.buildTableDataMobile() }
                              mappedData={ this.props.userStrategies }
                              onClick={ this.selectStrategy }
                              align="left"
                              classOverride="row"
                              searchText="Search strategies..."
                              disableClick={ true }/>
              }
              </div>
              <br/><br/><br/><br/>
          </div>
    );
  }
}
