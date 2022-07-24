import React from "react";

const BACKGROUND_BOTS   = require("../../img/gears.png");
const BACKGROUND_USERS  = require("../../img/users.jpg");
const BACKGROUND_TRADES = require("../../img/trades.jpg");

const TRANSPARENCY = {
  backgroundColor: "rgba(216, 230, 248, 0.80)",
  position: "absolute",
  top: "0",
  left: "0",
  width: "100%",
  height: "100%"
}

const TEXT_STYLE = {
  marginTop: "10px",
  color: "black"
}

const MARGIN_BOTTOM = {
  marginBottom: "10px"
}

export default class AlphaField extends React.Component {

  constructor(props){
    super(props);
    this.state={
      hovered: false
    }
    this.onHover  = this.onHover.bind(this);
    this.offHover = this.offHover.bind(this);
  }

  onHover(){
    this.setState({
      hovered: true
    });
  }

  offHover(){
    this.setState({
      hovered: false
    });
  }

  getBackgroundImage(){
    if(this.props.label === "NETWORK"){
      return {
        marginLeft: "50px",
        marginRight: "50px",
        backgroundColor: "white",
        backgroundImage: "url(" + BACKGROUND_USERS + ")",
        width: window.innerWidth /2.75,
        height: window.innherHeight/2.75
      }
    }
    else if(this.props.label === "TRADING BOTS"){
      return {
        marginLeft: "50px",
        marginRight: "50px",
        backgroundColor: "white",
        backgroundImage: "url(" + BACKGROUND_BOTS + ")",
        width: window.innerWidth /3,
        height: window.innherHeight/4
      }
    }
    else if(this.props.label === "TRADE EXECUTION"){
      return {
        marginLeft: "50px",
        marginRight: "50px",
        backgroundColor: "white",
        backgroundImage: "url(" + BACKGROUND_TRADES + ")",
        width: window.innerWidth /3,
        height: window.innherHeight/4
      }
    }
  }

  getClass(){
    if(this.state.hovered){
      return "style_prevu_kit col-md-3 offset-md-1 border-primary-4 rounded-extra clickable";
    }
    return "style_prevu_kit col-md-3 offset-md-1 border-4 rounded-extra clickable";
  }

  render() {
    return (
      <div onMouseEnter={ this.onHover }
           onMouseLeave={ this.offHover }
           className={ this.getClass() } 
           style={ this.getBackgroundImage() }>
        { this.state.hovered  && 
          <div className="rounded-extra" style={ TRANSPARENCY }>
            <h3 style={ TEXT_STYLE  }>
                <div>
                  <div style={ MARGIN_BOTTOM }>
                    { " " + this.props.label} 
                  </div>
                </div>
            </h3>
            <div>
              <span id={this.props.id}>
                { this.props.text }
              </span>
            </div>
          </div> 
        }
      </div>
    );
  }
}

