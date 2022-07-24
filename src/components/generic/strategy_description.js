import React from "react"

export default class StrategyDescription extends React.Component {

    constructor(props){
        super(props);
    }

    //[{"period":21,"threshold":20,"signal":"RSI-BUY"}]
    mapSignals(signal,keys,type,className){
      let parameters = keys.map((value,index) => 
            <h6 className="text-secondary margin-left-5">
                { value.toUpperCase() + ": " }
                { signal[value] }
            </h6>
      );
      return(
          <div>
              <h5 className={ "border-bottom " + className }> 
                { type.toUpperCase() + " SIGNAL - "}
                { signal.signal.toUpperCase() } 
              </h5>
              { parameters }
          </div>
      )
    }
    render() {
        const buySignal  = this.props.strategy.buySignals[0];
        const sellSignal = this.props.strategy.sellSignals[0];

        return(
        <div className="scroll-overflow-vertical">
            <h3 className="text-left text-black"> 
                { this.props.strategy.name.toUpperCase() } 
            </h3>
            <div className="row margin-right-10">
                <div className="col-md-12 text-left">
                    { this.mapSignals(
                        buySignal,
                        Object.keys(buySignal),
                        "BUY",
                        "text-success") 
                    }
                </div>
                <div className="col-md-12 text-left margin-top-5">
                    { this.mapSignals(
                        sellSignal,
                        Object.keys(sellSignal),
                        "SELL",
                        "text-primary") 
                    }
                </div>
                <div className="col-md-12 text-left margin-top-5">
                <div>
                    <h5 className="border-bottom text-danger"> 
                        STOP LOSS - { this.props.strategy.stopLoss.type.toUpperCase() }
                    </h5>
                    <h6 className="text-blacktext-left margin-left-5">
                        { "LOSS PERCENT: " + (this.props.strategy.stopLoss.stopLossPercent*100).toFixed(0) + "%" }
                    </h6>
                </div>
                </div>
                <div className="col-md-12 text-left margin-top-5 margin-left-5">
                    <i className="text-black text-left">
                        { this.props.strategy.description !== "" ? 
                        this.props.strategy.description : 
                        "No description"
                        }
                    </i>
                </div>
            </div>
        </div>
    );
  }
}