import React from "react"
import Modal from '../modal'
import ModalController from "../../js/ModalController"
import ApiController from "../../js/ApiController"
import PlatformTemplate from "../platform/platform_template"
import ExchangeMarketsGrid from "./exchange_markets_grid"
import ExchangeModalBody from "../modals/exchange_modal_body"

const MODAL_ID        = "selectMarketModal";
const MODAL_TITLE     = "Select Market";
const MODAL_TITLE_ID  = "marketModalTitle";
const SUBMIT_MODAL_ID = "submitChangeMarket";
const INTERVAL = 60000;

export default class DashboardMain extends React.Component {

  constructor(props){
    super(props);
    this.state={
      showModal: false,
      update: false,
      tickers: [],
      intervals: ["1d","1d","1d","1d","1d","1d","1d","1d"],
      candles: [[],[],[],[],[],[],[],[]],
      loadingIndex: undefined,
      updateCandles: false,
      intervalSet: false,
    }


    const self = this;
    ModalController.registerModal(MODAL_ID, self);
    this.onUpdateTickerSuccess = this.onUpdateTickerSuccess.bind(this);
    this.onUserDashboardSuccess = this.onUserDashboardSuccess.bind(this);
    this.updateCandles = this.updateCandles.bind(this);
    this.onUpdateCandlesSuccess = this.onUpdateCandlesSuccess.bind(this);
    this.updateInterval = this.updateInterval.bind(this);
    this.resetCandles = this.resetCandles.bind(this);
    this.updateAllTickers = this.updateAllTickers.bind(this);
  }

  async onUserDashboardSuccess(response){
    this.state.tickers = response.tickers;
    this.updateAllTickers();
    if(!this.state.intervalSet){
      setInterval(this.updateAllTickers, INTERVAL);
      this.state.intervalSet = true;
    }
    this.setState({
      tickers: response.tickers
  });
  }

 async updateAllTickers(){
    for(let t=0;t<this.state.tickers.length;t++){
      this.updateCandles(this.state.tickers[t],t,this.state.intervals[t]);
    }
 }

 async updateInterval(index,interval){
   this.state.intervals[index] = interval;
   this.updateCandles(this.state.tickers[index],index,interval);
   this.resetCandles(index);
 }

  async updateTicker(tickerId,exchange,base,quote){
    const payload = {
      tickerBox: tickerId,
      ticker:{
        "exchange": exchange,
        "base": base,
        "quote": quote
      }
    }
    ApiController.doPostWithToken("update_tickers",payload,this.onUpdateTickerSuccess,payload);
    this.resetCandles(tickerId-1);
  }

  async onUpdateTickerSuccess(response,params){
    this.state.tickers[params.tickerBox-1] = params.ticker;
    this.updateCandles(params.ticker,params.tickerBox-1,this.state.intervals[params.tickerBox-1]);
    this.setState({
      tickers: this.state.tickers
    });
  }


  componentDidMount(){
    const payload = {
        "numSignals": 1
    }
    ApiController.doPostWithToken("user_dashboard", payload, this.onUserDashboardSuccess);
  }

  componentDidUpdate(){
    this.state.updateCandles = false;
    this.state.loadingIndex  = undefined;
  }


  async onUpdateCandlesSuccess(response, params){
    this.state.candles[params.index]   = response;
    this.state.intervals[params.index] = params.interval;
    this.setState({
      candles: this.state.candles,
      intervals: this.state.intervals
    });
  }

  updateCandles(ticker,index,interval){
    const payload = {
      "exchange": ticker.exchange,
      "base": ticker.base,
      "quote": ticker.quote,
      "interval": interval
    }
    ApiController.doPostWithToken("exchange_candles", payload, this.onUpdateCandlesSuccess, {
      index: index,
      interval: interval
    });
  }

  resetCandles(index){
    this.state.candles[index] = [];
    this.setState({
      candles: this.state.candles
    });
  }

  render() {

    const self = this;

    return (
      <div>
        {<PlatformTemplate title="Dashboard"
                           subtitle="Aggregation"
                           serviceComponent={ 
                            <ExchangeMarketsGrid tickers={ this.state.tickers }
                                                 loadingIndex={ this.state.loadingIndex }
                                                 updateTickers={ this.state.updateTickers }
                                                 updateCandles={ this.updateCandles }
                                                 updateInterval={ this.updateInterval }
                                                 candles={ this.state.candles }
                                                 intervals={ this.state.intervals }/> 
                          }/> }
      <button class="btn btn-primary"
         onClick={ function(){
         ModalController.showModal(MODAL_ID); 
        }
      }>modal</button>
        { ModalController.modals[MODAL_ID] &&
          this.state.showModal &&
          <Modal modalId={ MODAL_ID }
            titleId={ MODAL_TITLE_ID }
            title={ MODAL_TITLE }
            modalBody={ <ExchangeModalBody onSubmit={ function(){
              const service = self;
              const data    = ModalController.getData(MODAL_ID);
              ModalController.hideModal(MODAL_ID);
              service.updateTicker(data.graphId, 
                                   data.selectedExchange,
                                   data.selectedBase,
                                   data.selectedQuote);
            } }/> }
            submitId={ SUBMIT_MODAL_ID }
            service={ self }
            />
        }
      </div>
    );
  }
}
