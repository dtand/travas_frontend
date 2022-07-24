import React from "react";
import SimpleToggle from "../generic/simple_toggle";
import ValueSpinner from "../strategies/value_spinner";

export default class BacktestToggleSelector extends React.Component {

  constructor(props){
    super(props);
  }

  render() {
    const self = this;
    return (
      <div className="col-md-2">
        { this.props.selectedGraph === "networth" && 
          <SimpleToggle active={ this.props.buyAndHold }
                        label="Buy & Hold"
                        onChange={ () => 
                          { self.props.parent.setState( { buyAndHold: !self.props.buyAndHold } ) } 
                        }/>
        }
        { this.props.selectedGraph === "networth" && 
          <SimpleToggle active={ this.props.logScale }
                        label="Log Scale"
                        onChange={ () => 
                          { self.props.parent.setState( 
                            { 
                              logScale: !self.props.logScale,
                              percentChange: false
                            } 
                          ) 
                        }
                        }/>
        }
        { (this.props.selectedGraph === "networth" || 
            this.props.selectedGraph === "indicators") && 
          <SimpleToggle active={ this.props.buySignals }
                        label="Buy Signals"
                        onChange={ () => 
                          { self.props.parent.setState( { buySignals: !self.props.buySignals } ) } 
                        }/>
        }
        { (this.props.selectedGraph === "networth" ||
            this.props.selectedGraph === "indicators") && 
          <SimpleToggle active={ this.props.sellSignals }
                        label="Sell Signals"
                        onChange={ () => 
                          { self.props.parent.setState( { sellSignals: !self.props.sellSignals } ) } 
                        }/>
        }
    </div>
  )}
}

