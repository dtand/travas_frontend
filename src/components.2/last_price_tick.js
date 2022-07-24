import React from "react";

const BORDER_STYLE = {
    borderColor: "rgb(21, 121, 246)",
    borderBottom: "3px"
}

export default class ExchangeMarketTitle extends React.Component {

  constructor(props){
      super(props);
  }

  generatePriceString() {
    return this.props.lastPrice.toString() + " " + this.generateTickerString();
  }

  generateTickerString() {

      const percentChange = ((this.props.lastPrice / this.props.closePrice) - 1.00) * 100;

      if(this.props.lastPrice > this.props.closePrice) {
        return Number.parseFloat(this.props.lastPrice).toFixed(8) + " ↑" + Number.parseFloat(percentChange).toFixed(2) + "%";
      }
      else if(this.props.lastPrice < this.props.closePrice) {
        return Number.parseFloat(this.props.lastPrice).toFixed(8) + " ↓" + Number.parseFloat(percentChange*-1).toFixed(2) + "%";
      }
      else {
        return Number.parseFloat(this.props.lastPrice).toFixed(8) + " " + Number.parseFloat(percentChange).toFixed(2) + "%";
      }
  }
  
  render() {
    
    let textClass = "text-primary text-center";

    if(this.props.lastPrice > this.props.closePrice){
        textClass = "text-success text-center";
    }

    else if(this.props.lastPrice < this.props.closePrice){
        textClass = "text-danger text-center";
    }

    return (
        <div className="row border-bottom text-center" style={ BORDER_STYLE }>
		  <div className="col-md-12">
            <h2 className={ textClass } 
                id={ this.props.graphId + "-price" }>
                { this.generateTickerString() }
            </h2>
			</div>
		</div>
    );
  }
}
