import React from "react";

export default class ExchangeMarketTitle extends React.Component {

  constructor(props){
      super(props);
  }

  generateMarketString(){
      return this.props.base.toUpperCase() + 
             "-" + 
            this.props.quote.toUpperCase() +
            " (" + 
            this.props.exchange.toUpperCase() + 
            ") " + 
            this.props.interval.toUpperCase();
  }

  generateExchangeString(){
      
  }
  
  render() {
    return (
        <h1 id={ this.props.graphId + "-market" }>
          { this.generateMarketString() }
		</h1>
    );
  }
}
