import React from "react";
import AlphaField from "./alpha_field";
import AlphaFieldMobile from "./alpha_field_mobile";
import Constants from "../../js/Constants";


const MARGINS = {
  marginLeft: "25px"
}

const TEXT_STYLE = {
  marginLeft: "10px",
  marginRight: "10px",
  color: "black"
}


/**
 * Defines the alpha summary component which contains information
 * about the alpha state
 */
export default class AlphaSummary extends React.Component {

  /**
   * Setup state and link function bindings
   * @param {*} props 
   */
  constructor (props){
    super(props);
  }

  getUsersDescription(){
    return (<p style={ !Constants.IS_MOBILE ? TEXT_STYLE : {} }>
      Travas is in open alpha and the platform is currently supporting <span className="text-primary"> <strong> {this.props.users + " users"}</strong></span>.  
      Join us today and help build the most intuitive algo-trading platform for cryptocurrency trading.  <a href="signup">SIGNUP >></a>
    </p>);
  }

  getBotsDescription(){
    return (<p style={ !Constants.IS_MOBILE ? TEXT_STYLE : {} }>
      Build and configure trading bots on the fly with our simplistic
      bot factory.  Travas currently has  <span className="text-primary"> <strong> {this.props.bots + " active bots "} </strong> </span> 
       running on our servers.  Join us today and build your own unique trading bots!  <a href="signup">SIGNUP >></a>
    </p>);   
  }

  getTradesDescription(){
    return (<p style={ !Constants.IS_MOBILE ? TEXT_STYLE : {}  }>
      Our servers can support thousands of trading bots each, which monitor hundreds of markets 24/7.  
      Travas has already processed <span className="text-primary"> <strong> {this.props.trades + " trades "} </strong></span> 
      .  Start executing trades with just a few clicks today.  <a href="signup">SIGNUP >></a> 
    </p>);   
  }

  /**
  * Renders a divider with alpha user's field, active bots field and total trades 
  */
  render() {
    return (
      <div className="row text-center">
        { !Constants.IS_MOBILE && 
          <div>
            <AlphaField iconName="gears" label="TRADING BOTS" text={this.getBotsDescription()} id="activeBotsCount"/>
            <AlphaField iconName="exchange" label="TRADE EXECUTION" text={this.getTradesDescription()} id="tradesCount"/>
            <AlphaField iconName="user" label="NETWORK" text={this.getUsersDescription()} id="alphaUsersCount"/>
          </div>
        }
        { Constants.IS_MOBILE && 
          <div>
            <AlphaFieldMobile iconName="gears" label="TRADING BOTS" text={this.getBotsDescription()} id="activeBotsCount"/>
            <br/>
            <AlphaFieldMobile iconName="exchange" label="TRADE EXECUTION" text={this.getTradesDescription()} id="tradesCount"/>
            <br/>
            <AlphaFieldMobile iconName="user" label="NETWORK" text={this.getUsersDescription()} id="alphaUsersCount"/>
            <br/>
          </div>
        }
      </div>
    );
  }
}
