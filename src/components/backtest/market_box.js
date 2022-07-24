import React from "react";
import CryptoIcon from "../generic/crypto_coin";

const MARGIN_BOTTOM = "5px";

const BORDER_WEIGHT = "2px";

const CLOSE_BUTTON_STYLE = {
  right: "5px",
  top: "2px"
}

const TEXT_STYLE = {
  marginTop: "10px",
  marginLeft: "10px",
  marginRight: "10px",
  marginBottom: "5px"
}

const TEXT_STYLE_NESTED_FIRST = {
  marginLeft: "25px",
  marginTop: "10px"
}

const TEXT_STYLE_NESTED_SECOND = {
  marginLeft: "25px"
}

const TOP_LEFT = {
  marginTop: "5px"
}

export default class MarketBox extends React.Component {

    constructor(props){
        super(props);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose(){
      this.props.removeMarket(this.props.data);
    }
    
    render(){

      const style = {
        backgroundImage: "linear-gradient(white, rgb(244, 247, 251))",
        marginBottom: MARGIN_BOTTOM,
        borderWidth: BORDER_WEIGHT,
        width: "100%"
      }

      return(
      <div class="border-2-secondary style_prevu_kit_sm" style={ style }>
        <div class="col-md-12 text-center">
        <button class="close float-right" 
                type="button" 
                aria-label="Close"
                style={ CLOSE_BUTTON_STYLE }
                onClick={ this.handleClose }>
                <span aria-hidden="true">X</span>
        </button>
        </div>
        <div className="text-secondary">
          <h2 style={ TEXT_STYLE }
              className="text-left">
              { this.props.data.exchange.toUpperCase() }
          </h2>
          <h5 style={ TEXT_STYLE_NESTED_FIRST }
              className="text-left">
              { this.props.data.market.toUpperCase() + " (" + this.props.data.interval + ")" }
          </h5>
          <h5 style={ TEXT_STYLE_NESTED_SECOND }
              className="text-left">
              { this.props.data.strategy.name }
          </h5>
        </div>
        { this.props.data.strategy.name.length < 30 && <br/> } 
        <div className="row margins-10">
            <div className="col-sm-3"><CryptoIcon coinName={ this.props.data.market.split("-")[0].toLowerCase() }/></div>
            <div className="col-sm-2">{ " " }{ <i className="fa fa-arrows-h"/> }{ " " }</div>
            <div className="col-sm-3"><CryptoIcon coinName={ this.props.data.market.split("-")[1].toLowerCase() }/></div>
        </div>
      </div>
      );
    }
}