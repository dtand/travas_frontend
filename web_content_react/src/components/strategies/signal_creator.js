import React from "react";
import Constants from "../../js/Constants"
import SignalSelectPanel from "./signal_select_panel"


const BACKGROUND_COLOR_BUY = {
  backgroundColor: "#28a74514"
}

const BACKGROUND_COLOR_SELL = {
  backgroundColor: "#a7352814"
}

export default class SignalCreator extends React.Component {

  constructor(props){
    super(props);
    this.state={
      selectedBuySignal: "SMA-BUY",
      selectedSellSignal: "SMA-SELL"
    }
  }


  onSelectSignalBuy = (signal) => {
    this.props.onSelectSignalBuy(signal.signalName);
  }

  onSelectSignalSell = (signal) => {
    this.props.onSelectSignalSell(signal.signalName);
  }

  getClassFromRecommended(recommended){
    if(recommended === "BUY"){
      return "buy-square";
    }
    else if(recommended === "SELL"){
      return "sell-square";
    }
    return "neutral-square"
  }

  buildDropdownBuy(){
    let signals = [];
    let signalNames = [];
    for (let key in Constants.SIGNAL_METADATA) {
      if (Constants.SIGNAL_METADATA.hasOwnProperty(key) && !key.includes("BUY") && !key.includes("SELL")) {    
        const onlySell    = Constants.SIGNAL_METADATA[key].onlySellFlag;
        const recommended = Constants.SIGNAL_METADATA[key].recommended;     
        const type        = Constants.SIGNAL_METADATA[key].type;
        if(this.props.toggledBuyClasses.includes(type) && this.props.toggledBuySignals.includes(recommended.toLowerCase())){
          if(!onlySell){
            signals.push(<span>
              <span className={ this.getClassFromRecommended(recommended) }>
                  <i className="fa fa-circle"/>
              </span>
              <span>
                { key }  
              </span>
            </span>);
            signalNames.push( { 
              signalName: key
            });
          }
        }
      }
    }
    return { 
      signals: signals,
      signalNames: signalNames
    };
  }

  buildDropdownSell(){
    let signals = [];
    let signalNames = [];
    for (let key in Constants.SIGNAL_METADATA) {
      if (Constants.SIGNAL_METADATA.hasOwnProperty(key) && !key.includes("BUY") && !key.includes("SELL")) {           
        const onlyBuy = Constants.SIGNAL_METADATA[key].onlyBuy;
        const recommended = Constants.SIGNAL_METADATA[key].recommended;  
        const type        = Constants.SIGNAL_METADATA[key].type;
        if(this.props.toggledSellClasses.includes(type) && this.props.toggledSellSignals.includes(recommended.toLowerCase())){
          if(!onlyBuy){    
            signals.push(<span>
              <span className={ this.getClassFromRecommended(recommended) }>
                <i className="fa fa-circle"/>
              </span>
              <span>
                { key }  
              </span>
            </span>);
            signalNames.push( { 
              signalName: key
            });
          }
        }
      }
    }
    return { 
      signals: signals,
      signalNames: signalNames
    };
  }

  render() {

    if(this.props.selectedStrategy){
      this.state.selectedBuySignal = this.props.selectedStrategy.buySignals[0];
      this.state.selectedSellSignal = this.props.selectedStrategy.sellSignals[0];
    }
    else{
      this.state.selectedBuySignal = this.props.selectedBuySignal;
      this.state.selectedSellSignal = this.props.selectedSellSignal;
    }

    const buySignals = this.buildDropdownBuy();
    const sellSignals = this.buildDropdownSell();

    return (
      <div>

      <div className="row theme-banner-one border-bottom-4 margin-top-50">
        <div className="col-md-6 signal-selector" style={ BACKGROUND_COLOR_BUY }>
          <SignalSelectPanel buttonClass="btn btn-success dropdown-toggle"
                             selectedSignal={ this.state.selectedBuySignal }
                             onSelectSignal={ this.onSelectSignalBuy }
                             dropdownData={ buySignals.signals }
                             mappedData={ buySignals.signalNames }
                             historicalParameterValues={ this.props.historicalParameterValues.buy }
                             appendParameter={this.props.appendParameter}
                             titleClass="text-success-bold"
                             header="SELECT YOUR BUY SIGNAL"
                             backgroundText="BUY"
                             toggledClasses={ this.props.toggledBuyClasses }
                             toggledSignals={ this.props.toggledBuySignals }
                             toggleClass={ this.props.toggleBuyClass }
                             toggleSignal={ this.props.toggleBuySignal }
                             updateCallback={ this.props.updateCallback }/>
        </div>
        <div className="col-md-6 signal-selector" style={ BACKGROUND_COLOR_SELL }>
          <SignalSelectPanel buttonClass="btn btn-danger dropdown-toggle"
                             selectedSignal={ this.state.selectedSellSignal }
                             onSelectSignal={ this.onSelectSignalSell }
                             dropdownData={ sellSignals.signals }
                             mappedData={ sellSignals.signalNames }
                             historicalParameterValues={ this.props.historicalParameterValues.sell }
                             appendParameter={this.props.appendParameter}
                             titleClass="text-danger-bold"
                             header="SELECT YOUR SELL SIGNAL"
                             backgroundText="SELL"
                             toggledClasses={ this.props.toggledSellClasses }
                             toggledSignals={ this.props.toggledSellSignals }
                             toggleClass={ this.props.toggleSellClass }
                             toggleSignal={ this.props.toggleSellSignal }
                             updateCallback={ this.props.updateCallback }/>
        </div>
      </div>
      </div>
    );
  }
}

