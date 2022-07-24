import React from "react";

const MARGIN_BOTTOM = "5px";

const BORDER_WEIGHT = "2px";

const TEXT_STYLE = {
  marginTop: "10px",
  marginLeft: "5px",
  marginRight: "5px",
  marginBottom: "2px"
}

const TEXT_STYLE_NESTED_FIRST = {
  marginLeft: "5px",
  marginTop: "10px",
  fontSize: "11px"
}

export default class MarketBoxMobile extends React.Component {

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
        width: "30%",
      }

      return(
      <div class="margins-5 border-2-secondary" style={ style }>
          <div class="col-md-12 text-center">
          <button class="close float-right margin-right-5" 
                  type="button" 
                  aria-label="Close"
                  onClick={ this.handleClose }>
                  <span aria-hidden="true">X</span>
          </button>
          </div>
          <div className="text-secondary">
            <h5 style={ TEXT_STYLE }
                className="text-left">
                { this.props.data.exchange.toUpperCase() }
            </h5>
            <p style={ TEXT_STYLE_NESTED_FIRST }
                className="text-left">
                { this.props.data.market.toUpperCase() + " (" + this.props.data.interval + ")" }
                <br/>
                { this.props.data.strategy.name }
            </p>
          </div>
      </div>
      );
    }
}