import React from "react"
import ApiController from "../../js/ApiController"
import ExchangeMarketsGrid from "./exchange_markets_grid"

const INTERVAL        = 60000;

export default class DashboardService extends React.Component {

  constructor(props){
    super(props);
    this.state={
      update: false,
      tickers: [],
      intervals: ["1d","1d","1d","1d","1d","1d","1d","1d"],
      candles: [[],[],[],[],[],[],[],[]],
      loadingIndex: undefined,
      updateCandles: false,
      intervalSet: false,
    }

    const self = this;

    this.setIntervals = [];
    //ModalController.registerModal(MODAL_ID, self);
    this.onUserDashboardSuccess = this.onUserDashboardSuccess.bind(this);
    this.updateCandles = this.updateCandles.bind(this);
    this.onUpdateCandlesSuccess = this.onUpdateCandlesSuccess.bind(this);
    this.updateInterval = this.updateInterval.bind(this);
    this.resetCandles = this.resetCandles.bind(this);
    this.updateAllTickers = this.updateAllTickers.bind(this);
  }

  async onUserDashboardSuccess(tickers){
    this.updateAllTickers();
    if(!this.state.intervalSet){
      this.setIntervals.push(setInterval(this.updateAllTickers, INTERVAL));
      this.state.intervalSet = true;
    }
  }

  async updateAllTickers(){
      for(let t=0;t<this.props.tickers.length;t++){
        this.updateCandles(this.props.tickers[t],t,this.state.intervals[t]);
      }
  }

  async updateInterval(index,interval){
    this.state.intervals[index] = interval;
    this.updateCandles(this.props.tickers[index],index,interval);
    this.resetCandles(index);
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
    ApiController.doPostWithTokenNoCache(
      "exchange_candles", 
      payload, 
      this.onUpdateCandlesSuccess, {
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

  componentDidMount(){
    this.onUserDashboardSuccess(this.props.tickers);
  }

  componentDidUpdate(){
    this.state.updateCandles = false;
    this.state.loadingIndex  = undefined;
    if(this.props.updateTicker){
      this.resetCandles(this.props.updateTicker-1);
      this.updateCandles(
        this.props.tickers[this.props.updateTicker-1],
        this.props.updateTicker-1,
        this.state.intervals[this.props.updateTicker-1]
      );
    }
  }

  componentWillUnmount(){
    for(let i=0;i<this.setIntervals.length;i++){
      clearInterval(this.setIntervals[i]);
    }
  }

  render() {

    const self = this;

    return (
      <div> 
        <ExchangeMarketsGrid tickers={ this.props.tickers }
                             loadingIndex={ this.state.loadingIndex }
                             updateTickers={ this.state.updateTickers }
                             updateCandles={ this.updateCandles }
                             updateInterval={ this.updateInterval }
                             candles={ this.state.candles }
                             intervals={ this.state.intervals }/> 
      </div>
    );
  }
}
