import React from "react";
import CryptoIcon from "../generic/crypto_coin";
import ApiController from "../../js/ApiController";

export default class NavTicker extends React.Component {

  constructor(props){
    super(props);
    this.state={
      lastPrice: "?",
      lastClose: "?"
    }
    this.updateTicker = this.updateTicker.bind(this);
    this.onUpdateTickerSuccess = this.onUpdateTickerSuccess.bind(this);
  }

  getPercentChangeText(){

    if(percentChange === 0 || 
       this.state.lastPrice === "?" ||
       this.state.lastPrice === "NO DATA"){
      return "0.00%";
    }

    const percentChange = (( this.state.lastPrice / this.state.lastClose) - 1.00) * 100;

    if(this.state.lastPrice > this.state.lastClose) {
      return <span className="text-success">
              { " ↑" + Number.parseFloat(percentChange).toFixed(2) + "%" }
            </span>;
    }
    else if(this.state.lastPrice < this.state.lastClose) {
      return <span className="text-danger">
               {  " ↓" + Number.parseFloat(percentChange*-1).toFixed(2) + "%" }
             </span> 
    }
    else {
      return <span className="text-primary">
        { Number.parseFloat(percentChange).toFixed(2) + "%" }
      </span>
    }
  }

  onUpdateTickerSuccess(response){
    const lastClose = response.priceData.length != 0 ? 
                      response.priceData[response.priceData.length-1].close : 
                      "NO DATA";
    const lastPrice = response.lastPrice !== 0 ? 
                      response.lastPrice.close :
                      0;

    this.setState({
      lastClose: lastClose,
      lastPrice: lastPrice
    });
  }

  updateTicker(){
    const payload = {
      "exchange": this.props.ticker.exchange,
      "base": this.props.ticker.base,
      "quote": this.props.ticker.quote,
      "interval": "1d"
    }

    ApiController.doPost(
      "exchange_candles", 
      payload, 
      this.onUpdateTickerSuccess, 
      payload
    );
  }

  componentDidMount(){
    const self = this;
    setInterval(this.updateTicker,60000);
    this.updateTicker();
  }


  componentDidUpdate(){
    if(this.props.updateTicker){
      this.updateTicker();
    }
  }

  render() {
    return (
      <div className="nav-ticker col-s-12">
        <div className="row">
          <div className="col-s-4">
            <CryptoIcon coinName={ this.props.ticker.base.toLowerCase() }/>
          </div>
          <div className="col-s-4 text-left margin-left-10 text-secondary">
            <i>
              { this.props.ticker.base.toUpperCase() + 
                "-" + 
                this.props.ticker.quote.toUpperCase() 
              } 
              <br/> 
              { this.props.ticker.exchange.toUpperCase() }
            </i>
          </div>
          <div className="col-s-4 margin-left-10 text-secondary">
            <i>
              { this.state.lastPrice !== "?" ? Number(this.state.lastPrice).toString() : "Loading..." } <br/> 
              { this.getPercentChangeText() }
            </i>
          </div>
        </div>
      </div>
    );
  }
}

