import React from "react";
import CryptoIcon from "../generic/crypto_coin";

const STYLE = {
  marginTop: "25px"
}

export default class MarketPanelHeader extends React.Component {

  constructor(props){
   super(props);
  }
    
  render(){  

    return(
    <div class="float-left" style={ STYLE }>
      <h3 className="text-black">
        <CryptoIcon coinName={this.props.quote.toLowerCase() }/>
        <span style={ { marginTop: "5px" } }>
        <strong> { this.props.exchange.toUpperCase() + 
                " " + this.props.quote.toUpperCase() + " MARKETS" }
        </strong>
        </span>
      </h3>
    </div>
    );
  }
}