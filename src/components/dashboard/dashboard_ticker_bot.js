
import React from "react"
import ApiController from "../../js/ApiController"
import Dropdown from "../dropdown"
import DashboardGraphButton from "./dashboard_graph_button"
import Constants from "../../js/Constants";
import ModalController from "../../js/ModalController";
import Loader from "../generic/loader"

const UP_COLOR = "#cbfdd7";
const DOWN_COLOR = "rgba(251, 214, 218, 1.0)";
const NEUTRAL_COLOR = "#e2e2e2";

const DIV_STYLE_NOT_SELECTED = {
    backgroundColor: NEUTRAL_COLOR,
    marginRight: "3px",
    marginLeft: "3px",
    marginBottom: "15px",
    maxWidth: "24%"
}

const DIV_STYLE_SELECTED = {
    backgroundColor: "rgba(108, 117, 125, 0.15)",
    marginRight: "3px",
    marginLeft: "3px",
    marginBottom: "15px",
    maxWidth: "24%"
}

const HEADER_STYLE = {
    paddingTop: "15px"
}

const FIRST_ITEM_STYLE = {
    marginTop: "5px"
}

const FLOAT_RIGHT_STYLE = {
    right: "10px"
}

const LAST_ITEM_STYLE = {
    marginTop: "10px",
    marginBottom: "0px"
}

const GRAPH_BUTTON_STYLE = {
  paddingRight: "40px"
}

/**
 * Main login component - renders login page
 */
export default class DashboardTicker extends React.Component {

  constructor(props){
      
      super(props);
      this.state = {
        selected: false,
        hovered: false,
        init: false,
        candles: this.props.candles,
        interval: this.props.interval,
        lastPrice: undefined
      }

      this.handleClick = this.handleClick.bind(this)
      this.handleMouseLeave = this.handleMouseLeave.bind(this)
      this.handleMouseOver = this.handleMouseOver.bind(this)
      this.updateInterval = this.updateInterval.bind(this)
      this.showModal = this.showModal.bind(this)
  }

  buildDropdownList(){
    let dropdown = [];

    for(let e=0;e<Constants.SUPPORTED_EXCHANGES.length;e++){
      dropdown.push(Constants.SUPPORTED_EXCHANGES[e])
    }

    return dropdown;
  }

  getPercentChange(){

    const percentChange = (( this.getLastPrice() / this.getLastClose()) - 1.00) * 100;

    if(this.getLastPrice() > this.getLastClose()) {
      return " ↑" + Number.parseFloat(percentChange).toFixed(2) + "%";
    }
    else if(this.getLastPrice() < this.getLastClose()) {
      return " ↓" + Number.parseFloat(percentChange*-1).toFixed(2) + "%";
    }
    else {
      return Number.parseFloat(percentChange).toFixed(2) + "%";
    }
  }



  getLastPriceText(){
    if(this.state.lastPrice === undefined){
      return this.props.candles.lastPrice.close;
    }
    else if(this.state.lastPrice.close < this.props.lastPrice.close ){
      return "↑" + this.props.candles.lastPrice.close;
    }
    else if(this.state.lastPrice.close > this.props.lastPrice.close ){
      return "↓" + this.props.candles.lastPrice.close;
    }
    return this.props.candles.lastPrice.close;
  }

  getLastPrice(){
    return this.props.candles.lastPrice.close;
  }

  getLastClose(){
    const priceData = this.props.candles.priceData;
    return priceData[priceData.length-1].close;
  }

  getLastVolume(){
    const priceData = this.props.candles.priceData;
    return priceData[priceData.length-1].volume;
  }

  getMarket(){
    return this.props.ticker.base.toUpperCase() + "-" + 
           this.props.ticker.quote.toUpperCase();
  }

  getClassFromValue(){
    if(this.getLastPrice() > this.getLastClose()) {
      return "text-success";
    }
    else if(this.getLastPrice() < this.getLastClose()) {
      return "text-danger";
    }
    return "text-primary";
  }

  getBorderFromValue(){
    if(this.getLastPrice() > this.getLastClose()) {
      return "style_prevu_kit col-md-3 rounded border-2-success";
    }
    else if(this.getLastPrice() < this.getLastClose()) {
      return "style_prevu_kit col-md-3 rounded border-2-danger";
    }
    return "style_prevu_kit col-md-3 rounded border-2-primary";
  }

  getStyleFromValue(currentStyle){
    if(this.getLastPrice() > this.getLastClose()) {
      return { 
        backgroundColor: UP_COLOR,
        marginRight: currentStyle.marginRight,
        marginLeft: currentStyle.marginLeft,
        marginBottom: currentStyle.marginBottom,
        maxWidth: this.state.hovered ? "25%" : currentStyle.maxWidth
      };
    }
    else if(this.getLastPrice() < this.getLastClose()) {
      return { 
        backgroundColor: DOWN_COLOR,
        marginRight: currentStyle.marginRight,
        marginLeft: currentStyle.marginLeft,
        marginBottom: currentStyle.marginBottom,
        maxWidth: this.state.hovered ? "25%" : currentStyle.maxWidth
      };
    }
    return currentStyle;
  }


  handleClick(){
    const panelId = this.props.graphId + "-panel";
    this.setState({
      selected: !this.state.selected
    });
    if(!document.getElementById(panelId)){
      this.props.onClickCallbackSelect(this.props.graphId-1);
    }
    else{
      window.location.href = '#'+panelId;
    }
  }

  handleMouseLeave(){
    this.setState({
      hovered: false
    });
  }

  handleMouseOver(){
    this.setState({
      hovered: true
    });
  }

  showModal(exchange){
    ModalController.showModal("selectMarketModal", { 
        exchange: exchange,
        id: this.props.graphId
      }
    );
  }

  updateCandles(){
    const payload = {
      "exchange": this.props.ticker.exchange,
      "base": this.props.ticker.base,
      "quote": this.props.ticker.quote,
      "interval": this.props.interval
    }
    ApiController.doPostWithToken("exchange_candles", payload, this.onExchangeCandlesSuccess, payload);
  }

  componentDidUpdate(){
    if(this.props.candles.length === 0){
      this.state.lastPrice = this.props.candles.lastPrice;
    }
  }

  render() {

    let currentStyle = this.props.selected ? 
                        DIV_STYLE_SELECTED : 
                        DIV_STYLE_NOT_SELECTED

    if( this.props.candles.length != 0 ) {
      currentStyle = this.getStyleFromValue(currentStyle);
    }

    let borderClass = "col-md-3 rounded border-2-primary";

    if( this.props.candles.length != 0 ) {
      borderClass = this.getBorderFromValue();
    }

    return (
        <div className={ borderClass }
             style={ currentStyle }
             onMouseOver={ this.handleMouseOver }
             onMouseLeave={ this.handleMouseLeave }>
          { this.props.candles.length != 0 &&
            <div className="col-12">
            <h5 className="border-bottom border-secondary"
                style={ HEADER_STYLE }>
                { this.props.ticker.exchange.toUpperCase() }
                  <Dropdown className={"btn-group float-right"}
                                    id={ this.props.graphId + "-exchangeDropdown" }
                                    buttonText={ "" }
                                    mini={ true }
                                    header="EXCHANGES"
                                    onClickRow={ this.showModal }
                                    dropdownList={ this.buildDropdownList() }
                                    dataTarget={ "selectMarketModal" }/>
                  { this.props.interval.toUpperCase() }
                  <Dropdown className={ "btn-group float-right" }
                                    id={ this.props.graphId + "-intervalDropdown" }
                                    buttonText={ "" }
                                    mini={ true }
                                    header="INTERVALS"
                                    onClickRow={ this.updateInterval }
                                    dropdownList={ Constants.SUPPORTED_INTERVALS }/>
            </h5>
            <div style={ FIRST_ITEM_STYLE }>
              <strong className={ this.props.candles.length != 0 ? 
                                  this.getClassFromValue() : 
                                  "text-primary"
                                }>
                                { this.getMarket() }
              </strong>
              <span className={ "float-right " + 
                                ( this.props.candles.length != 0 ? 
                                  this.getClassFromValue() : 
                                  "text-primary" ) 
                              }
                    style={ FLOAT_RIGHT_STYLE }>
                { this.props.candles.length != 0 ? this.getPercentChange() : "0%" }
              </span>
            </div>
            <div>
              <strong>LAST</strong>
              <span className="float-right"
                    style={ FLOAT_RIGHT_STYLE }>
                { this.props.candles.length != 0 ? this.getLastPriceText() : 0 }
              </span>
            </div>
            <div style={ LAST_ITEM_STYLE }>
              <strong>
                <span> {
                  "VOLUME (" + this.props.ticker.quote + ")"
                  }
                </span>
                <br/>
              </strong>
              <span> 
                { this.props.candles.length != 0 ? parseFloat(this.getLastVolume().toString()) : 0 }
              </span><br/>
            </div>
            <DashboardGraphButton isActive={ document.getElementById(this.graphId + "-panel") }
                                  class={ 
                                    this.props.candles.length != 0 ? 
                                    this.getClassFromValue() : 
                                    "text-primary" 
                                  }
                                  onClick={ this.handleClick }
                                  href={ "#"+ this.graphId + "-panel" }/>
            </div> }
            { this.props.candles.length === 0 &&
              <div>
                <Loader styleOverride={{marginTop: "75px"}}
                        loaderMessage=""/>
                <br/><br/>
              </div>
            }
        </div>
    );
  }
}

