import React from "react"
import SignalCreator from "./signal_creator"
import PlatformTemplate from "./platform_template"
import Loader from "../generic/loader"
import FilterTable from "../generic/filter_table"
import ApiController from "../../js/ApiController"
import Dropdown from "../generic/dropdown"
import IconHeader from "../generic/icon_header"
import ReactTooltip from "react-tooltip"
import ModalController from "../../js/ModalController"
import Constants from "../../js/Constants"
import Modal from "./modals/modal"
import SaveStrategyModalBody from "./save_strategy_modal_body"
import DeleteStrategyModalBody from "./delete_strategy_modal_body"
import ShareModalBody from "./share_modal_body"
import TabMenu from "../platform/tab_menu"
import NotificationController from "../../js/NotificationController"

const MARGIN_LEFT={
  marginLeft: "5px"
}

const TAB_MARGIN = {
  marginTop: "5px",
  marginLeft: "15px",
  marginRight: "15px"
}

const MODAL_ID        = "saveStrategyModal";
const MODAL_TITLE_ID  = "saveStrategyModalTitle";
const MODAL_TITLE     = "Save Strategy Configuration";

const MODAL_ID_DELETE        = "deleteStrategyModal";
const MODAL_TITLE_ID_DELETE  = "deleteStrategyModalTitle";
const MODAL_TITLE_DELETE     = "Confirm Delete Strategy";

const MODAL_ID_SHARE        = "shareStrategyModal";
const MODAL_TITLE_ID_SHARE  = "shareStrategyModalTitle";
const MODAL_TITLE_SHARE     = "Share Strategy";

export default class StrategyManagerMain extends React.Component {

  constructor(props){
    super(props);
    this.state={
      userStrategies: undefined,
      sellSignals: undefined,
      buySignals: undefined,
      loading: true,
      loadingMessage: "Fetching Strategies...",
      selectedStrategy: undefined,
      selectedBuySignal: "SMA-BUY",
      selectedSellSignal: "SMA-SELL",
      showModal: false,
      modal: "",
      strategyToDelete: "",
      currentTab: 0,
      strategyToShare: undefined
    }


    this.onGetSignalsSuccess    = this.onGetSignalsSuccess.bind(this);
    this.onGetStrategiesSuccess = this.onGetStrategiesSuccess.bind(this);
    this.selectStrategy         = this.selectStrategy.bind(this);
    this.onSelectSignalBuy      = this.onSelectSignalBuy.bind(this);
    this.onSelectSignalSell     = this.onSelectSignalSell.bind(this);
    this.randomizeStrategy      = this.randomizeStrategy.bind(this);
    this.getRandomStrategy      = this.getRandomStrategy.bind(this);
    this.onSaveStrategy         = this.onSaveStrategy.bind(this);
    this.onSaveStrategySubmit   = this.onSaveStrategySubmit.bind(this);
    this.onSaveStrategySubmitSuccess   = this.onSaveStrategySubmitSuccess.bind(this);
    this.onDeleteStrategySuccess     = this.onDeleteStrategySuccess.bind(this);
    this.updateTab              = this.updateTab.bind(this);
    this.onShareStrategy = this.onShareStrategy.bind(this);
    this.onShareStrategySuccess = this.onShareStrategySuccess.bind(this);
    const self = this;

    ModalController.registerModal(MODAL_ID_SHARE, self);
    ModalController.registerModal(MODAL_ID, self);
    ModalController.registerModal(MODAL_ID_DELETE, self);
  }

  onShareStrategySuccess(response,payload){
    NotificationController.displayNotification(
      "STRATEGY SHARED",
      this.state.strategyToShare.strategyName + " has been shared with group member: " + payload.toUser,
      "info"
    );
  }

  onShareStrategy(toUser){
    if(!toUser || toUser === ""){
      NotificationController.displayNotification(
        "NO USER SELECTED",
        "You must select a user you would like to share this strategy with",
        "error"
      );
      return;
    }
    const payload = {
      "toUser": toUser,
      "item": "strategy",
      "key": this.state.strategyToShare.strategyId
    }
    ApiController.doPostWithToken("share_item", payload, this.onShareStrategySuccess, payload);
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
      this.props.appendStrategy(payload);
    }
  }

  onSaveStrategy(){
    const selectedBuySignal  = this.buildParameterPayload(this.state.selectedBuySignal);
    const selectedSellSignal = this.buildParameterPayload(this.state.selectedSellSignal);

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

    this.state.modal = MODAL_ID;
    ModalController.showModal(MODAL_ID,{
      buySignal: selectedBuySignal,
      sellSignal: selectedSellSignal,
      callback: this.onSaveStrategySubmit
    });
  }

  onSaveStrategySubmit(){
    const payload = ModalController.getData(MODAL_ID);

    if(payload.strategyName.length === 0){
      NotificationController.displayNotification(
        "ERROR",
        "Strategy name cannot be blank",
        "error"
      );
      return;
    }
    
    ModalController.hideModal(MODAL_ID);

    if(!this.props.demo){
      ApiController.doPostWithToken(
        "save_strategy",
        payload,
        this.onSaveStrategySubmitSuccess,
        payload
      );
    }
    else{
      this.onSaveStrategySubmitSuccess(undefined,payload);
    }
  }

  onSaveStrategySubmitSuccess(response,params){
    NotificationController.displayNotification(
      "STRATEGY SAVED",
      params.strategyName + " is now available in your manager",
      "info"
    );
    this.props.appendStrategy({
      buySignals: params.buySignals,
      stopLoss: params.stopLoss,
      sellSignals: params.sellSignals,
      name: params.strategyName,
      description: params.description,
      id: response.id
    });
  }

  removeStrategyById(id){
    for(let s=0;s<this.state.userStrategies.length;s++){
      if(this.state.userStrategies[s].id === id){
        this.state.userStrategies.splice(s,1);
        this.setState({
          userStrategies: this.state.userStrategies
        });
        return;
      } 
    }
  }

  onDeleteStrategySuccess(response,payload){
    NotificationController.displayNotification(
      "STRATEGY DELETED",
      payload.strategyName + " has been removed from your profile",
      "info"
    );
    this.removeStrategyById(payload.strategyId);
    ModalController.hideModal(MODAL_ID_DELETE);
  }

  buildParameterPayload(signal){
    signal = typeof signal === "string" ? signal : signal.signal;
    let payload = {}
    for(let p=0;p<Constants.SIGNAL_METADATA[signal].parameters.length;p++){
      const indicator = Constants.INDICATOR_METADATA[Constants.SIGNAL_METADATA[signal].parameters[p]];
      const param = Constants.SIGNAL_METADATA[signal].parameters[p];
      const key   = signal + "-" + param + "-input";
      const pKey  = Constants.INDICATOR_METADATA[param].key;
      const value = indicator.convertBack ? 
                    indicator.convertBack(document.getElementById(key).value) :
                    document.getElementById(key).value
      payload[pKey] = Number(value);
    }
    payload["signal"] = signal;
    return payload;
  }

  onGetStrategiesSuccess(response){
    this.state.userStrategies = response.strategies;
    if(this.state.userStrategies.length > 0){
      this.state.selectedStrategy = {
        buySignals: this.state.userStrategies[0].buySignals,
        sellSignals: this.state.userStrategies[0].sellSignals
      }
    }
    if(this.state.userStrategies.length != 0){
      this.state.selectedBuySignal  = 
        this.state.userStrategies[0].buySignals[0].signal;
      this.state.selectedSellSignal =
        this.state.userStrategies[0].sellSignals[0].signal;
    }
    this.updateLoading();
  }

  onGetSignalsSuccess(response){
    this.state.sellSignals = response.preconfiguredSellSignals;
    this.state.buySignals = response.preconfiguredBuySignals;
    this.updateLoading();
  }

  updateLoading(){
    if(this.state.userStrategies && this.state.buySignals && this.state.sellSignals){
      this.setState({
        loading: false
      });
    }
  }

  updateTab(newTab){
    this.setState({
      currentTab: newTab,
    });
  }

  getTab(){

    if(this.state.currentTab === 0) {
      return this.state.loading ?               
              <Loader loadingMessage={ this.state.loadingMessage }/> :
              <div className="tab-pane active show" style={ TAB_MARGIN }>
              <SignalCreator selectedStrategy={ this.state.selectedStrategy }
                              onSelectSignalBuy={ this.onSelectSignalBuy }
                              onSelectSignalSell={ this.onSelectSignalSell }
                              selectedSellSignal={ this.state.selectedSellSignal }
                              selectedBuySignal={ this.state.selectedBuySignal }
                              randomizeStrategy={ this.randomizeStrategy }
                              onSaveStrategy={ this.onSaveStrategy }/><br/><br/>
              <div>
              <FilterTable header={[
                              "#NUM",
                              "STRATEGY",
                              "BUY SIGNALS",
                              "SELL SIGNALS",
                              "STOP LOSS"
                            ]}
                            data={ this.buildTableData() }
                            mappedData={ this.state.userStrategies }
                            onClick={ this.selectStrategy }
                            align="left"
                            classOverride="row"
                            searchText="Search strategies..."
                            disableClick={ true }/>
            </div>
            <br/><br/><br/><br/>
            </div>;
    }
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
          <span> 
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
          <span> 
            <h5 className="border-bottom">
              DESCRIPTION
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
      <span>
        { this.camelToHyphen(key) + ": " + signal[key] }
        <br/>
      </span>);

    return (
      <div> 
        <h5 className="border-bottom"> CONFIGURATION </h5>
        <div style={ MARGIN_LEFT }>
          { listElements } 
        </div>
      </div>);
  }

  camelToHyphen(str){
    return str.split(/(?=[A-Z])/).join("-").toUpperCase();
  }

  buildTableData(){
    let data = new Array();
    for(let s=0;s<this.state.userStrategies.length;s++){
      const strategy   = this.state.userStrategies[s];
      const buySignal  = strategy.buySignals[0].signal;
      const sellSignal = strategy.sellSignals[0].signal;
      const name       = strategy.name;
      const stopLoss   = strategy.stopLoss;
      const row = [
        this.getDropdownMenu(s+1, strategy),
        strategy.description.length != 0 ? this.createTooltipTextStrategy(strategy, s+1) : name,
        this.createTooltipTextSignal(s,strategy.buySignals[0]),
        this.createTooltipTextSignal(s,strategy.sellSignals[0]),
        (stopLoss*100) + "%",
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
            ModalController.showModal(MODAL_ID_SHARE,{
              strategyId: strategy.id,
              strategyName: strategy.name
            });
            self.state.modal = MODAL_ID_SHARE;
            self.state.strategyToShare = {
              strategyId: strategy.id,
              strategyName: strategy.name
            };
          } }> SHARE </span>
        </div>,
        <div>
          <i class="fa fa-close" aria-hidden="true" style={ {marginRight: "5px" } }/>
          <span onClick={ function( ){ 
            ModalController.showModal(MODAL_ID_DELETE,{
              strategyId: strategy.id,
              strategyName: strategy.name
            });
            self.state.modal = MODAL_ID_DELETE;
            self.state.strategyToDelete = {
              strategyId: strategy.id,
              strategyName: strategy.name
            };
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
                          anchor="left"/> }
      onClickRow={ function(){} }
      buttonText={ "" }
      mini={ true }/>
    </div>
    );
  }

  randomizeStrategy(){
    this.state.selectedStrategy = this.getRandomStrategy();
    this.setState({
      selectedStrategy: this.state.selectedStrategy,
      selectedBuySignal: this.state.selectedStrategy.buySignals[0],
      selectedSellSignal: this.state.selectedStrategy.sellSignals[0]
    });
  }

  getRandomStrategy(){
    const randBuy  = this.state.buySignals[Math.floor(Math.random() * this.state.buySignals.length)];
    const randSell = this.state.sellSignals[Math.floor(Math.random() * this.state.sellSignals.length)];
    return {
      buySignals: [randBuy],
      sellSignals: [randSell]
    }
  }
  
  selectStrategy(strategy){
    this.state.selectedStrategy = this.state.userStrategies[(strategy[0]-1)];
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

  getModal(self){

    let id        = undefined;
    let titleId   = undefined;
    let title     = undefined;
    let modalBody = undefined;

    if(this.state.modal === "saveStrategyModal"){
      id        = MODAL_ID;
      titleId   = MODAL_TITLE_ID;
      title     = "Save Strategy";
      modalBody = <SaveStrategyModalBody onSubmit={ this.onSaveStrategySubmit }/>;
    }
    else if(this.state.modal === "deleteStrategyModal"){
      id        = MODAL_ID_DELETE;
      titleId   = MODAL_TITLE_ID_DELETE;
      title     = "Delete Strategy";
      modalBody = <DeleteStrategyModalBody onSubmit={ function(){
                                            const payload = {
                                              strategyId: self.state.strategyToDelete.strategyId,
                                            }
                                            const input = document.getElementById("strategyNameInput").value;
                                            if(input.toUpperCase() != self.state.strategyToDelete.strategyName.toUpperCase()){
                                              NotificationController.displayNotification(
                                                "ERROR",
                                                "Inserted name does not match strategy name",
                                                "error"
                                              );
                                              return;
                                            }
                                            ApiController.doPostWithToken("delete_strategy",
                                              payload,
                                              self.onDeleteStrategySuccess,
                                              self.state.strategyToDelete
                                            );
                                          }}/>
    }
    else if(this.state.modal === "shareStrategyModal"){
      id        = MODAL_ID_SHARE;
      titleId   = MODAL_TITLE_ID_SHARE;
      title     = this.state.strategyToShare.strategyName.length <= 16 ? 
                    "Share Strategy " + this.state.strategyToShare.strategyName :
                    <span className="text-left">Share Strategy <br/> { this.state.strategyToShare.strategyName }</span>
      modalBody = <ShareModalBody parentId={ MODAL_ID_SHARE }
                                  onSubmit={ function(){
                                    const data = ModalController.getData(MODAL_ID_SHARE);
                                    self.onShareStrategy(ModalController.getData(MODAL_ID_SHARE).toUser);
                                  }}/>
    }

    return <Modal modalId={ id }
                  titleId={ titleId }
                  title={ title }
                  modalBody={ modalBody }/>
  }

  componentDidMount(){
    ApiController.doPostWithToken("get_strategies",{},this.onGetStrategiesSuccess);
    ApiController.doGet("get_signals",this.onGetSignalsSuccess);
  }

  render() {

    const self = this;

    return (
      <div>
        <PlatformTemplate title="Dashboard"
                          subtitle="Strategy Manager"
                          serviceComponent={
                            <div>
                            <TabMenu updateTab={ this.updateTab }
                                     currentTab={ this.state.currentTab } 
                                     tabs={ [
                              { 
                                name: "MANAGER"
                              } 
                              ] }/>
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
                           }/>
        { ModalController.modals[MODAL_ID] &&
          this.state.showModal &&
          this.getModal(self)
        }
      </div>
    );
  }
}
