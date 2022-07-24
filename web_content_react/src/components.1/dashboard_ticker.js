
import React from "react"
import ApiController from "../js/ApiController"
import ExchangeDropdown from "./exchange_dropdown"
import Constants from "../js/Constants";

const UP_COLOR = "#cbfdd7";
const DOWN_COLOR = "rgba(251, 214, 218, 1.0)";
const NEUTRAL_COLOR = "#e2e2e2";
const INTERVAL = 60000;

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
        lastTick: ""
      }
      this.onExchangeCandlesSuccess = this.onExchangeCandlesSuccess.bind(this);
      this.handleClick = this.handleClick.bind(this)
      this.handleMouseLeave = this.handleMouseLeave.bind(this)
      this.handleMouseOver = this.handleMouseOver.bind(this)
      this.updateInterval = this.updateInterval.bind(this)
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

  getLastPrice(){
    return this.state.candles.lastPrice.close;
  }

  getLastClose(){
    const priceData = this.state.candles.priceData;
    return priceData[priceData.length-1].close;
  }

  getLastVolume(){
    const priceData = this.state.candles.priceData;
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

  async onExchangeCandlesSuccess(response, params){
    
    let lastTick = "";

    if(this.state.candles && this.getLastPrice() != response.lastPrice.close){
      if(this.getLastPrice() > response.lastPrice.close){
        lastTick = "↑";
      }
      else{
        lastTick = "↓";
      }
    }

    const panelId = this.props.graphId + "-panel";

    this.setState({
      interval: params.interval,
      candles: response,
      lastTick: lastTick
    })

    if(document.getElementById(panelId)){
      //this.props.onClickCallbackSelect(this.props.index, this.state.candles, this.state.interval);
      this.props.onClickCallbackSelect({
        ticker: this.props.ticker,
        candles: response,
        index: this.props.index,
        interval: params.interval
      })
    }
  }


  handleClick(){
    const panelId = this.props.graphId + "-panel";
    this.setState({
      selected: !this.state.selected
    });
    if(!document.getElementById(panelId)){
      this.props.onClickCallbackSelect({
        ticker: this.props.ticker,
        candles: this.state.candles,
        index: this.props.index,
        interval: this.state.interval
      })
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

  updateInterval(interval){
    this.state.interval = interval;
    const payload = {
      "exchange": this.props.ticker.exchange,
      "base": this.props.ticker.base,
      "quote": this.props.ticker.quote,
      "interval": this.state.interval 
    }
    ApiController.doPostWithToken("exchange_candles", payload, this.onExchangeCandlesSuccess, payload);
  }

  componentDidMount(){
    const payload = {
      "exchange": this.props.ticker.exchange,
      "base": this.props.ticker.base,
      "quote": this.props.ticker.quote,
      "interval": this.state.interval ? this.state.interval : "1d"
    }
    ApiController.doPostWithToken("exchange_candles", payload, this.onExchangeCandlesSuccess, payload);

    const self = this;
    setInterval(function(){
        const payload = {
          "exchange": self.props.ticker.exchange,
          "base": self.props.ticker.base,
          "quote": self.props.ticker.quote,
          "interval": self.state.interval ? self.state.interval : "1d"
        }
        ApiController.doPostWithToken("exchange_candles", payload, self.onExchangeCandlesSuccess, payload);
      }, INTERVAL
    );
  }

  render() {

    let currentStyle = this.props.selected ? 
                        DIV_STYLE_SELECTED : 
                        DIV_STYLE_NOT_SELECTED

    if( this.state && this.state.candles ) {
      currentStyle = this.getStyleFromValue(currentStyle);
    }

    let borderClass = "col-md-3 rounded border-2-primary";

    if( this.state && this.state.candles ) {
      borderClass = this.getBorderFromValue();
    }

    return (
        <div className={ borderClass }
             style={ currentStyle }
             onMouseOver={ this.handleMouseOver }
             onMouseLeave={ this.handleMouseLeave }>
          <div className="col-12">
          <h5 className="border-bottom border-secondary"
              style={ HEADER_STYLE }>
              { this.props.ticker.exchange.toUpperCase() }
                <ExchangeDropdown className={"btn-group float-right"}
                                  id={ this.props.graphId + "-exchangeDropdown" }
                                  buttonText={ "" }
                                  mini={ true }
                                  header="EXCHANGES"
                                  dropdownList={ Constants.SUPPORTED_EXCHANGES }/>
                { this.state.interval ? this.state.interval.toUpperCase() : "1D" }
                <ExchangeDropdown className={ "btn-group float-right" }
                                  id={ this.props.graphId + "-intervalDropdown" }
                                  buttonText={ "" }
                                  mini={ true }
                                  header="INTERVALS"
                                  onClickRow={ this.updateInterval }
                                  dropdownList={ Constants.SUPPORTED_INTERVALS }/>
          </h5>
          <div style={ FIRST_ITEM_STYLE }>
            <strong className={ this.state && this.state.candles ? 
                                this.getClassFromValue() : 
                                "text-primary"
                              }>
                              { this.getMarket() }
            </strong>
            <span className={ "float-right " + 
                              ( this.state && this.state.candles ? 
                                this.getClassFromValue() : 
                                "text-primary" ) 
                            }
                  style={ FLOAT_RIGHT_STYLE }>
              { this.state && this.state.candles ? this.getPercentChange() : "0%" }
            </span>
          </div>
          <div>
            <strong>LAST</strong>
            <span className="float-right"
                  style={ FLOAT_RIGHT_STYLE }>
              { this.state && this.state.candles ? this.state.lastTick + parseFloat(this.getLastPrice().toString()) : 0 }
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
              { this.state && this.state.candles ? parseFloat(this.getLastVolume().toString()) : 0 }
            </span><br/>
          </div>
          <div>
            <a class={ this.state && this.state.candles ? 
                                this.getClassFromValue() : 
                                "text-primary" }
                  onClick={ this.handleClick }
                  style={ GRAPH_BUTTON_STYLE }>
              <i class="fa fa-fw fa-area-chart">↓</i>
            </a>
            </div>
          </div>
        </div>
    );
  }
}

